// 本地测试：用内存模拟 DO storage 与 WebSocket，跑通完整房间流程。
import router, { RoomDO } from '../src/index.js';

let passed = 0;
function assert(condition, message) {
  if (!condition) {
    console.error('✗ ' + message);
    process.exit(1);
  }
  passed++;
  console.log('✓ ' + message);
}

function makeFakeWebSocket() {
  return {
    sent: [],
    send(message) {
      this.sent.push(typeof message === 'string' ? JSON.parse(message) : message);
    },
    close() {},
    addEventListener() {},
  };
}

globalThis.WebSocketPair = class {
  constructor() {
    this[0] = makeFakeWebSocket();
    this[1] = makeFakeWebSocket();
  }
};
// Node 原生 Response 不接受 101，包装一层以模拟 Workers 的 WebSocket 升级响应
const NativeResponse = globalThis.Response;
class TestResponse {
  constructor(body, init = {}) {
    this.status = init.status ?? 200;
    if (init.status === 101) {
      this._inner = new NativeResponse(null, { status: 200 });
      this.webSocket = init.webSocket;
    } else {
      this._inner = new NativeResponse(body, init);
    }
    this.headers = this._inner.headers;
  }
  get ok() {
    return this.status >= 200 && this.status < 300;
  }
  json() {
    return this._inner.json();
  }
  text() {
    return this._inner.text();
  }
}
globalThis.Response = TestResponse;


function makeEnv() {
  const rooms = new Map();
  const socketsByRoom = new Map();
  const env = {
    ROOM: {
      idFromName: (name) => String(name),
      get: (id) => {
        if (!rooms.has(id)) {
          const storageMap = new Map();
          const sockets = new Set();
          socketsByRoom.set(id, sockets);
          const state = {
            storage: {
              get: async (key) => storageMap.get(key) ?? null,
              put: async (key, value) => storageMap.set(key, value),
              delete: async (key) => storageMap.delete(key),
            },
            acceptWebSocket: (ws) => sockets.add(ws),
            getWebSockets: () => [...sockets],
          };
          rooms.set(id, new RoomDO(state, {}));
        }
        const room = rooms.get(id);
        return { fetch: (request) => room.fetch(request) };
      },
    },
  };
  return { env, socketsByRoom };
}

const { env, socketsByRoom } = makeEnv();
const BASE = 'https://capital-empire.test';

function makeGame(code, hostId) {
  return {
    version: 0,
    code,
    hostId,
    phase: 'lobby',
    round: 0,
    turnIndex: 0,
    market: null,
    marketDeck: ['M01', 'M02'],
    deck: ['A01', 'F01', 'S01'],
    discard: [],
    players: [
      {
        id: hostId,
        name: '林总',
        color: '#f1c56f',
        cash: 300,
        equity: 500,
        debt: 0,
        ev: 500,
        assets: [],
        loans: [],
        hand: ['S11'],
        status: 'alive',
        actions: 0,
        flags: {},
      },
    ],
    log: [{ round: 0, text: '房间创建。' }],
    global: {},
  };
}

const post = (path, body) =>
  new Request(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

// 1. 建房
let res = await router.fetch(post('/api/rooms', { code: 'ABC123', state: makeGame('ABC123', 'host-1') }), env);
assert(res.status === 200, '建房成功');
let data = await res.json();
assert(data.state.version === 1, '服务端初始化 version = 1');

// 2. 重复建房被拒绝
res = await router.fetch(post('/api/rooms', { code: 'ABC123', state: makeGame('ABC123', 'host-2') }), env);
assert(res.status === 409, '重复房间码被拒绝（409）');

// 3. 无效房间码
res = await router.fetch(post('/api/rooms', { code: 'bad!', state: makeGame('bad!', 'h') }), env);
assert(res.status === 400, '非法房间码被拒绝（400）');

// 4. 读取房间
res = await router.fetch(new Request(`${BASE}/api/rooms/ABC123`), env);
assert(res.status === 200 && (await res.json()).state.players.length === 1, '可以读取房间状态');

// 5. 加入玩家
res = await router.fetch(post('/api/rooms/ABC123/join', { playerId: 'p-2', name: '王总' }), env);
assert(res.status === 200, '第二位玩家加入成功');
data = await res.json();
assert(data.state.players.length === 2 && data.state.version === 2, '加入后玩家数 2、version 递增');

// 6. 同一玩家重复加入（幂等）
res = await router.fetch(post('/api/rooms/ABC123/join', { playerId: 'p-2', name: '王总' }), env);
assert(res.status === 200 && (await res.json()).state.players.length === 2, '重复加入不会产生重复玩家');

// 7. 房间满员
await router.fetch(post('/api/rooms/ABC123/join', { playerId: 'p-3', name: '赵总' }), env);
await router.fetch(post('/api/rooms/ABC123/join', { playerId: 'p-4', name: '钱总' }), env);
res = await router.fetch(post('/api/rooms/ABC123/join', { playerId: 'p-5', name: '第五人' }), env);
assert(res.status === 409 && (await res.json()).error.includes('已满'), '第 5 位玩家被拒绝（409）');

// 8. 开局后不能再加入
let game = (await (await router.fetch(new Request(`${BASE}/api/rooms/ABC123`), env)).json()).state;
game.version += 1;
game.phase = 'market';
res = await router.fetch(post('/api/rooms/ABC123/state', { playerId: 'host-1', state: game }), env);
assert(res.status === 200, '房主保存开局状态成功');
res = await router.fetch(post('/api/rooms/ABC123/join', { playerId: 'p-6', name: '迟到者' }), env);
assert(res.status === 409 && (await res.json()).error.includes('已经开始'), '开局后加入被拒绝');

// 9. 非房间成员不能保存状态
game.version += 1;
res = await router.fetch(post('/api/rooms/ABC123/state', { playerId: 'stranger', state: game }), env);
assert(res.status === 403, '非房间成员保存被拒绝（403）');

// 10. 过期版本被拒绝
const fresh = (await (await router.fetch(new Request(`${BASE}/api/rooms/ABC123`), env)).json()).state;
const stale = structuredClone(fresh);
res = await router.fetch(post('/api/rooms/ABC123/state', { playerId: 'host-1', state: stale }), env);
assert(res.status === 409, '过期版本被拒绝（409）');

// 11. WebSocket 订阅：连接即收到当前状态，状态变更即广播
const wsRequest = new Request(`${BASE}/api/rooms/ABC123/ws`);
res = await router.fetch(wsRequest, env);
assert(res.status === 101, 'WebSocket 升级成功');
const sockets = [...socketsByRoom.get('ABC123')];
assert(sockets.length === 1 && sockets[0].sent.length === 1 && sockets[0].sent[0].type === 'state', '连接后立即收到当前状态');

const next = structuredClone(fresh);
next.version += 1;
next.log = [{ round: 1, text: '市场揭晓' }, ...next.log];
res = await router.fetch(post('/api/rooms/ABC123/state', { playerId: 'host-1', state: next }), env);
assert(res.status === 200, '保存最新状态成功');
assert(sockets[0].sent.length === 2 && sockets[0].sent[1].state.version === next.version, '状态变更通过 WebSocket 广播');


// 13. 跨域预检
res = await router.fetch(new Request(`${BASE}/api/rooms`, { method: 'OPTIONS' }), env);
assert(res.status === 200 && res.headers.get('Access-Control-Allow-Origin') === '*', '跨域预检返回 CORS 头');
// 12. 不存在房间
res = await router.fetch(new Request(`${BASE}/api/rooms/ZZZZZZ`), env);
assert(res.status === 404, '不存在的房间返回 404');

console.log(`\n全部通过：${passed} 项断言`);