# 财管帝国：资本博弈

基于 CPA《财务成本管理》设计的 2–4 人在线策略卡牌桌游。玩家经过市场、融资投资、策略行动和财务结算四个阶段，在 12 回合内争夺最高企业价值（EV）。

## 已实现

- 20 张市场、30 张资产、24 张融资、36 张策略牌的完整牌库；
- 现金、权益、负债、信用额度、资产负债率与 EV 的自动计算；
- 利息、到期还本、所得税、现金通胀、生产资产折旧、破产判定与最终排名；
- 资产投资、债务/股权融资、策略攻击、并购、债转股、抵押和弃牌复活等核心互动；
- 本地试玩房间（同一浏览器不同标签）；
- **Cloudflare 跨设备联机**：Workers + Durable Objects + WebSocket，任意设备输入邀请码即可加入同一房间实时对局。

## 本地打开

这是无构建依赖的静态站点。直接用浏览器打开 `index.html`，或在本目录启动任意静态文件服务，即可试玩。

## 开启跨设备远程联机（Cloudflare）

### 架构

| 部分 | 技术 | 作用 |
|------|------|------|
| 前端 | 静态页面（`index.html` / `app.js` / `styles.css`） | 渲染与规则引擎 |
| 联机服务 | Cloudflare Workers | API 路由（建房 / 加入 / 保存状态） |
| 实时房间 | Durable Objects（`worker/src/index.js` 中的 `RoomDO`） | 每个房间一个 DO，状态持久化在 DO storage，WebSocket 实时广播 |
| 并发控制 | version 乐观锁 | 服务端拒绝过期写入，防止旧状态覆盖新状态 |

- 加入房间是**服务端原子操作**：房主建房后，其他玩家通过 `POST /api/rooms/:code/join` 加入，服务端校验大厅阶段、人数上限（4 人）并自动广播玩家列表。
- 对局开始后不再允许中途加入。
- 客户端断线后 WebSocket 自动重连（指数退避），重连即拉取最新状态。

### 部署（命令行，推荐）

前置条件：Node.js 18+、一个 Cloudflare 账号。

```bash
# 1. 安装 wrangler（若已安装可跳过）
npm install -g wrangler

# 2. 进入 worker 目录并登录
cd worker
wrangler login

# 3. 部署联机服务
wrangler deploy

# 4. 部署完成后会输出类似地址：
#    https://capital-empire.y1034284758.workers.dev（已部署）
```

然后打开网站右上角 **⚙ 设置 → 连接 Cloudflare**，粘贴 Worker 地址（例如 `https://capital-empire.xxx.workers.dev`），点击「连接并保存」。

建房后把 6 位房间码发给朋友；朋友打开同一个网站，在设置里粘贴**同一个 Worker 地址**，输入房间码即可加入。

### 部署（免命令行，Dashboard）

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **创建 Worker**；
2. 把 `worker/src/index.js` 的完整内容粘贴进编辑器；
3. 进入 Worker 的 **设置 → Durable Objects**，添加绑定：变量名 `ROOM`、类名 `RoomDO`；
4. 保存并部署，得到 `https://<worker名>.<你的子域>.workers.dev` 地址。

### 本地测试联机服务

```bash
cd worker
npm test
```

测试用内存模拟 DO storage 与 WebSocket，覆盖建房、重复建房、非法房间码、加入、满员、开局后禁入、越权写入、过期版本、WebSocket 广播与 CORS 共 19 项断言。

### 免费额度说明

- Workers 免费套餐：10 万请求/天；
- Durable Objects 免费额度：100 万请求/月（WebSocket 长连接按连接计费，一局游戏耗量极小）；
- 房间状态保存在 DO storage，即使 DO 因空闲被回收，重新访问房间时状态依然存在。

### 当前边界与后续规划

当前版本是「朋友房」信任模型：规则引擎在浏览器端执行，服务端负责房间管理、原子加入与版本并发校验。若之后要公开运营或做排行榜，建议下一步：

1. 把规则引擎搬到 Worker（服务端权威结算，客户端只提交操作指令）；
2. 手牌与牌堆不随状态广播，改为服务端私密下发，杜绝偷看；
3. 增加玩家在线状态、断线重连提示与房间清理（闲置自动删除）；
4. 用 Cloudflare D1 存对局历史与排行榜。

## 发布到 GitHub Pages

1. 新建一个 GitHub 仓库，把本目录内容推送到 `main` 分支。
2. 进入仓库 **Settings → Pages**，在 **Build and deployment** 中选择 **GitHub Actions**。
3. 推送后，`.github/workflows/deploy-pages.yml` 会自动发布网站。
4. 在 Actions 工作流完成页即可取得公开网址。

前端继续留在 GitHub Pages 没问题：联机服务跑在 Cloudflare Workers，两者通过 Worker 地址对接（已配置跨域）。也可以把前端整体迁到 Cloudflare Pages，与 Worker 同账号管理。