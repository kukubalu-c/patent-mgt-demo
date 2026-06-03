# 专利管理系统 - 演示版

纯前端演示，无需服务器，双击 `demo.html` 即可在浏览器打开。

输入任意密码即可进入。（演示密码验证已关闭）

## 上传到 GitHub Pages

1. 在 GitHub 新建一个仓库（例如 `patent-demo`）
2. 将本文件夹所有文件上传到该仓库
3. 进入 Settings → Pages → Source 选 "main" → 文件夹选 "/ (root)" → Save
4. 等待 1-2 分钟后，访问 `https://你的用户名.github.io/patent-demo/demo.html`

## 文件结构

```
├── demo.html              ← 入口页面（打开这个）
├── demo-mock-api.js       ← 模拟后端（数据在内存中，刷新重置）
├── demo-lib/
│   ├── echarts.min.js     ← 图表库
│   └── xlsx.full.min.js   ← Excel 库
└── src/
    ├── css/style.css
    └── js/
        ├── api.js
        ├── login.js
        ├── workbench.js
        ├── datahub.js
        ├── dashboard.js
        ├── db-migration.js
        └── (7 个前端逻辑文件)
```
