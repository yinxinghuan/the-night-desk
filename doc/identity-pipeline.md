# Identity Pack 生产规范

## 目的

本项目沿用 `IdentityPack` 代码名，将用户资料转换为可被 Portrait Quest 消费的角色资产。第二轮实验确认：源头像和脸部描述只负责“谁是主角”，但服装立绘与全屏图实际属于“人物 × 主题”交叉资产，不应被理解为可跨主题直接复用的纯身份包。

## 输入

```json
{
  "username": "ghostpixel",
  "userId": "618336286",
  "sourceAvatar": "https://...webp",
  "avatarDescribe": "Lovely ghost in white cloth",
  "sourceStyle": "Ghibli"
}
```

开发时可运行：

```bash
node scripts/lookup-aigram-user.cjs ghostpixel
```

该查询端点只用于制作期按准确用户名获取公开角色资料；运行时当前玩家和联系人仍应走 Aigram bridge，不得把制作期查询当成登录鉴权。

## 最终资产契约

每个用户在 `public/art/<username>/` 提供：

```text
anchor.png
neutral.png
confident.png
worried.png
defiant.png
exhausted.png
arrival.png
resolved.png
intro.png
midpoint.png
win.png
lose.png
```

- `anchor`：角色身份与服装基准，不直接要求进入每局。
- `neutral`～`exhausted`：固定构图的高频状态立绘，建议去背。
- `arrival` / `resolved`：独立入场与结局姿态，不是动作帧。
- `intro` / `midpoint` / `win` / `lose`：竖屏全场景关键帧。

`src/PortraitQuest/identity/<username>.ts` 只负责把相对资源路径和平台资料映射为 `IdentityPack`，不得包含游戏规则。

## 制作期文件

以下内容放在 `_artifacts/<username>/`，不进入构建：

- 绿幕原图；
- 场景比例布局参考；
- 海报无字底图；
- transit 请求、prompt、ref URL 与结果 URL 日志；
- 被淘汰的角色锚点和重试记录。

## 生产顺序

1. 用用户名查询用户资料，确认用户名、头像和形象描述对应同一用户。
2. 以平台头像为 `ref_url` 生成一个主题角色锚点。
3. 检查身份、物种/轮廓、服装、手脚数量、文字污染和背景。
4. 锚点通过后，所有状态图直接以该锚点的公网结果 URL 为 reference。
5. 状态图顺序生成；请求失败使用 3 秒、8 秒、15 秒退避重试。
6. 为竖屏场景制作 1024 × 1820 的比例参考，将去背锚点放在主体安全区后上传。
7. 四张全屏图都引用同一场景比例参考，并重复完整角色锁与场景锁。
8. 生成完毕后制作角色接触表和场景接触表，统一检查，而不是逐张凭感觉放行。
9. 只把通过 QA 的最终资产放进 `public/`，制作期文件留在 `_artifacts/`。

## Prompt 分层

每次请求由四部分组成：

```text
STYLE          全包一致的媒介、色彩、光线和禁用项
IDENTITY LOCK  头像中不可改变的物种、脸、轮廓与比例
ROLE LOCK      当前主题的服装、配饰和身份道具
STATE / SCENE  本张图片唯一允许变化的表情、姿态或剧情动作
```

状态图不得引用上一张状态图，避免链式漂移；只引用已确认锚点。场景图不得省略 Identity Lock，即使比例参考已经含有角色。

## 去背策略

平台模型不保证真实透明通道。当前验证路径是：

1. 提示生成纯绿背景、无地面、无阴影、单一角色；
2. 根据绿色相对红蓝通道的领先值计算 alpha；
3. 对半透明边缘做绿色去溢色；
4. 在粉色、深蓝和白色三种背景上复查边缘；
5. 如果模型生成复杂环境，不强行自动抠图，直接重做该张。

对于白色角色，允许保留 2～4 px 的主题色描边，防止在浅色场景中丢失轮廓；但不能保留大面积绿幕光边。

## QA 清单

- 第一眼仍能认出源头像的身份、物种或核心造型。
- 所有状态保持相同服装、扣子数量、主配饰与整体比例。
- 不出现额外手脚、重复道具、随机文字、Logo、水印或 UI。
- 表情状态在 160 px 高度下仍能区分，不只依赖眉毛等细节。
- 去背边缘在三种测试背景上没有超过 3 px 的污染。
- 全屏图中主角脸不被结果面板、标题安全区或底部操作区遮挡。
- intro、midpoint、win、lose 形成清楚的开端、转折和结局，而不是四张相似站姿。
- 所有游戏内路径通过 `import.meta.env.BASE_URL` 或相对路径解析，不使用站点根绝对路径。

## 本次 ghostpixel 验证结果

- 第一张锚点因模型在胸牌上生成“no”文字而淘汰；第二张改为圆形黄铜针，无文字，通过。
- 7 张状态图的白布轮廓、深蓝制服、三枚黄铜扣和腰间钥匙保持一致。
- `worried`、`exhausted`、`arrival` 与 `resolved` 在缩略尺寸下区分明确；`defiant` 强度偏克制，但仍可通过身体前倾和手势识别。
- 4 张全屏图保持角色一致，且分别覆盖值班台开场、集体点亮转折、晨光胜利和永夜失败。
- 中断续跑是必要能力：批量任务曾在已拿到 URL、尚未下载时被切断；脚本现会复用日志补下载，不重复生图。

## Isabel × 秋日失物亭验证结果

- 平台用户名查询对 `Isabel` / `isabel` 返回 `data: null`；来源改为用户提供的 Aigram 主页截图，`userId` 保持空字符串，不推测或伪造。
- 从截图裁取 108 × 108 圆形头像并放大为 512 × 512 制作参考；平台 upload URL、每次生图 prompt 和结果 URL均记录在 `_artifacts/isabel/generation-log.json`。
- 角色锁稳定保留肩长波浪浅棕发、金色面框挑染、柔和椭圆脸；角色层固定焦糖开衫、栗棕上衣、深绿围裙和无字黄铜叶针。
- 1 张锚点、7 张状态立绘和 4 张剧情图在首轮批量中全部成功，无额外生图重试；`worried`、`exhausted`、`arrival` 和 `resolved` 在小尺寸下区分明显。
- 模型虽然响应“纯绿背景”，仍在人物边缘产生绿色细节。处理脚本以高亮绿阈值去背，并在 alpha 后自动 trim + 28 px 安全边距；游戏内对人类立绘使用 270 × 306 近景裁切，避免全身留白降低主角占比。
- 四张场景分别表现开亭、所有失物回应、日落归还与物品堆满亭子的失败，叙事功能不同；角色脸、发型、开衫、围裙和叶针保持一致。

## 推荐的下一版资产分层

```text
SourceIdentity       username / userId / sourceAvatar / identityLock
RolePortraitPack     sourceIdentity × themeRole → anchor + 7 states
NarrativeScenePack   rolePortrait × themeScene → intro + midpoint + win + lose
ThemeCartridge       events / copy / stats / endings / palette
```

当前 TypeScript 仍保留 `IdentityPack` 以避免在验证期扩大重构；新增第三个主题前应按上面四层正式改名和拆分。
