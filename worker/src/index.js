// 财管帝国 · Cloudflare 联机服务
// ---------------------------------------------------------------
// 架构：每个房间 = 一个 Durable Object（RoomDO）
//   - 房间状态（玩家、手牌、牌堆、回合）持久化在 DO storage
//   - WebSocket 把状态变更实时推送给房间内所有在线客户端
// 接口：
//   POST /api/rooms              { code, state }      建房（state 由客户端生成）
//   GET  /api/rooms/:code                             取房间状态
//   POST /api/rooms/:code/join   { playerId, name }   加入房间（服务端原子操作）
//   POST /api/rooms/:code/state  { playerId, state }  保存状态（version 乐观并发校验）
//   GET  /api/rooms/:code/ws                          WebSocket 实时订阅
//   GET  /api/ping                                    连通性检查

const CODE_RE = /^[A-Z0-9]{6}$/;
const MAX_PLAYERS = 4;
const COLORS = ['#f1c56f', '#7db8ff', '#63d9ad', '#bc9aff'];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}

function makePlayer(id, name) {
  return {
    id,
    name: String(name || '').trim().slice(0, 12) || '匿名企业家',
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    cash: 300,
    equity: 500,
    debt: 0,
    ev: 500,
    lastEbit: 0,
    lastNet: 0,
    assets: [],
    loans: [],
    hand: [],
    status: 'alive',
    actions: 0,
    flags: {},
    highDebtRounds: 0,
  };
}

export class RoomDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async load() {
    return this.state.storage.get('state');
  }

  async persist(game) {
    game.updatedAt = Date.now();
    await this.state.storage.put('state', game);
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    for (const ws of this.state.getWebSockets()) {
      try {
        ws.send(data);
      } catch {
        // 连接已失效，忽略
      }
    }
  }

  async handleCreate(body) {
    const existing = await this.load();
    if (existing) return json({ error: '房间码已被占用，请重试。' }, 409);

    const code = String(body?.code || '').toUpperCase();
    if (!CODE_RE.test(code)) return json({ error: '无效房间码。' }, 400);

    const game = body?.state;
    if (!game || !Array.isArray(game.players) || game.players.length === 0 || game.hostId == null) {
      return json({ error: '无效的初始状态。' }, 400);
    }

    game.code = code;
    game.version = 1;
    await this.persist(game);
    return json({ ok: true, state: game });
  }

  async handleGet(code) {
    const game = await this.load();
    if (!game) return json({ error: '没有找到这个房间。请检查邀请码和联机方式。' }, 404);
    return json({ ok: true, state: game });
  }

  async handleJoin(code, body) {
    const game = await this.load();
    if (!game) return json({ error: '没有找到这个房间。请检查邀请码和联机方式。' }, 404);
    if (game.phase !== 'lobby') return json({ error: '该对局已经开始，暂不支持中途加入。' }, 409);
    if (game.players.length >= MAX_PLAYERS) return json({ error: '房间已满（最多 4 位企业家）。' }, 409);

    const playerId = String(body?.playerId || '');
    if (!playerId) return json({ error: '缺少玩家标识。' }, 400);

    let player = game.players.find((item) => item.id === playerId);
    if (!player) {
      player = makePlayer(playerId, body?.name);
      game.players.push(player);
      game.version = (game.version || 1) + 1;
      game.log = [{ round: 0, text: `${player.name} 加入了房间。` }, ...(game.log || [])].slice(0, 80);
    }

    await this.persist(game);
    this.broadcast({ type: 'state', state: game });
    return json({ ok: true, state: game });
  }

  async handleSave(code, body) {
    const game = await this.load();
    if (!game) return json({ error: '没有找到这个房间。' }, 404);

    const playerId = String(body?.playerId || '');
    if (!game.players.some((item) => item.id === playerId)) {
      return json({ error: '你不是这个房间的玩家。' }, 403);
    }

    const incoming = body?.state;
    if (!incoming || incoming.code !== code) return json({ error: '房间码不匹配。' }, 400);
    if ((incoming.version || 0) <= (game.version || 0)) {
      return json({ error: '状态已过期，已为你拉取最新进度。' }, 409);
    }

    await this.persist(incoming);
    this.broadcast({ type: 'state', state: incoming });
    return json({ ok: true, state: incoming });
  }

  async handleWebSocket(code) {
    const game = await this.load();
    if (!game) return json({ error: '没有找到这个房间。' }, 404);

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.state.acceptWebSocket(server);
    server.send(JSON.stringify({ type: 'state', state: game }));
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, message) {
    try {
      const data = JSON.parse(message);
      if (data?.type === 'ping') ws.send(JSON.stringify({ type: 'pong' }));
    } catch {
      // 忽略无法解析的消息
    }
  }

  async fetch(request) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean); // ['api','rooms',code?,action?]

    if (request.method === 'OPTIONS') return json({ ok: true });

    const body = request.method === 'POST' ? await request.json().catch(() => null) : null;

    // POST /api/rooms —— 建房
    if (segments.length === 2) {
      if (request.method === 'POST') return this.handleCreate(body);
      return json({ error: 'Method not allowed' }, 405);
    }

    const code = (segments[2] || '').toUpperCase();

    // GET /api/rooms/:code
    if (segments.length === 3) {
      if (request.method === 'GET') return this.handleGet(code);
      return json({ error: 'Method not allowed' }, 405);
    }

    if (segments.length === 4) {
      if (segments[3] === 'ws') return this.handleWebSocket(code);
      if (request.method === 'POST' && segments[3] === 'join') return this.handleJoin(code, body);
      if (request.method === 'POST' && segments[3] === 'state') return this.handleSave(code, body);
    }

    return json({ error: 'Not found' }, 404);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);

    if (request.method === 'OPTIONS') return json({ ok: true }); // 跨域预检
    if (url.pathname === '/api/ping') return json({ ok: true, ts: Date.now() });
    if (segments[0] !== 'api' || segments[1] !== 'rooms') return json({ error: 'Not found' }, 404);

    // 建房时需要先从请求体读出房间码，再路由到对应的 Durable Object
    if (segments.length === 2 && request.method === 'POST') {
      const body = await request.json().catch(() => null);
      const code = String(body?.code || '').toUpperCase();
      if (!CODE_RE.test(code)) return json({ error: '无效房间码。' }, 400);
      const stub = env.ROOM.get(env.ROOM.idFromName(code));
      return stub.fetch(
        new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(body),
        })
      );
    }

    const code = (segments[2] || '').toUpperCase();
    if (!CODE_RE.test(code)) return json({ error: '无效房间码。' }, 400);
    const stub = env.ROOM.get(env.ROOM.idFromName(code));
    return stub.fetch(request);
  },
};