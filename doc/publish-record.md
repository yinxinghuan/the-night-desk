# 发布记录

## 身份

- 游戏 ID：`the-night-desk`
- 永久 UUID：`d39a7632-d13b-4602-abf5-39cbe45b168a`
- 主角用户名：`ghostpixel`
- 分类：`strategy`

## 交付地址

- 源码仓库：`https://github.com/yinxinghuan/the-night-desk`
- 在线游戏：`https://yinxinghuan.github.io/the-night-desk/`
- Remix 源码包：`https://github.com/yinxinghuan/the-night-desk/archive/refs/heads/main.zip`
- 列表海报：`https://yinxinghuan.github.io/games/posters/the-night-desk.png`

## 发布门禁

- 2026-07-14：使用 Aigram transit 叙事海报，1024 × 1024 与 160 × 160 均通过检查。
- 2026-07-14：`npm ci` 与 `npm run build` 通过，Vite `base: './'`。
- 2026-07-14：UUID 注入与唯一性检查通过。
- 2026-07-14：公开仓库隐私审计完成；源头像 URL、绿幕原图、transit 日志和制作脚本不进入公开 Git 历史。
- 2026-07-14：GitHub Pages workflow `29284776300` 成功。
- 2026-07-14：线上 HTML 返回 `index-FoiFPjk7.js`；bundle 实测包含 `THE NIGHT DESK`、`ghostpixel` 和本游戏 UUID。
- 2026-07-14：线上 `poster.png`、intro 图、`main.zip`、games 列表海报均返回 HTTP 200。
- 2026-07-14：公开 `games.json` 已将本游戏放在新作区并包含 UUID、strategy 分类与 zipurl。
- 平台客户端是否可见仍取决于同事的迁移工具将 games.json 重新入库；本工作区没有该迁移工具，不能把 GitHub 清单更新误报为平台 DB 已更新。
