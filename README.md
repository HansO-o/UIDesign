# UIDesign

一个正在起步的开源 UI 组件项目。从自然、可访问的选择交互开始，面向 Web 与 React Native。

## 项目内容

- `public/`：静态官网与 7 个可交互示例（分段选择、单选、多选、开关、滑块、标签页和步进器）。示例是独立的原生 DOM 实现，用于展示交互，并非下述 React 组件的构建产物；除选择组件外，其余示例尚不是可复用组件。
- `components/`：受控的单选列表和分段选择器源码，分别提供 React DOM 与 React Native 实现，共享类型与选择计算。具体用法和限制见 [组件说明](components/README.md)。
- `wrangler.jsonc`：Cloudflare Workers 静态资源配置。

分段选择器支持点击和拖动，松手选择最近的选项。Web 示例支持键盘方向键。React Native 实现使用 JS 线程上的 PanResponder；重负载、真机和读屏体验仍需验证，不能保证与 UI 线程动画一样流畅。目前是早期源码，不是已发布的 npm 包。

## 本地查看

可用任何静态服务器提供 `public/` 目录，例如：

```sh
python3 -m http.server 8000 --directory public
```

运行基础测试：`npm test`（需要 Node.js 22.18 或更高版本）。

## 部署

安装依赖后运行 `npm run dev` 本地预览，或在已登录、确认目标 Cloudflare 账号后运行 `npm run deploy`。部署前请先检查 Worker 名称及路由，避免覆盖现有服务。当前配置不会自动绑定自定义域名。

## 许可

项目尚未指定开源许可证，使用和分发许可有待仓库所有者确定。
