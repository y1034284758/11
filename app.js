const MARKETS = [
  ['M01','牛市降临',2,'所有资产本回合收益 +20%'],['M02','加息周期',0,'浮动债务利息 +2%；新债券利率 +1%'],['M03','降息放水',0,'浮动债务利息 -2%；本回合融资利率 -1%'],['M04','经济衰退',-2,'所有资产本回合收益减半'],['M05','通货膨胀',0,'固定成本 +20%；存货资产账面价值 +10%'],['M06','汇率波动',0,'掷骰影响进出口资产'],['M07','减税红利',0,'所得税率降至 15%'],['M08','加税风暴',0,'所得税率升至 35%'],['M09','信用紧缩',0,'信用额度减半，不可新增借款'],['M10','信用扩张',0,'信用额度翻倍，借款利率 -1%'],['M11','行业风口',0,'生产类资产收益 +50%'],['M12','股市暴跌',-3,'所有企业价值按 0.85 倍计算'],['M13','并购浪潮',4,'可额外免费打出一张资产卡'],['M14','金融危机',0,'期权类资产失效；高负债企业现金 -20'],['M15','ESG 新政',0,'棕色资产每张 -20，绿色资产每张 +15'],['M16','技术革命',0,'可免费重置一张生产资产的折旧'],['M17','贸易摩擦',0,'进出口资产每张损失 40'],['M18','劳动力短缺',0,'固定成本 +10，持续 3 回合'],['M19','数字化转型红利',0,'查看市场牌堆顶 3 张'],['M20','全面牛市',3,'企业价值按 1.1 倍计算；回合末多抽 1 张']
].map(([id,name,pe,text]) => ({id,name,pe,text,type:'market'}));

const ASSETS = [
  ['A01','基础生产线','生产',80,15,'棕色','—'],['A02','自动化生产线','生产',200,40,'棕色','固定成本每回合 -5'],['A03','智能制造中心','生产',350,70,'棕色','每回合额外抽 1 张策略卡'],['A04','研发实验室','生产',150,25,'绿色','每 2 回合可重置生产资产折旧'],['A05','品质检测中心','生产',60,10,'中性','免疫金融危机的资产收益影响'],['A06','仓储物流中心','生产',100,18,'中性','进出口资产'],
  ['A07','看涨期权组合','金融',50,0,'中性','骰子决定波动收益；连续两次亏损作废'],['A08','看跌期权对冲','金融',40,0,'中性','市场负面时收益 30，否则收益 5'],['A09','可转换债券投资','金融',120,10,'中性','持有 3 回合后可转股，权益 +100'],['A10','套期保值基金','金融',30,0,'中性','免疫 1 次市场负面波动后弃置'],
  ['A11','并购标的 A（初创）','并购',100,20,'棕色','个人 PE +1'],['A12','并购标的 B（成长）','并购',250,50,'棕色','个人 PE +2'],['A13','并购标的 C（成熟）','并购',500,100,'棕色','个人 PE +3'],['A14','战略股权投资','并购',180,30,'中性','从指定对手净利润抽取 10%'],['A15','子公司分拆上市','并购',350,50,'中性','第 6 回合后可用；企业价值 +100'],
  ['A16','标准成本系统','成本',90,18,'中性','所有生产资产收益 +5'],['A17','作业成本系统','成本',120,22,'中性','可透视一名对手手牌'],['A18','生命周期管理系统','成本',70,12,'中性','新购资产卡 9 折'],['A19','精益生产线','成本',160,35,'中性','额外收益 +5'],['A20','全面质量管理','成本',110,20,'绿色','免疫质量事故'],
  ['A21','品牌商标','无形',60,8,'中性','个人 PE +0.5，向上取整'],['A22','专利技术','无形',100,15,'中性','可使对手同类资产收益减半'],['A23','核心软件系统','无形',130,25,'中性','可重掷市场 PE 修正'],['A24','ESG 认证','无形',50,8,'绿色','免疫棕色罚款且享受 ESG 补贴'],['A25','政府特许经营权','无形',200,35,'绿色','可垄断一种资产类别'],
  ['A26','存货管理系统','营运',70,10,'中性','存货类资产收益 +3'],['A27','应收账款保理','营运',50,8,'中性','进出口资产'],['A28','现金池管理系统','营运',40,6,'中性','免于现金通胀折旧'],['A29','信用评估系统','营运',30,5,'中性','坏账风险减半'],['A30','供应商关系网络','营运',80,14,'中性','固定成本每回合 -5']
].map(([id,name,category,cost,income,esg,text]) => ({id,name,category,cost,income,esg,text,type:'asset'}));

const FINANCE = [
  ['F01','短期银行借款','debt',100,6,100,3,'到期一次还本'],['F02','长期银行借款','debt',300,64.9,300,6,'等额本息'],['F03','公司债券（平价）','debt',200,14,200,5,'到期一次还本'],['F04','公司债券（折价）','debt',180,42.5,200,5,'等额本息'],['F05','高收益债券','debt',250,30,250,4,'高利率债务'],['F06','可转换债券','debt',150,4.5,150,5,'第 3 回合后可债转股'],['F07','附认股权证债券','debt',200,12,200,4,'到期企业价值 +30'],['F08','商业票据','debt',80,3.2,80,2,'超短期债务'],['F09','融资租赁','lease',150,13.5,150,4,'表外负债，不占信用额度'],['F10','银团贷款','debt',500,37.5,500,6,'需负债率低于 40%'],
  ['F11','增发普通股','equity',200,0,0,0,'权益 +200；3 回合留存率 60%'],['F12','增发优先股','equity',150,12,0,0,'每回合支付优先股股利 12'],['F13','留存收益转增','special',0,0,0,0,'本回合留存率 100%'],['F14','配股融资','equity',100,0,0,0,'权益 +100'],['F15','私募股权','equity',300,0,0,0,'3 回合利润的 20% 归投资人'],['F16','IPO 上市','equity',500,0,0,0,'第 4 回合后；权益 +500、企业价值 +200'],
  ['F17','资产证券化（ABS）','special',200,0,0,4,'抵押 1 张资产'],['F18','供应链金融','special',120,0,0,0,'需持有营运类资产'],['F19','员工持股计划','equity',100,0,0,0,'所有资产收益 +3'],['F20','风险投资','equity',200,0,0,0,'免费获得研发实验室'],['F21','政府补贴','special',80,0,0,0,'需持有绿色资产'],['F22','内部积累','special',0,0,0,0,'本回合留存率 100%'],['F23','垃圾债券','debt',350,52.5,350,3,'高成本债务'],['F24','债转股','special',0,0,0,0,'将一笔债务转为权益']
].map(([id,name,kind,cash,payment,principal,term,text]) => ({id,name,kind,cash,payment,principal,term,text,type:'finance'}));

const STRATEGIES = [
  ['S01','NPV 为正立即投','自身','下一张资产享 8 折'],['S02','内部报酬率比较','自身','从牌堆检索一张资产'],['S03','敏感性分析','即时','免疫一次当前市场影响'],['S04','互斥项目决策','自身','弃一资产手牌，抽两张资产选一'],['S05','固定资产更新改造','自身','重置一张生产资产折旧'],['S06','等额年金法评估','自身','抽一张资产，并获 10 补贴'],
  ['S07','DCF 估值法','自身','估值达标可获 30 奖金'],['S08','市盈率重估','自身','本回合个人 PE +3'],['S09','市净率修复','自身','权益低于均值时 EV +10% 权益'],['S10','EV/EBITDA 倍数','即时','估值补贴（即时反制）'],['S11','货币时间价值','自身','立即获得 20 现金'],['S12','CAPM 定价','攻击','抽取高负债对手的一张手牌'],
  ['S13','MM 有税理论','自身','利息的 25% 返还为现金'],['S14','杠杆收购（LBO）','攻击','借 200 并以 120% 收购对手资产'],['S15','财务困境重组','自身','负债率 >70% 时债务本金打 7 折'],['S16','资本结构优化','自身','偿债享 10% 补贴'],['S17','经营杠杆放大','自身','收益 ×1.5，固定成本变 80'],['S18','财务杠杆释放','自身','利息 ×1.5，ROE 额外放大'],
  ['S19','本量利突破','自身','本回合正净利润翻倍'],['S20','零基预算改革','自身','本回合固定成本 -30'],['S21','全面预算控制','自身','预览未来 3 张市场牌'],['S22','标准成本差异分析','攻击','对手成本资产收益 -5，持续 2 回合'],['S23','作业成本精准打击','攻击','对手固定成本 +10，持续 3 回合'],['S24','责任中心考核','攻击','ROI <10% 的对手现金 -20'],
  ['S25','做空对手','攻击','高负债对手 EV 永久 -50'],['S26','恶意收购','攻击','以资产市价 +20% 强制收购'],['S27','毒丸计划','即时','反制一次收购并反噬 30'],['S28','产品倾销','攻击','指定类别资产收益减半'],['S29','差异化竞争','自身','垄断类别 3 回合'],['S30','平衡计分卡','自身','净利润 ×1.2；固定成本永久 -5'],
  ['S31','经济增加值 EVA','自身','EVA 为正获得奖励'],['S32','最佳现金持有量','自身','现金超额部分按 8% 计息'],['S33','信用政策优化','自身','收益 +20'],['S34','内部转移定价','自身','本回合税率 -10%'],['S35','ESG 可持续发展','自身','未来 6 回合每回合 +10'],['S36','货币时间价值','自身','复活弃牌堆资产或融资卡']
].map(([id,name,target,text]) => ({id,name,target,text,type:'strategy'}));

const CARDS = [...ASSETS, ...FINANCE, ...STRATEGIES];
const CARD = Object.fromEntries(CARDS.map(card => [card.id, card]));
const $ = (selector) => document.querySelector(selector);
const id = () => (crypto.randomUUID?.() || Math.random().toString(36).slice(2));
const roomCode = () => Math.random().toString(36).slice(2,8).toUpperCase();
const money = (value) => `${Math.round((value || 0) * 10) / 10} 万`;
const pct = (value) => `${Math.round((value || 0) * 100)}%`;
const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
const shuffle = (list) => [...list].sort(() => Math.random() - .5);
const escapeHtml = (text) => String(text).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char]));

// 玩家身份按标签页隔离（sessionStorage）：同一浏览器多个标签页 = 多位玩家，打开即玩
let userId = sessionStorage.getItem('capital-empire-user') || id();
sessionStorage.setItem('capital-empire-user', userId);
let state = null;
let activeRoom = null;
let transport = null;
let unsubscribe = null;
let pendingChoice = null;

class LocalTransport {
  constructor() {
    this.mode = 'local';
    this.channel = new BroadcastChannel('capital-empire-local');
  }
  key(code) { return `capital-empire-room-${code}`; }
  async create(code, game) { localStorage.setItem(this.key(code), JSON.stringify(game)); this.channel.postMessage({code,game}); }
  async read(code) { const raw = localStorage.getItem(this.key(code)); return raw ? JSON.parse(raw) : null; }
  async save(code, game) { localStorage.setItem(this.key(code), JSON.stringify(game)); this.channel.postMessage({code,game}); }
  listen(code, callback) { const handler = ({data}) => data.code === code && callback(data.game); this.channel.addEventListener('message', handler); return () => this.channel.removeEventListener('message', handler); }
}

class CloudflareTransport {
  constructor(baseUrl) {
    this.mode = 'cloudflare';
    this.base = String(baseUrl || '').trim().replace(/\/+$/, '');
    this.wsBase = this.base
      ? this.base.replace(/^http/, 'ws')
      : `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`;
    this.socket = null;
    this.listenCb = null;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.closedByUser = false;
    this.code = null;
  }
  url(path) { return this.base ? this.base + path : path; }
  async api(path, options = {}) {
    const res = await fetch(this.url(path), { headers: { 'Content-Type': 'application/json' }, ...options });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Error(data.error || `请求失败（${res.status}）`);
    return data;
  }
  async create(code, game) { const data = await this.api('/api/rooms', { method: 'POST', body: JSON.stringify({ code, state: game }) }); return data.state; }
  async read(code) { const data = await this.api(`/api/rooms/${code}`); return data.state; }
  async join(code, name) { const data = await this.api(`/api/rooms/${code}/join`, { method: 'POST', body: JSON.stringify({ playerId: userId, name }) }); return data.state; }
  async save(code, game) {
    try {
      const data = await this.api(`/api/rooms/${code}/state`, { method: 'POST', body: JSON.stringify({ playerId: userId, state: game }) });
      return data.state;
    } catch (error) {
      if (String(error.message).includes('已过期')) {
        const fresh = await this.read(code);
        if (this.listenCb) this.listenCb(fresh);
        throw Error('状态已同步到最新，请重试刚才的操作。');
      }
      throw error;
    }
  }
  listen(code, callback) {
    this.listenCb = callback;
    this.code = code;
    this.closedByUser = false;
    this.connect(code);
    return () => { this.closedByUser = true; clearTimeout(this.reconnectTimer); try { this.socket?.close(); } catch {} };
  }
  connect(code) {
    clearTimeout(this.reconnectTimer);
    try {
      const ws = new WebSocket(`${this.wsBase}/api/rooms/${code}/ws`);
      this.socket = ws;
      ws.onopen = () => { this.reconnectAttempts = 0; };
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'state' && this.listenCb) this.listenCb(msg.state);
        } catch {}
      };
      ws.onclose = () => {
        if (this.closedByUser) return;
        const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 15000);
        this.reconnectAttempts += 1;
        this.reconnectTimer = setTimeout(() => this.connect(code), delay);
      };
      ws.onerror = () => { try { ws.close(); } catch {} };
    } catch {}
  }
}

function makePlayer(name) {
  return { id:userId, name:name.trim() || '匿名企业家', color:['#f1c56f','#7db8ff','#63d9ad','#bc9aff'][Math.floor(Math.random()*4)], cash:300, equity:500, debt:0, ev:500, lastEbit:0, lastNet:0, assets:[], loans:[], hand:[], status:'alive', actions:0, flags:{}, highDebtRounds:0 };
}
function makeGame(host) {
  return { version:1, code:roomCode(), hostId:userId, phase:'lobby', round:0, turnIndex:0, market:null, marketDeck:shuffle(MARKETS.map(card=>card.id)), deck:shuffle(CARDS.map(card=>card.id)), discard:[], players:[host], log:[{round:0,text:`${host.name} 创建了资本博弈房间。`}], global:{ipoUsed:false,laborRounds:0} };
}
function isHost() { return state?.hostId === userId; }
function self() { return state?.players.find(player => player.id === userId); }
function current() { return state?.players[state.turnIndex]; }
function cardType(card) { return card.type === 'asset' ? '资产' : card.type === 'finance' ? '融资' : '策略'; }
function debtRatio(player) { return player.debt / Math.max(player.debt + player.equity, 1); }
function credit(player) { let cap = (player.equity + player.debt) * .4 - player.debt; if (state.market?.id === 'M09') cap /= 2; if (state.market?.id === 'M10') cap *= 2; return cap; }
function assetInstances(player, code) { return player.assets.filter(asset => asset.id === code && asset.active !== false); }
function owns(player, code) { return assetInstances(player, code).length > 0; }
function log(text) { state.log.unshift({round:state.round,text}); state.log = state.log.slice(0,80); }
function removeHand(player, code) { const index = player.hand.indexOf(code); if (index >= 0) player.hand.splice(index,1); }
function draw(player, requestedType = null) {
  let index = state.deck.findIndex(code => !requestedType || CARD[code].type === requestedType);
  if (index < 0) { state.deck = shuffle([...state.discard]); state.discard = []; index = state.deck.findIndex(code => !requestedType || CARD[code].type === requestedType); }
  if (index >= 0) player.hand.push(state.deck.splice(index,1)[0]);
}
function discard(player, code) { removeHand(player, code); state.discard.push(code); }
function updateDebt(player) { player.debt = player.loans.filter(loan=>!loan.outOfBook).reduce((total,loan)=>total + loan.principal, 0); }
function nowText() { return `第 ${state.round || 0} 回合`; }

function toast(text) { const el = $('#toast'); el.textContent = text; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2900); }
function setConnection() { const el = $('#connection-state'); el.textContent = transport?.mode === 'cloudflare' ? 'Cloudflare 已联机' : '本地试玩'; el.className = `connection ${transport?.mode || 'local'}`; }
async function commit() { if (!state || !activeRoom) return; state.version = (state.version || 0) + 1; await transport.save(activeRoom, structuredClone(state)); render(); }
function startListening(code) { unsubscribe?.(); unsubscribe = transport.listen(code, remote => { if (!state || remote.version >= state.version) { state = remote; render(); } }); }

async function createRoom() {
  const host = makePlayer($('#player-name').value); const game = makeGame(host);
  activeRoom = game.code; state = game;
  const created = await transport.create(activeRoom, state); if (created) state = created;
  startListening(activeRoom); render();
}
async function joinRoom() {
  const code = $('#room-code').value.trim().toUpperCase(); if (!/^[A-Z0-9]{6}$/.test(code)) return toast('请输入 6 位有效房间码。');
  let game;
  if (typeof transport.join === 'function') {
    try { game = await transport.join(code, $('#player-name').value); }
    catch (error) { return toast(error.message); }
  } else {
    game = await transport.read(code); if (!game) return toast('没有找到这个房间。请检查邀请码和联机方式。');
    if (game.phase !== 'lobby') return toast('该对局已经开始，暂不支持中途加入。');
    if (game.players.length >= 4) return toast('房间已满（最多 4 位企业家）。');
    if (!game.players.some(player => player.id === userId)) game.players.push(makePlayer($('#player-name').value));
    state = game; activeRoom = code; await commit();
  }
  state = game; activeRoom = code; startListening(code); render();
}
async function startGame() {
  if (!isHost()) return toast('只有房主可以开始游戏。'); if (state.players.length < 2) return toast('至少需要 2 位企业家入场。');
  state.phase = 'market'; state.round = 1; state.turnIndex = 0; state.players.forEach(player => { for (let i=0;i<5;i++) draw(player); }); log('游戏开始：第 1 回合等待市场揭晓。'); await commit();
}
async function revealMarket() {
  if (!isHost() || state.phase !== 'market') return; const code = state.marketDeck.shift(); state.market = MARKETS.find(card=>card.id===code); state.phase = 'actions'; state.turnIndex = 0;
  state.players.forEach(player => { player.actions = 0; player.flags = {...player.flags, marketImmune:false, usedCashStrategy:false, assetBonus:state.market.id === 'M13' ? 1 : 0}; });
  if (state.market.id === 'M18') state.global.laborRounds = 3;
  if (state.market.id === 'M06') state.players.forEach(player => { const imports = assetInstances(player,'A06').length + assetInstances(player,'A27').length; if (!imports) return; const roll = Math.ceil(Math.random()*6); const change = roll <= 2 ? -20*imports : roll >= 5 ? 25*imports : 0; player.cash += change; log(`${player.name} 的汇率骰为 ${roll}，现金 ${change >= 0 ? '+' : ''}${change}。`); });
  log(`${nowText()}：市场环境「${state.market.name}」揭晓。`); await commit();
}
async function endTurn() {
  if (!self() || current()?.id !== userId || state.phase !== 'actions') return;
  if (state.turnIndex < state.players.length - 1) { state.turnIndex += 1; log(`${self().name} 结束了行动。`); }
  else settleRound();
  await commit();
}

function assetCost(player, card) { return card.cost * (player.flags.discountNextAsset ? .8 : owns(player,'A18') ? .9 : 1); }
function playAsset(player, card) {
  if (card.id === 'A15' && state.round < 6) throw Error('子公司分拆上市需第 6 回合后才能打出。');
  const cost = assetCost(player,card); if (player.cash < cost) throw Error(`现金不足，需要 ${money(cost)}。`);
  player.cash -= cost; player.assets.push({id:card.id,boughtRound:state.round,depreciation:1,active:true,optionLosses:0}); player.flags.discountNextAsset = false; if (card.id === 'A15') player.ev += 100;
  log(`${player.name} 投资「${card.name}」，支付 ${money(cost)}。`);
}
function playFinance(player, card, choice) {
  if (card.kind === 'debt' || card.kind === 'lease') {
    if (state.market.id === 'M09') throw Error('信用紧缩中，无法新增借款。'); if (debtRatio(player) >= .8) throw Error('负债危机中，无法新增融资。');
    if (card.id === 'F10' && debtRatio(player) >= .4) throw Error('银团贷款要求当前负债率低于 40%。');
    if (card.kind !== 'lease' && credit(player) < card.principal) throw Error(`信用额度不足（当前 ${money(credit(player))}）。`);
    player.cash += card.cash; player.loans.push({id:card.id,principal:card.principal,payment:card.payment,term:card.term,remaining:card.term,outOfBook:card.kind==='lease',payments:0}); updateDebt(player); log(`${player.name} 使用「${card.name}」，获得 ${money(card.cash)} 融资。`); return;
  }
  if (card.id === 'F13' || card.id === 'F22') { player.flags.retention = 1; log(`${player.name} 将本回合利润全部留存。`); return; }
  if (card.id === 'F16') { if (state.round < 4 || state.global.ipoUsed) throw Error('IPO 仅第 4 回合后可用，且全局限一次。'); state.global.ipoUsed=true; player.cash += 500; player.equity += 500; player.ev += 200; log(`${player.name} 成功 IPO 上市，企业价值 +200。`); return; }
  if (card.id === 'F18' && !player.assets.some(asset=>CARD[asset.id].category==='营运')) throw Error('供应链金融需要持有营运类资产。');
  if (card.id === 'F21' && !player.assets.some(asset=>CARD[asset.id].esg==='绿色')) throw Error('政府补贴需要持有绿色资产。');
  if (card.id === 'F24') { const loan = player.loans.find(loan=>loan.id === choice); if (!loan) throw Error('请选择一笔债务进行债转股。'); player.equity += loan.principal; player.loans = player.loans.filter(item=>item !== loan); updateDebt(player); log(`${player.name} 将「${loan.id}」债转股。`); return; }
  player.cash += card.cash; if (card.id === 'F11') { player.equity += 200; player.flags.dilutionRounds=3; } if (card.id === 'F14') player.equity +=100; if (card.id === 'F12') player.flags.preferred = (player.flags.preferred||0)+12; if (card.id === 'F15') player.flags.peRounds=3; if (card.id === 'F19') player.flags.morale=true;
  if (card.id === 'F20' && !owns(player,'A04')) player.assets.push({id:'A04',boughtRound:state.round,depreciation:1,active:true});
  if (card.id === 'F17') { const asset=player.assets.find(item=>item.id===choice); if (!asset) throw Error('请选择抵押资产。'); asset.active=false; asset.mortgageRounds=4; }
  log(`${player.name} 使用「${card.name}」，现金 ${card.cash ? '+'+money(card.cash) : '发生变化'}。`);
}

function playStrategy(player, card, choice) {
  const targetId = choice?.split(':')[0]; const target = state.players.find(item => item.id === choice || item.id === targetId);
  const attack = ['S12','S14','S22','S23','S25','S26','S28'].includes(card.id); if (attack && player.cash < 10) throw Error('攻击策略需要 10 万诉讼费。'); if (attack) player.cash -= 10;
  switch (card.id) {
    case 'S01': player.flags.discountNextAsset=true; break;
    case 'S02': draw(player,'asset'); break;
    case 'S03': player.flags.marketImmune=true; break;
    case 'S04': { const asset = player.hand.find(code=>CARD[code].type==='asset'); if (!asset) throw Error('需要先持有一张资产手牌。'); discard(player,asset); draw(player,'asset'); draw(player,'asset'); break; }
    case 'S05': { const asset = player.assets.find(item=>item.id===choice); if (!asset || CARD[asset.id].category !== '生产') throw Error('请选择生产类资产。'); asset.depreciation=1; break; }
    case 'S06': player.cash += 10; draw(player,'asset'); break;
    case 'S07': player.cash += 30; break;
    case 'S08': player.flags.peBoost=(player.flags.peBoost||0)+3; break;
    case 'S09': { const avg=state.players.reduce((sum,item)=>sum+item.equity,0)/state.players.length; if (player.equity < avg) player.ev += player.equity*.1; else throw Error('你的权益并未低于全场平均，不能获得修复补偿。'); break; }
    case 'S10': player.ev += 25; break;
    case 'S11': player.cash +=20; break;
    case 'S12': if (!target || target.loans.length < 2) throw Error('请选择持有多笔债务的对手。'); if(target.hand.length) { const stole=target.hand.splice(Math.floor(Math.random()*target.hand.length),1)[0]; player.hand.push(stole); } break;
    case 'S13': player.flags.taxShield=true; break;
    case 'S14': forceAcquisition(player,target,choice?.split(':')[1],1.2,true); break;
    case 'S15': if (debtRatio(player)<=.7) throw Error('负债率须大于 70%。'); player.loans.forEach(loan=>loan.principal*=.7); updateDebt(player); break;
    case 'S16': { const repay=Math.min(player.cash,player.debt*.15); player.cash-=repay; let left=repay; player.loans.forEach(loan=>{const paid=Math.min(left,loan.principal);loan.principal-=paid;left-=paid;}); updateDebt(player); player.cash+=repay*.1; break; }
    case 'S17': player.flags.opLeverage=true; break;
    case 'S18': player.flags.finLeverage=true; break;
    case 'S19': player.flags.profitDouble=true; break;
    case 'S20': player.flags.fixedCut=(player.flags.fixedCut||0)+30; break;
    case 'S21': toast(`未来市场：${state.marketDeck.slice(0,3).map(code=>MARKETS.find(card=>card.id===code).name).join('、')||'牌堆将尽'}`); break;
    case 'S22': if(!target) throw Error('请选择对手。'); target.flags.costAttack=2; break;
    case 'S23': if(!target) throw Error('请选择对手。'); target.flags.fixedAttack=3; break;
    case 'S24': state.players.filter(item=>item.id!==player.id && assetReturn(item)<.1).forEach(item=>item.cash-=20); break;
    case 'S25': if(!target || debtRatio(target)<=.5) throw Error('请选择负债率超过 50% 的对手。'); target.ev-=50; break;
    case 'S26': forceAcquisition(player,target,choice?.split(':')[1],1.2,false); break;
    case 'S27': player.flags.poison=true; break;
    case 'S28': if(!target) throw Error('请选择对手。'); target.flags.dumpCategory=choice?.split(':')[1]; break;
    case 'S29': player.flags.monopoly={category:choice,rounds:3}; break;
    case 'S30': player.flags.scorecard=true; player.flags.permanentFixed=(player.flags.permanentFixed||0)+5; break;
    case 'S31': { const eva=Math.max(0,player.lastEbit*.75-(player.equity+player.debt)*.08); player.cash+=eva; break; }
    case 'S32': player.flags.cashInterest=true; break;
    case 'S33': player.flags.creditIncome=(player.flags.creditIncome||0)+20; break;
    case 'S34': player.flags.taxCut=true; break;
    case 'S35': player.flags.esgRounds=6; break;
    case 'S36': { const code=choice; if(!code || !state.discard.includes(code) || CARD[code].type==='strategy') throw Error('请选择弃牌堆中的资产或融资卡。'); if(player.cash<20) throw Error('复活需要 20 万手续费。'); player.cash-=20; state.discard.splice(state.discard.indexOf(code),1); player.hand.push(code); break; }
  }
  log(`${player.name} 打出策略「${card.name}」。`);
}
function forceAcquisition(player,target,assetCode,multiplier,withDebt) {
  if (!target || !assetCode) throw Error('请选择一名对手的资产。'); if (target.flags.poison) { target.flags.poison=false; player.cash-=30; log(`${target.name} 启动毒丸计划，${player.name} 的收购被反制并损失 30 万。`); return; }
  const asset=target.assets.find(item=>item.id===assetCode); if(!asset) throw Error('目标资产不存在。'); const price=CARD[assetCode].cost*multiplier; if(player.cash<price) throw Error(`收购需要 ${money(price)} 现金。`); if(withDebt){ if(credit(player)<200) throw Error('杠杆收购的 200 万借款超出信用额度。'); player.cash+=200;player.loans.push({id:'LBO',principal:200,payment:8,term:3,remaining:3,payments:0,outOfBook:false});updateDebt(player); }
  player.cash-=price;target.cash+=price;target.assets=target.assets.filter(item=>item!==asset);player.assets.push(asset); log(`${player.name} 收购了 ${target.name} 的「${CARD[assetCode].name}」。`);
}
function assetReturn(player){const base=player.assets.reduce((sum,asset)=>sum+(CARD[asset.id].income||0),0);return base/Math.max(player.assets.reduce((sum,asset)=>sum+CARD[asset.id].cost,0),1)}

async function playCard(code, choice = null) {
  const player=self(); if(!player || state.phase!=='actions' || current()?.id!==userId) return toast('现在不是你的行动时间。'); const card=CARD[code]; if(!card || !player.hand.includes(code)) return;
  const max=3+(player.flags.assetBonus||0); if(player.actions>=max) return toast(`本回合行动已达 ${max} 次上限。`);
  try { if(card.type==='asset') playAsset(player,card); else if(card.type==='finance') playFinance(player,card,choice); else playStrategy(player,card,choice); discard(player,code); player.actions+=1; await commit(); }
  catch(error){toast(error.message);}
}

function needsChoice(card) {
  const map={F17:'ownAsset',F24:'loan',S05:'ownProduction',S12:'highDebtPlayer',S14:'enemyAsset',S22:'enemy',S23:'enemy',S25:'highDebtPlayer',S26:'enemyAsset',S28:'enemyCategory',S29:'category',S36:'discard'}; return map[card.id] || null;
}
function openChoice(code) {
  const card=CARD[code]; const kind=needsChoice(card); if(!kind) return playCard(code); const player=self(); const select=$('#choice-select'); let options=[]; let title='选择目标';
  if(kind==='ownAsset'){title='选择抵押资产';options=player.assets.filter(item=>item.active!==false).map(item=>[item.id,CARD[item.id].name]);}
  if(kind==='loan'){title='选择债转股债务';options=player.loans.map(item=>[item.id,`${CARD[item.id]?.name||item.id}（本金 ${money(item.principal)}）`]);}
  if(kind==='ownProduction'){title='选择要改造的生产资产';options=player.assets.filter(item=>CARD[item.id].category==='生产').map(item=>[item.id,CARD[item.id].name]);}
  if(kind==='enemy'||kind==='highDebtPlayer'){title='选择对手';options=state.players.filter(item=>item.id!==userId && (kind!=='highDebtPlayer'||debtRatio(item)>.5)).map(item=>[item.id,`${item.name}（负债率 ${pct(debtRatio(item))}）`]);}
  if(kind==='enemyAsset'){title='选择对手资产';options=state.players.filter(item=>item.id!==userId).flatMap(item=>item.assets.map(asset=>[`${item.id}:${asset.id}`,`${item.name} · ${CARD[asset.id].name}`]));}
  if(kind==='enemyCategory'){title='选择对手及资产类别';options=state.players.filter(item=>item.id!==userId).flatMap(item=>['生产','金融','并购','成本','无形','营运'].map(category=>[`${item.id}:${category}`,`${item.name} · ${category}`]));}
  if(kind==='category'){title='选择垄断资产类别';options=['生产','金融','并购','成本','无形','营运'].map(category=>[category,category]);}
  if(kind==='discard'){title='复活一张弃牌';options=state.discard.filter(item=>CARD[item].type!=='strategy').map(item=>[item,`${CARD[item].name}（${cardType(CARD[item])}）`]);}
  if(!options.length) return toast('没有可选择的目标。'); pendingChoice=code; $('#choice-title').textContent=title; $('#choice-description').textContent=card.text; select.innerHTML=options.map(([value,label])=>`<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join(''); $('#choice-dialog').showModal();
}

function settleRound() {
  const market=state.market; log(`${nowText()}开始财务结算。`);
  for(const player of state.players.filter(item=>item.status==='alive')) {
    const result=calculateSettlement(player,market); log(`${player.name} 结算：EBIT ${money(result.ebit)}，净利润 ${money(result.net)}，EV ${money(player.ev)}。`);
  }
  if(state.players.filter(player=>player.status==='alive').length<=1 || state.round>=12) { state.phase='final'; state.turnIndex=0; log('终局结算完成，企业价值最高者获胜。'); return; }
  state.round+=1;state.phase='market';state.turnIndex=0;state.market=null; if(state.global.laborRounds>0) state.global.laborRounds--; log(`第 ${state.round} 回合开始，等待市场揭晓。`);
}
function calculateSettlement(player, market) {
  const flags=player.flags; let revenue=0; let personalPe=0;
  const monopoly=state.players.find(item=>item.id!==player.id && item.flags.monopoly?.rounds>0)?.flags.monopoly;
  for(const asset of player.assets) {
    const card=CARD[asset.id]; if(asset.mortgageRounds){asset.mortgageRounds--;if(asset.mortgageRounds<=0)asset.active=true;} if(asset.active===false)continue;
    let income=card.income*asset.depreciation;
    if(card.id==='A07'){const roll=Math.ceil(Math.random()*6);income=roll<=2?-25:roll<=4?10:roll===5?25:50;asset.optionLosses=roll<=2?asset.optionLosses+1:0;if(asset.optionLosses>=2){asset.active=false;income=0;log(`${player.name} 的看涨期权连续亏损，已作废。`);}}
    if(card.id==='A08') income=['M04','M12','M14'].includes(market.id)?30:5;
    if(card.id==='A10') income=0;
    if(market.id==='M14' && card.category==='金融') income=0;
    if(market.id==='M01')income*=1.2;if(market.id==='M04')income*=.5;if(market.id==='M11'&&card.category==='生产')income*=1.5;
    if(monopoly?.category===card.category && !owns(player,'A25')) income=0;
    if(flags.dumpCategory===card.category) income*=.5;
    if(flags.costAttack && card.category==='成本')income=Math.max(0,income-5);
    revenue+=income;
    if(card.id==='A11')personalPe+=1;if(card.id==='A12')personalPe+=2;if(card.id==='A13')personalPe+=3;if(card.id==='A21')personalPe+=.5;
  }
  if(owns(player,'A16')) revenue+=assetInstances(player,'A16').length*assetInstances(player,'A01').length*5 + assetInstances(player,'A16').length*assetInstances(player,'A02').length*5 + assetInstances(player,'A16').length*assetInstances(player,'A03').length*5 + assetInstances(player,'A16').length*assetInstances(player,'A04').length*5 + assetInstances(player,'A16').length*assetInstances(player,'A05').length*5 + assetInstances(player,'A16').length*assetInstances(player,'A06').length*5;
  revenue += assetInstances(player,'A19').length*5 + (flags.morale ? player.assets.length*3 : 0) + (flags.esgRounds ? 10 : 0) + (flags.creditIncome||0);
  let fixed=50 - assetInstances(player,'A02').length*5 - assetInstances(player,'A30').length*5 - (flags.permanentFixed||0) - (flags.fixedCut||0) + (flags.fixedAttack?10:0) + (state.global.laborRounds?10:0); if(market.id==='M05')fixed*=1.2;if(flags.opLeverage)fixed=80;
  let interest=0, cashPayment=0;
  for(const loan of [...player.loans]) { let payment=loan.payment;let interestPart=payment;let principalPaid=0;
    if(loan.id==='F02'){const table=[[24,40.9],[20.7,44.2],[17.2,47.7],[13.4,51.5],[9.3,55.6],[4.8,60.1]];[interestPart,principalPaid]=table[loan.payments]||[0,loan.principal];payment=interestPart+principalPaid;}
    else if(loan.id==='F04'){const table=[[9,33.5],[8.3,34.2],[6.6,35.9],[4.8,37.7],[2.9,39.6]];[interestPart,principalPaid]=table[loan.payments]||[0,loan.principal];payment=interestPart+principalPaid;}
    else { if(market.id==='M02')interestPart+=loan.principal*.02;if(market.id==='M03'||market.id==='M10')interestPart=Math.max(loan.principal*.01,interestPart-loan.principal*.01);loan.remaining--;if(loan.remaining<=0)principalPaid=loan.principal;payment=interestPart+principalPaid; }
    interest+=interestPart;cashPayment+=payment;loan.principal=Math.max(0,loan.principal-principalPaid);loan.payments++; if(loan.principal<=.1) {player.loans.splice(player.loans.indexOf(loan),1);if(loan.id==='F07')player.ev+=30;}
  }
  if(flags.finLeverage)interest*=1.5;cashPayment+=flags.preferred||0;let ebit=revenue-fixed;let pretax=ebit-interest;let taxRate=market.id==='M07'?.15:market.id==='M08'?.35:.25;if(flags.taxCut)taxRate=Math.max(.05,taxRate-.1);let tax=Math.max(pretax*taxRate,0);let net=pretax-tax;if(flags.profitDouble&&net>0)net*=2;if(flags.scorecard&&net>0)net*=1.2;if(flags.peRounds&&net>0)net*=.8;
  player.cash-=cashPayment;if(flags.taxShield)player.cash+=interest*.25;let retention=flags.retention || (flags.dilutionRounds ? .6 : .7);player.equity+=net>0?net*retention:net;updateDebt(player);let pe=clamp(8+(market.pe||0)+(flags.peBoost||0)+personalPe,4,12);player.ev=net>0?player.equity+net*(pe*.5):Math.max(player.equity*.5,0);if(market.id==='M12')player.ev*=.85;if(market.id==='M20')player.ev*=1.1;
  if(market.id==='M14'&&debtRatio(player)>.5)player.cash-=20;if(market.id==='M17')player.cash-=(assetInstances(player,'A06').length+assetInstances(player,'A27').length)*40;if(market.id==='M15'&&!owns(player,'A24'))player.cash-=player.assets.filter(asset=>CARD[asset.id].esg==='棕色').length*20; if(market.id==='M15')player.cash+=player.assets.filter(asset=>CARD[asset.id].esg==='绿色').length*15;
  if(player.cash>100){if(flags.cashInterest)player.cash+=(player.cash-100)*.08;else if(!owns(player,'A28'))player.cash-=(player.cash-100)*.02;}
  if(state.round===5||state.round===9)player.assets.filter(asset=>CARD[asset.id].category==='生产').forEach(asset=>asset.depreciation*=.75);
  const ratio=debtRatio(player); if(player.equity<50||ratio>.95){player.status='bankrupt';log(`${player.name} 已破产淘汰。`);}else {player.highDebtRounds=ratio>.9&&player.cash<0?player.highDebtRounds+1:0;if(player.highDebtRounds>=2){player.status='bankrupt';log(`${player.name} 因持续无法偿债被淘汰。`);}}
  while(player.hand.length<Math.min(5,10))draw(player);if(market.id==='M20')draw(player);if(owns(player,'A03'))draw(player,'strategy');player.lastEbit=ebit;player.lastNet=net;
  ['dilutionRounds','peRounds','esgRounds','costAttack','fixedAttack'].forEach(key=>{if(flags[key])flags[key]--;});if(flags.monopoly?.rounds){flags.monopoly.rounds--;if(!flags.monopoly.rounds)delete flags.monopoly;} ['marketImmune','assetBonus','peBoost','retention','taxShield','opLeverage','finLeverage','profitDouble','fixedCut','cashInterest','creditIncome','taxCut','dumpCategory'].forEach(key=>delete flags[key]); return {ebit,net};
}

function render() {
  setConnection(); const inGame=Boolean(state); $('#lobby-screen').classList.toggle('hidden',inGame); $('#game-screen').classList.toggle('hidden',!inGame); if(!state)return;
  $('#room-label').textContent=`房间 · ${state.code}`;$('#room-code-display').textContent=state.code;$('#round-number').textContent=state.round||0; $('#lobby-controls').classList.toggle('hidden',state.phase!=='lobby');$('#board').classList.toggle('hidden',state.phase==='lobby');
  if(state.phase==='lobby'){ $('#phase-title').textContent='等待企业家入场';$('#lobby-player-list').innerHTML=state.players.map(player=>`<span class="lobby-player">● ${escapeHtml(player.name)}</span>`).join(''); $('#start-game').classList.toggle('hidden',!isHost()); return; }
  $('#phase-title').textContent=state.phase==='final'?'资本博弈 · 最终排名':state.phase==='market'?`第 ${state.round} 回合 · 宏观风向待定`:`第 ${state.round} 回合 · 资本行动中`;
  renderMarket();renderTurn();renderSelf();renderScoreboard();renderHand();renderLog();
}
function renderMarket(){const el=$('#market-card');if(!state.market){el.className='market-card empty';el.innerHTML='<span class="card-overline">市场环境</span><strong>等待揭晓</strong><p>房主翻开市场卡后，所有企业会受同一宏观环境影响。</p>';return;}el.className='market-card';el.innerHTML=`<span class="card-overline">${state.market.id} · 市场环境 · PE ${state.market.pe>0?'+':''}${state.market.pe}</span><strong>${escapeHtml(state.market.name)}</strong><p>${escapeHtml(state.market.text)}</p>`;}
function renderTurn(){const player=current();const badge=$('#turn-badge'),hint=$('#turn-hint'),actions=$('#turn-actions');if(state.phase==='market'){badge.textContent='市场阶段';hint.textContent=isHost()?'由你翻开本回合市场卡。':'等待房主揭晓市场环境。';actions.innerHTML=isHost()?'<button id="reveal-market" class="primary-button">揭示市场环境</button>':'';return;}if(state.phase==='final'){const winner=[...state.players].sort((a,b)=>b.ev-a.ev)[0];badge.textContent='终局结算';hint.textContent=`${winner.name} 以 ${money(winner.ev)} 暂居第一。`;actions.innerHTML='';return;}const mine=player?.id===userId;badge.textContent=mine?'轮到你行动':`等待 ${player?.name} 行动`;hint.textContent=mine?`你已使用 ${self().actions} / ${3+(self().flags.assetBonus||0)} 次行动。`: '对手正在进行融资、投资或策略决策。';actions.innerHTML=mine?'<button id="end-turn" class="secondary-button">结束我的行动</button>':'';}
function renderSelf(){const player=self();if(!player)return;const ratio=debtRatio(player);const loans=player.loans.length?player.loans.map(loan=>`<div class="debt-chip"><span>${CARD[loan.id]?.name||loan.id}</span><strong>${money(loan.principal)}</strong></div>`).join(''):'<div class="empty-state">暂无未偿债务</div>';$('#self-panel').innerHTML=`<div class="company-name"><h2>${escapeHtml(player.name)}的企业</h2><span class="you-badge">你</span></div><p class="company-status">${player.status==='alive'?'经营中':'已淘汰'} · ${player.assets.length} 项资产</p><div class="metrics"><div class="metric gold"><span>现金</span><b>${money(player.cash)}</b></div><div class="metric green"><span>企业价值</span><b>${money(player.ev)}</b></div><div class="metric"><span>股东权益</span><b>${money(player.equity)}</b></div><div class="metric ${player.debt?'red':''}"><span>总负债</span><b>${money(player.debt)}</b></div><div class="metric"><span>信用额度</span><b>${money(credit(player))}</b></div><div class="metric"><span>上回合 EBIT</span><b>${money(player.lastEbit)}</b></div></div><div class="debt-gauge"><p><span>资产负债率</span><b>${pct(ratio)}</b></p><div class="gauge"><i style="width:${clamp(ratio*100,0,100)}%"></i></div></div><p class="debt-list-title">债务追踪</p><div class="debt-list">${loans}</div>`;const assets=player.assets.filter(asset=>asset.active!==false).map(asset=>`<div class="asset-tile">${escapeHtml(CARD[asset.id].name)}<small>${money(CARD[asset.id].income*asset.depreciation)} / 回合</small></div>`).join('');$('#asset-portfolio').innerHTML=assets||'<p class="empty-state">尚未购入资产。资本需要开始流动。</p>';$('#asset-count').textContent=`${player.assets.length} 张持有资产`;let advice=ratio>=.8?'负债已进入<strong>危机区间</strong>：无法新增融资，应优先偿债或使用债转股。':ratio>=.7?'负债率处于<strong>警告区间</strong>：每回合将产生信用修复成本。':player.cash<100?'现金偏低：保留资金以支付利息和到期本金。':'现金充裕：注意超出 100 万的现金将发生通胀折旧。';$('#financial-advice').innerHTML=advice;}
function renderScoreboard(){const sorted=[...state.players].sort((a,b)=>b.ev-a.ev);$('#scoreboard').innerHTML=sorted.map((player,index)=>`<div class="score-row ${player.id===userId?'self':''}"><span class="score-rank">${String(index+1).padStart(2,'0')}</span><span class="score-name">${escapeHtml(player.name)}</span><b class="score-value">${money(player.ev)}</b><span class="score-state">${player.status==='alive'?'存续':'淘汰'}</span></div>`).join('');}
function renderHand(){const player=self();if(!player)return;const allowed=state.phase==='actions'&&current()?.id===userId&&player.status==='alive';$('#hand-note').textContent=allowed?`你已行动 ${player.actions} / ${3+(player.flags.assetBonus||0)} 次`:'等待你的行动回合';$('#hand').innerHTML=player.hand.map(code=>{const card=CARD[code],disabled=!allowed||player.actions>=3+(player.flags.assetBonus||0);const info=card.type==='asset'?`投资 ${money(card.cost)} · 收益 ${money(card.income)}`:card.type==='finance'?`融资 ${money(card.cash)} · ${card.kind==='debt'?'期限 '+card.term+' 回合':card.kind==='equity'?'权益融资':'特殊融资'}`:card.target+' · 策略';return `<article class="card ${card.type} ${disabled?'disabled':''}"><div class="card-top"><span class="card-type">${cardType(card)}</span><span class="card-id">${card.id}</span></div><h3>${escapeHtml(card.name)}</h3><p>${escapeHtml(card.text)}</p><div class="card-foot"><span class="card-cost">${info}</span><button class="play-button" data-play="${card.id}" ${disabled?'disabled':''}>打出</button></div></article>`;}).join('')||'<p class="empty-state">没有手牌。</p>';}
function renderLog(){$('#game-log').innerHTML=state.log.map(entry=>`<div class="log-entry"><time>R${entry.round}</time>${escapeHtml(entry.text)}</div>`).join('');}

$('#create-room').addEventListener('click',()=>createRoom().catch(error=>toast(error.message)));
$('#join-room').addEventListener('click',()=>joinRoom().catch(error=>toast(error.message)));
$('#start-game').addEventListener('click',()=>startGame());
$('#settings-button').addEventListener('click',()=>$('#settings-dialog').showModal());
$('#disconnect-cloudflare').addEventListener('click',()=>{if(state)return toast('请先刷新页面退出当前对局，再切换联机方式。');localStorage.removeItem('capital-empire-cloudflare');transport=new LocalTransport();setConnection();toast('已切换到本地试玩。');});
$('#connect-cloudflare').addEventListener('click',()=>connectCloudflare());
$('#confirm-choice').addEventListener('click',async()=>{if(!pendingChoice)return;const code=pendingChoice;pendingChoice=null;$('#choice-dialog').close();await playCard(code,$('#choice-select').value);});
document.addEventListener('click',event=>{const play=event.target.closest('[data-play]');if(play)openChoice(play.dataset.play);if(event.target.id==='reveal-market')revealMarket();if(event.target.id==='end-turn')endTurn();if(event.target.id==='toggle-log')$('#log-section').classList.toggle('hidden');});
async function connectCloudflare() {
  const base = $('#cloudflare-url').value.trim();
  if (base && !/^https?:\/\//.test(base)) return toast('请输入以 http(s):// 开头的 Worker 地址（留空则使用同域 /api）。');
  if (state) return toast('请先刷新页面退出当前对局，再切换联机方式。');
  const candidate = new CloudflareTransport(base);
  try { await candidate.api('/api/ping'); }
  catch (error) { return toast('无法连接 Cloudflare 服务：' + error.message); }
  transport = candidate;
  if (base) localStorage.setItem('capital-empire-cloudflare', base);
  else localStorage.removeItem('capital-empire-cloudflare');
  setConnection(); $('#settings-dialog').close(); toast('已连接 Cloudflare 联机服务，创建房间即可跨设备开局。');
}
const DEFAULT_CLOUDFLARE_URL = 'https://capital.9oocloud.top';
async function boot() {
  transport = new LocalTransport();
  const saved = localStorage.getItem('capital-empire-cloudflare');
  const target = saved || DEFAULT_CLOUDFLARE_URL;
  if (target) {
    $('#cloudflare-url').value = target;
    const candidate = new CloudflareTransport(target);
    try { await candidate.api('/api/ping'); transport = candidate; }
    catch { if (saved) toast('Cloudflare 服务暂不可用，已使用本地试玩。'); }
  }
  setConnection();
}
boot();
