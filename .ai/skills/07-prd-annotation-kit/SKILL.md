---
name: prd-annotation-kit
description: 把需求数字角标、悬浮业务逻辑面板、双击改角标序号、双击编辑正文并反写注册表，作为可复制运行时接入当前前端原型。当用户要复制 .ai 到其他项目、接入需求角标、启用浏览器内编辑写回、或还没有 js/prd 运行时时使用。
---

# 需求注释运行时 Kit

## 目标

把「页面数字角标 + 悬浮/右侧需求面板 + 浏览器内编辑 + 反写注册表」做成可随 `.ai` 一起带走的运行时。

复制 `.ai` 到新项目后，执行本 Skill，即可接入同一套效果，不必从零手写角标脚本。

最终效果：

- 单击角标：打开悬浮业务逻辑面板（原样展示 `logicSections`）
- 双击角标数字：改展示序号，不改需求 id / 锚点
- 双击面板标题或正文：编辑后写回 `js/requirements/*.registry.js`
- 右侧 PRD 面板同样支持双击编辑写回

执行前必须先读：

```txt
.ai/skills/shared/project-context.md
.ai/skills/07-prd-annotation-kit/references/install.md
```

## 什么时候跑

满足任一条件就执行：

- 用户要把 `.ai` 接到一个还没有 `js/prd/` 的项目
- 用户提到：需求角标、悬浮注释、双击改号、双击编辑、反写注册表
- Skill3 发现 `js/prd/requirement-marker.js` 不存在

若运行时已经在 `js/prd/` 且写回服务已接入，不要重复覆盖；只补缺失文件和 HTML 引用。

## 不要做什么

- 不要从零重写角标/面板脚本
- 不要改业务页面视觉主稿（只加锚点包装、引入脚本）
- 不要在本 Skill 里生成业务 `logicSections`（那是 Skill2）
- 不要把角标序号写进注册表（序号只存在浏览器本地）

## 必须复制的文件

从本 Skill 的 `kit/` 复制到项目根（已存在且内容是本套运行时则跳过）：

```txt
kit/css/prd.css                         → css/prd.css
kit/css/prd-panel.css                   → css/prd-panel.css
kit/js/prd/*.js                         → js/prd/*.js
kit/js/requirements/schema.js           → js/requirements/schema.js
kit/js/requirements/index.template.js   → 按项目生成 js/requirements/index.js
kit/scripts/prd-dev-server.js           → scripts/prd-dev-server.js
```

`prd-annotation-config.js` 必须按当前项目路由改写，模板见 `kit/js/prd/prd-annotation-config.template.js`。

HTML 片段见 `references/install.md`。

## 执行步骤

1. 确认项目是可打开的静态 HTML 原型（有 `index.html` 或等价入口）。
2. 复制 kit 运行时文件。
3. 按页面 hash 填写 `PRD_ANNOTATION_CONFIG.routeRegistries`；一页多注册表时实现 `resolveRegistryForHash`。
4. 入口 HTML 引入 CSS、shell 结构、脚本（顺序见 install.md）。
5. 若还没有注册表：提示先跑 Skill2，再跑 Skill3 挂 `data-req-anchor`。
6. 预览命令改为：

```txt
node scripts/prd-dev-server.js --port 8085
```

不要用 `python -m http.server` 作为写回预览：它不能 POST 反写文件。

7. 验证：
   - `node --check js/prd/*.js`
   - 打开一页，角标可单击、可双击改号
   - 双击悬浮面板一条正文，失焦后对应 `*.registry.js` 文件内容变化

## 使用说明（告诉用户）

- 单击蓝色数字：看业务逻辑
- 双击蓝色数字：改讲解序号（只改显示，刷新仍在；不改 id）
- 双击面板标题/分组名/条目：编辑；回车或失焦写回注册表
- 右下角提示「已写回注册表」即成功；若提示要用 Node 启动，改用上面的预览命令

## 完成摘要

```md
一、接入结果
- 已复制/跳过的文件：...
- 入口 HTML 是否已引入：是/否
- 预览命令：node scripts/prd-dev-server.js --port <端口>

二、配置
- routeRegistries：...
- 一页多注册表：有/无

三、验证
- 角标单击/双击改号：...
- 面板双击写回：...
```
