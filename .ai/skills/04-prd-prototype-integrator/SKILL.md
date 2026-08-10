---
name: prd-prototype-integrator
description: 当需要在已经生成需求注册表，并且页面角标/锚点已完成或已确认后，实现右侧 PRD 阅读面板与原型页面联动时使用；用于创建可开关可拖拽的右侧 PRD 面板、点击 PRD 卡片定位页面锚点、高亮对象、执行 activate 路径，并与已有角标/悬浮面板同步选中状态。业务逻辑详情必须原样展示 logicSections，不二次套模板。不负责分批添加初始页面角标，也不生成 Markdown PRD。
---

# 右侧 PRD 面板联动 Skill

## 目标

基于 `js/requirements` 与页面已有锚点，打通右侧 PRD 阅读面板与原型页。

最终效果：

- 默认关闭右侧面板，原型占满
- 小 icon 开关面板；打开后挤压原型，可拖拽宽度
- 点击需求卡片执行 `activate`，定位并高亮锚点
- 与角标/悬浮面板尽量同步选中
- 详情区**原样展示 `logicSections`**

执行前必须先读：

```txt
.ai/skills/shared/project-context.md
.ai/skills/shared/logic-writing-spec.md
.ai/skills/04-prd-prototype-integrator/references/layout-and-activation.md
js/requirements/index.js
js/requirements/schema.js
```

若指定页面，还要读对应 `*.registry.js`。

若注册表不存在，提示先跑 Skill2。  
若无稳定锚点且用户未明确要求本次补锚点，提示先跑 Skill3。

## 执行边界

可以：

- 新增/更新 `requirement-reader-shell.js`、`requirement-panel.js`、`requirement-highlight.js`、`requirement-utils.js`、`css/prd.css`
- 包装布局、开关、拖拽宽度、列表、详情、`activate`

不可以：

- 负责逐个补初始角标（除非用户明确要求最小补齐）
- 生成 Markdown PRD
- **改写或二次组织 `logicSections`**

## 业务逻辑详情渲染（关键）

右侧详情必须：

1. 只读 `requirement.logicSections`
2. 按 section 顺序展示 `title` + `items`
3. 组内单层编号（如 `1.1`、`1.2`）

右侧详情禁止：

1. 固定渲染「显示说明 / 操作说明」两段式（除非 `logicSections` 本身就是这两项）
2. 自动补「页面展示 / 状态反馈 / 后续流程」等栏目
3. 双编号
4. 展示空兜底说明
5. 读取旧 `display` / `operation` 作为主正文

**渲染层不负责重新组织业务逻辑，只负责呈现 Skill2 已生成的分组。**

总规范：

```txt
.ai/skills/shared/logic-writing-spec.md
```

## 布局与激活

布局、拖拽、浮层避让、`activate` 执行方式见：

```txt
.ai/skills/04-prd-prototype-integrator/references/layout-and-activation.md
```

支持动作：`navigate`、`openPanel`、`openDialog`、`setStep`、`setTab`、`scrollTo`、`highlight`。  
优先显式控制器，不要文案模拟点击。

## 注册表使用

从 `js/requirements/index.js` 读取 registries。列表可用：

- `pageName`、`module`、`requirements`
- `id`、`title`、`sourceType`、`anchorId`、`activate`
- 详情正文：`logicSections`

`excludedDecisions` 不作为普通需求卡片。

## 样式

静态 HTML/CSS/JS；工具型阅读面板；不引入 React/shadcn/Tailwind。

## 验证

```txt
node --check js/prd/<改动文件>.js
```

检查：默认关闭、可开关、可拖拽、`activate` 有效、详情按 `logicSections` 展示、角标独立可用。

## 完成摘要

```md
一、实现结果
- 新增/更新文件：...

二、已支持能力
- 右侧 PRD 面板开关
- 拖拽调整宽度
- 点击定位和高亮
- activate 路径执行
- logicSections 原样展示：是/否
- 与角标/悬浮面板同步：支持/不支持/部分支持

三、验证结果
- node --check：通过/失败
- 页面检查：...
```
