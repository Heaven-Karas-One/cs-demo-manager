# Avatar State Bugfix Notes

## Issue

When switching between pinned player profiles, the player name updated immediately but the avatar could show the
previous player's image.

## Cause

`src/ui/components/avatar.tsx` and `src/ui/components/table/cells/avatar-cell.tsx` copied the initial `avatarUrl` prop
into local React state. The state was only changed by the image `onError` handler, so a reused component instance kept
the previous image source when a new player was rendered.

## Fix

2026-10-10 上游同步时，两个头像组件改为直接从最新的 `avatarUrl` 派生图片地址，只在本地状态记录
加载失败的 URL。失败地址显示默认头像，切换到不同地址立即使用新地址；图片元素以地址作为 key。
不再通过 effect 同步图片地址，符合升级后的 React lint 规则，也避免首帧显示上一位玩家的头像。

Validation:

- `vp run compile`
- `vp run lint`
- `vp run test`
- `vp run deadcode`
- `vp run build`
