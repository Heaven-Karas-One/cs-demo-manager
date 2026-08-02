# 上游 v3.20.1 同步与更新日志

## 同步信息

- 同步日期：2026-08-02
- 上游仓库：`akiver/cs-demo-manager`
- 上游版本：`v3.20.1`
- 上游提交：`8961f5072fe4d42803dde68e8e71b3c90b216504`
- 本地分支：`dev`
- 同步前本地提交：`a018e84c`

上游在发布 `v3.20.1` 前重写了 `main` 和 `v3.20.0` 标签历史。本次没有覆盖本地已有的
`v3.20.0` 标签，而是单独获取新的 `upstream/main` 和 `v3.20.1` 标签。新旧历史仍共享
`53378ccd` 祖先，因此使用标准三方合并，不需要强制重置或重新应用 custom 提交。

## v3.20.1 主要更新

### 地图与数据库

- 支持 2026-07-09 CS2 更新中的新地图数据。
- 新增 `cs_shelter`、`de_boulder`、`de_debris`、`de_eldorado`、`de_fachwerk` 的雷达图、缩略图和默认地图配置。
- 修复 `de_cache` 坐标、比例、雷达图和缩略图。
- 数据库 schema 从 12 更新到 14；迁移 13 写入新增默认地图，迁移 14 修正 `de_cache` 参数。

### Demo 分析与回放

- `@akiver/cs-demo-analyzer` 更新到 `1.10.5`。
- 更新 CS2、CS:GO 服务端插件和预编译二进制。
- 新增旧版本 demo 回放所需的插件版本。
- 修复 Linux 下回放控制命令不可用。
- 修复 CS:GO 从游戏内视角生成相机时可能崩溃的问题。
- 适配 Valve SDK 移除 `Plat_FatalErrorFunc` 的变化，并清理插件编译警告。

### 中文本地化

- 修复 Crowdin 配置使用错误语言目录代码导致简体中文资源不能正确下载的问题。
- custom 仍保留 `i18n:patch-zh-cn` 本地补丁作为无 Crowdin Token 时的构建兜底。

### 依赖与界面

- Electron 更新到 `43.1.1`，Vite+ 更新到 `0.2.5`，TypeScript 更新到 `7.0.2`。
- React Router 更新到 `8.2.0`，并升级 Tailwind、Kysely、Milkdown、WebSocket 等依赖。
- 日期选择器从 `react-day-picker` 迁移到 `@daypicker/react` 10.0.1，并同步样式适配。
- 更新 Lingui Vite 配置及构建、发布、格式检查流程。

## 合并冲突处理

本次只有两个文本冲突：

- `package.json`：采用上游 `3.20.1` 版本号和全部依赖升级，同时保留 custom 的
  `i18n:patch-zh-cn` 脚本及 `@electron/asar` 依赖。
- `pnpm-lock.yaml`：采用上游新依赖解析结果，并补回 custom 的 `@electron/asar@3.4.1` 锁定记录。

同时更新以下子模块到上游指定提交：

- `cs2-server-plugin/cs2-server-plugin/deps/hl2sdk`：`dc8e7324`
- `cs2-server-plugin/cs2-server-plugin/deps/json`：`a03e6542`
- `csgo-server-plugin/csgo-server-plugin/deps/json`：`a03e6542`

## Custom 功能保留情况

- Custom 应用名称、窗口标题、App ID、独立可执行文件名和 `dist-custom` 输出目录保持不变。
- 玩家投掷物统计及其中文补丁保持不变。
- 比赛概览按回合累计统计和可点击回合时间轴保持不变。
- 玩家头像切换修复保持不变。
- 本次数据库迁移只增加或修正地图元数据，不会删除已有比赛、玩家或投掷物统计数据。

## 验证

- [x] 合并冲突标记已清除。
- [x] 子模块已检出到上游指定提交。
- [x] 使用 `vp install --frozen-lockfile` 安装合并后的依赖。
- [x] `vp run compile` 通过。
- [x] `vp run lint` 通过。
- [x] `vp run test` 通过：10 个测试文件，44 项测试。
- [x] `vp run deadcode` 通过，仅保留 3 条仓库原有配置提示。
- [x] 除 Windows 下的 `CLAUDE.md` 符号链接占位文件外，其余 2672 个文件格式检查通过。
- [x] 已构建 `dist-custom/win-unpacked/cs-demo-manager-custom.exe`。
- [x] EXE 与 `app.asar` 版本均为 `3.20.1`，产品名为 `CS Demo Manager Custom`。
- [x] 散包包含简体中文 renderer 和 main-process 资源。
