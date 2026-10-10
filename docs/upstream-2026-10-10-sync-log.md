# 2026-10-10 上游同步与更新日志

## 同步范围

- 上游：`akiver/cs-demo-manager` 的 `main`。
- 上次基线：`8961f507`（`v3.20.1`）。
- 本次目标：`b45a5f29`（2026-10-04）。
- 新增上游提交：61 个，范围为 `8961f507..b45a5f29`。
- 合并前 custom：`dev`，提交 `7c15a606`。
- 上游 `package.json` 仍为 `3.20.1`；本次同步的是该版本之后的主分支代码，不另行增加版本号。
- `origin/main` 用于跟踪纯上游，`origin/dev` 用于 custom；本地也保持相同分支划分。

## 主要更新

### 数据库

- 新增内置 PostgreSQL，首次使用可直接选择内置模式，无需单独部署数据库。
- 保留外部 PostgreSQL 模式；已有设置通过迁移自动保留原来的连接参数和外部模式。
- Demo 数据导入改用 `pg-copy-streams`，移除外部 `psql` 命令依赖。
- 修复数据库断开期间导入连接池、等待中的任务、COPY 命令取消等问题。
- 数据库 schema 升到 15，为 `kills(match_checksum, round_number)` 和
  `rounds(match_checksum, number)` 增加查询索引；迁移不删除现有比赛和玩家数据。
- 设置 schema 升到 14，增加数据库模式和 macOS 开机最小化设置。

### 后台、分析和 CLI

- GUI 和 CLI 改为连接同一个本地 WebSocket 后台进程；GUI 关闭后，正在进行的分析或视频任务仍可继续。
- 后台支持发现、健康检查、自动启动、空闲退出和版本检查。
- 修复后台启动失败、端口占用、发现文件写入不完整、断开连接和退出过程中的多项问题。
- 有客户端连接或任务运行时，后台不会接受关闭请求。
- CLI 分析时对重复 Demo 路径去重；多个客户端共享分析任务时，只有最后一个客户端离开才取消。
- 修复 GUI 查看比赛时 CLI 重新分析同一场比赛导致的崩溃，以及失败 Demo 返回后无法重新加载的问题。

### Demo 与回放

- 支持 `.zst` 压缩 Demo 和下载地址中的压缩格式识别。
- Demo 分析器从 `1.10.5` 升到 `1.11.0`。
- 增加 Demo 播放器接口能力。
- CS:GO 回放改用独立 CS:GO 应用，替代 `csgo_legacy` 分支。
- 修复确认 Counter-Strike 正在运行后提示框未关闭的问题。
- 修复带构建编号的 HLAE 可执行文件版本检测。

### 界面和视频

- 多个设置或对话框同时打开时，正确保持背景界面不可操作。
- 设置或对话框打开时，标题栏仍可点击和操作窗口。
- 避免主窗口加载期间重复创建窗口。
- 2D 查看器导出玩家语音时显示加载状态。
- 视频生成增加 libx264 无损输出提示，调整相关文案。
- 新增斯洛文尼亚语言配置。

### 开发与依赖

- Electron 升到 `44.5.1`，Vite+ 升到 `1.0.0`，React 升到 `19.3.0`，React Router 升到 `8.4.0`。
- Lingui 升到 `6.9.0`，Kysely 升到 `0.29.6`，并更新其他 UI、数据库和工具依赖。
- Node 使用 `package.json` 的 `devEngines` 锁定为 `24.21.0`，替代 `.node-version`。
- main/server/CLI 构建从 esbuild 迁移到 Rolldown，开发模式后台可独立调试。
- 更新 GitHub Actions 工作流，移除 CodeRabbit 配置，保留 Claude review。

## 冲突与 Custom 适配

文本冲突共 5 处：

- `AGENTS.md`：保留 fork 的规范和文档入口，补充共享后台、内置数据库和新 schema 信息。
- `package.json` 与 `pnpm-lock.yaml`：采用上游依赖版本，同时保留 custom 中文补丁脚本和
  `@electron/asar@3.4.1`。
- `src/electron-main/system-startup-behavior.ts`：保留 custom 应用标识，同时合入 macOS 登录启动设置。
- `src/ui/settings/about/about.tsx`：保留 custom 标题，同时合入数据库模式和 PostgreSQL 日志信息。

额外兼容修复：

- 玩家投掷物页面改用 `csdm/server/messages/renderer-client-message-name`，适配上游消息目录迁移。
- custom 后台发现文件改为 `daemon-com.heavenkaras.csdm.custom.json`；状态响应增加 `appId`，端口占用时
  只把相同 App ID 和开发模式的后台视为自身后台，其他进程则使用随机空闲端口。
- 上述后台区分不改变 `.csdm/settings.json` 或数据库地址。custom 与原版同版本时也不会误用缺少
  投掷物查询接口的原版后台。
- 调整两个头像组件和概览回合选择组件的状态更新，适配新版 React 的 `set-state-in-effect` 检查，
  保留头像即时切换、加载失败回退和切换比赛时回到全场统计的行为。
- 原有投掷物统计、队友与自身统计、可调整表格、回合累计统计、头像修复、CUSTOM 标题和构建目录保留。
- 既有本地提交一并纳入 `origin/dev`，不改写提交历史。

## 验证与交付

- [x] 冲突标记已清除。
- [x] `vp install --frozen-lockfile` 成功，使用 Node 24.21.0、pnpm 12.6.0 和 Vite+ 1.0.0。
- [x] `vp run lint`、`vp run compile` 通过。
- [x] 除 Windows 下的 `CLAUDE.md` 符号链接占位文件外，2722 个文件格式检查通过。
- [x] `vp run test` 通过：17 个文件、88 项测试，包含不删除原版后台发现文件的回归测试。
- [x] `vp run deadcode` 通过，仅有 4 条工具配置提示。
- [x] `vp run build` 成功；保留分析器 Node 模块浏览器外部化和包体积提示。

交付目标为 `origin/dev`（custom 合并结果）和 `origin/main`（纯上游 `b45a5f29`），采用快进推送。

安装时内置 PostgreSQL 下载无进度，改用上游支持的 `CI=true` 验证模式跳过该运行时下载；项目依赖、
原生模块和本地 lint 规则安装完成。后续打包必须完成 `static/postgres` 安装。
没有 Crowdin、Steam、FACEIT 构建密钥，验证构建显示对应提示；中文 EXE 打包仍需现有中文补丁流程。

本次交付为源码同步；现有 `dist-custom` EXE 不代表本次最新源码。
数据库和设置迁移只会在启动新版程序时执行，本次验证不会启动实际程序或连接现有数据库。

## 后续同步命令

旧 `v3.20.0` 标签曾与上游同名标签存在历史差异；日常同步只获取分支，新增版本标签按需单独获取：

```text
git -c maintenance.auto=false fetch --no-tags upstream main
git -c maintenance.auto=false fetch --no-tags origin
git merge --no-ff upstream/main
```

Windows 安装新版 Node 运行时期间，`vp.cmd` 可能运行正在被安装器替换的
`node_modules/.bin/node.exe`。遇到拒绝访问时，以工程外的 Node 执行
`node_modules/vite-plus/bin/vp install --frozen-lockfile`，不要删除或终止其他任务的进程。
