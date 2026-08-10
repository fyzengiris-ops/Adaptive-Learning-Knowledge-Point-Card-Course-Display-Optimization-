---
name: requirement-marker-reviewer
description: 当需要在 js/requirements 需求注册表基础上，为已经调整好的前端页面或页面局部添加需求编号角标、稳定 data-req-anchor、点击悬浮业务逻辑面板时使用；用于让用户在具体组件、按钮、字段、文案旁边分批核对业务逻辑。悬浮面板必须原样展示 logicSections，不二次套模板。不创建右侧 PRD 阅读面板、不实现拖拽分栏、不执行 activate 联动，也不生成 Markdown PRD。
---

# 页面逻辑角标核对 Skill

## 目标

基于 `js/requirements` 中的需求注册表，把页面里需要核对业务逻辑的对象标出来。

最终效果：

- 页面对象附近展示需求编号角标
- 点击角标后打开悬浮业务逻辑面板
- 面板**原样按 `logicSections` 展示一级标题与条目**
- 可分批完成核对
- 不接入右侧 PRD 面板，不执行 `activate`，不生成 Markdown PRD

执行前必须先读：

```txt
.ai/skills/shared/project-context.md
.ai/skills/shared/logic-writing-spec.md
js/requirements/index.js
js/requirements/schema.js
```

若指定页面，还要读：

```txt
js/requirements/<页面或流程>.registry.js
```

若 `js/requirements` 不存在，停止并提示先运行 `requirement-registry-writer`。

## 执行边界

可以：

- 新增/复用 `js/prd/requirement-marker.js`、`requirement-floating-card.js`、`requirement-utils.js`、`css/prd.css`
- 在目标页面加 `data-req-anchor` 与角标
- 做不影响视觉主交互的最小包裹

不可以：

- 创建右侧 `requirement-panel.js` / reader shell
- 实现拖拽分栏
- 执行 `activate`
- 生成 `docs/prd/*.prd.md`
- **改写、重分类、扩写 `logicSections` 正文**

## 悬浮面板渲染（关键）

悬浮面板必须：

1. 只读取 `requirement.logicSections`
2. 按 section 顺序展示：`title` + `items`
3. 每组内使用单层编号（如 `1.1`、`1.2`）
4. 展示需求编号与需求标题

悬浮面板禁止：

1. 二次映射成「页面展示 / 状态反馈 / 操作规则 / 后续流程 / 异常边界」
2. 自动补空栏目
3. 对 `items` 再套一层编号造成双编号
4. 展示空兜底说明
5. 展示 `display` / `operation` 旧字段正文（若旧数据残留，忽略）
6. 展示技术字段名、大段路径、`excludedDecisions`

业务逻辑写作与渲染总规则：

```txt
.ai/skills/shared/logic-writing-spec.md
```

**渲染层只负责呈现，不负责重新组织业务逻辑。**  
若发现 `logicSections` 缺失、空数组或明显仍是旧 display/operation 结构，停止扩写，提示先修正 Skill2 注册表。

## 页面锚点与角标

```html
data-req-anchor="<anchorId>"
```

锚点必须来自注册表 `anchorId`。

### 贴准规则（关键）

1. **角标必须贴在本条需求对应的具体对象上**（文案、Tab、数量、「X 套」、状态、按钮等），让人不点开也能看出「这条在说谁」。  
2. **禁止**把字段级需求的锚点只挂在无关父级大容器上，导致角标出现在误解位置（例如主内容区需求却落在试卷「X 套」旁）。  
3. 注册表 `objectName` 写「平台精选课」时，角标应在「平台精选课」Tab；写「试卷套数」时，应在「X 套」。  
4. **无独立 UI 的口径规则**：挂在注册表指定的最强关联落点旁，并保证该落点与逻辑主题一致。  
5. 小尺寸对象（数量、状态、短文案）优先使用**紧邻/行内**贴标，避免绝对定位漂到远处角落。  
6. 页面角标显示本批连续短号 `1、2、3…`；悬浮面板内仍显示完整需求编号。  
7. 角标可靠近对象、不遮挡主操作；可点击；选中态清晰。

## 分批核对

优先顺序：主流程 → 关键入口 → 字段/筛选/Tab → 弹窗/空态/异常。

每批说明：已加角标编号、对应对象、未处理范围、是否改了公共脚本。

## 验证

```txt
node --check js/prd/<改动文件>.js
```

并检查：目标页可打开、角标可点、面板按 `logicSections` 展示、无空栏目、无双编号。

## 完成摘要

```md
一、实现结果
- 新增/更新文件：...

二、本批已支持核对
- 已加角标需求：...
- 对应页面对象：...

三、未处理范围
- ...

四、验证结果
- node --check：通过/失败
- 面板是否原样展示 logicSections：是/否
```
