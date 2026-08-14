# 财管帝国：资本博弈

基于 CPA《财务成本管理》设计的 2–4 人在线策略卡牌桌游。玩家经过市场、融资投资、策略行动和财务结算四个阶段，在 12 回合内争夺最高企业价值（EV）。

## 已实现

- 20 张市场、30 张资产、24 张融资、36 张策略牌的完整牌库；
- 现金、权益、负债、信用额度、资产负债率与 EV 的自动计算；
- 利息、到期还本、所得税、现金通胀、生产资产折旧、破产判定与最终排名；
- 资产投资、债务/股权融资、策略攻击、并购、债转股、抵押和弃牌复活等核心互动；
- 本地试玩房间（同一浏览器不同标签）；可选 Firebase 实时同步，支持远程联机；
- GitHub Pages 自动发布工作流。

## 本地打开

这是无构建依赖的静态站点。直接用浏览器打开 `index.html`，或在本目录启动任意静态文件服务，即可试玩。

## 开启远程多人联机

GitHub Pages 只能发布前端页面；实时房间需要一个同步服务。本项目已集成 Firebase Firestore：

1. 在 [Firebase 控制台](https://console.firebase.google.com/) 创建 Web 项目。
2. 在 **Authentication** 开启“匿名登录”，在 **Firestore Database** 创建数据库。
3. 将项目中的 `firestore.rules` 发布到 Firestore（Firebase CLI：`firebase deploy --only firestore:rules`）。
4. 打开网站右上角设置，粘贴 Firebase Web 配置 JSON 并连接。
5. 创建房间后，将 6 位邀请码发给朋友；所有玩家使用同一 Firebase 配置即可实时同步。

> 当前版本是浏览器端规则引擎，适合朋友房和教学对局。若要公开运营或做排行榜，应增加服务器端的行动校验、私密手牌和反作弊机制。

## 发布到 GitHub Pages

1. 新建一个 GitHub 仓库，把本目录内容推送到 `main` 分支。
2. 进入仓库 **Settings → Pages**，在 **Build and deployment** 中选择 **GitHub Actions**。
3. 推送后，`.github/workflows/deploy-pages.yml` 会自动发布网站。
4. 在 Actions 工作流完成页即可取得公开网址。

不需要把 Firebase 配置写入仓库：玩家可在页面上自行粘贴，浏览器会将其保存在本地。
