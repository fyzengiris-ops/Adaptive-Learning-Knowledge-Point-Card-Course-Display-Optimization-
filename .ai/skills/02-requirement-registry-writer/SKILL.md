---
name: requirement-registry-writer
description: 当需要把页面代码、Skill1 已确认决策，以及合理延伸的业务边界，合并成完整结构化需求注册表时使用；用于生成或更新 js/requirements/schema.js、页面 registry.js 和统一导出 index.js。用户可见业务逻辑以 logicSections 自适应分组写入，供后续页面角标、悬浮面板、右侧 PRD 面板、Markdown PRD 同源读取。
---

# 需求注册表生成 Skill

## 目标

为当前页面或流程生成完整业务逻辑注册表。

注册表不是“只记录被用户确认过的问题”，也不是“只描述当前前端已经实现了什么”。  
它是该页面对象应有的完整业务规则源数据，供 Skill3 / Skill4 / Skill5 同源使用。

本 Skill 不负责重新向用户做全量审核，也不负责实现角标或右侧面板。  
它负责：收集规则、补齐合理延伸、归类成 `logicSections`、编号并结构化落盘。

执行前必须先读：

```txt
.ai/skills/shared/project-context.md
.ai/skills/shared/logic-writing-spec.md
.ai/skills/02-requirement-registry-writer/references/registry-field-spec.md
```

本项目是静态 HTML/CSS/JS 原型，注册表使用 JavaScript + JSDoc，不生成 TypeScript。

## 输入来源（三来源）

1. **A. 页面代码已体现**  
   识别对象是什么、页面露出了什么交互与文案。必要，但通常不够。

2. **B. Skill1 已确认决策**  
   默认读取：

```txt
docs/prd-workflow/decisions/*.decision.md
```

   已确认口径是硬约束。

3. **C. 合理延伸**  
   基于 A+B，补齐该类对象通常必须定清、且与已确认口径一致的边界场景。  
   例如：统计周期、生成触发、快照不回刷、转班、截止后重批、历史入口跳转等。

如果用户没有指定具体决策文件：

1. 若目录下只有一个 `.decision.md`，直接使用。  
2. 若有多个，先列出并询问。  
3. 若没有决策文件，仍可基于代码 + 合理延伸生成，但必须说明“本次无 Skill1 决策补充”；拿不准且影响验收的点应提示回到 Skill1。

## 输出文件

```txt
js/requirements/schema.js
js/requirements/<页面或流程>.registry.js
js/requirements/index.js
```

- `schema.js`：JSDoc 结构定义（含 `logicSections`）
- `*.registry.js`：页面注册表
- `index.js`：统一导出

## 用户可见正文：logicSections

每条需求必须有 `logicSections`，这是用户可见业务逻辑的**唯一来源**。

生成顺序必须是：

```txt
收集规则素材（A+B+C）
→ 整理成原子业务规则
→ 按“回答什么问题”归类
→ 生成一级标题与 items
→ 无规则的标题不生成；一条规则只进一组
```

详细写作规范见：

```txt
.ai/skills/shared/logic-writing-spec.md
```

### 禁止

- 只写当前前端已实现内容
- 固定套用「显示说明 + 操作说明」两段式
- 再拆「页面展示 / 状态反馈 / 操作规则 / 后续流程」固定子模板
- 跨标题重复同一规则
- 为凑结构写空标题或空兜底句
- 继续把 `display` / `operation` 当作用户正文主结构

### 允许的一级标题示例

显示说明、操作说明、统计口径、计算规则、数据规则/数据来源、选取规则、排序规则/展示顺序、状态规则、生成规则、快照/历史类标题、异常情况处理，以及更准确的自定义标题。

## 执行流程

1. 确认页面或流程范围。  
2. 读取 `project-context.md`、`logic-writing-spec.md`、`registry-field-spec.md`。  
3. 读取目标页面相关代码（`index.html`、`js/app.js`、`css/app.css` 等）。  
4. 识别有业务含义的对象，形成需求项候选。  
5. 读取目标 `.decision.md`（如有）并合并到对应对象。  
6. 对每条进入 `requirements` 的需求：  
   - 收集 A/B/C 规则素材  
   - 写成原子规则  
   - 归类生成 `logicSections`  
   - 生成编号、锚点、`activate`、验收标准、来源信息  
7. 范围外决策写入 `excludedDecisions`。  
8. 创建或更新 `schema.js`、页面 `registry.js`、`index.js`。  
9. 输出生成摘要（含每条使用了哪些一级标题）。

## 哪些内容进入 requirements

满足任一即可：

- 页面上有业务含义的可见对象
- 用户可执行或不可执行的操作
- 需要定清的统计/生成/快照/排序/异常等业务规则
- 需要角标核对、右侧 PRD 展示或进入 Markdown PRD

注意：即使 Skill1 未提问，只要对象需要完整业务规则，也要进入注册表；`logicSections` 不得只停留在 UI 表象。

## 需求拆分粒度：决策单元（既不能太粗也不能太细）

按「**一个核对入口 = 一个可独立拍板的业务决策**」拆条，不按像素拆，也不按整页大框糊成一条。

### 应拆开

满足任一即可拆成多条：

1. **决策对象不同**（如课程筛选 vs 试卷筛选）
2. **页面落点不同**（如来源 Tab vs 试卷「X 套」）
3. **验收点不同**（如数量角标口径 vs Tab 切换规则）
4. **有无独立 UI 不同**（有控件的规则 vs 纯口径规则；后者仍可成条，但要指定最强关联落点）

### 不应拆开

满足任一应合并：

1. **同一字段下的枚举选项**（如待学习 / 学习中 / 已学习）——写进同一条，不要每个选项一个角标
2. **同一操作的连续步骤**（打开抽屉 → 选择 → 确定）若只在描述同一入口怎么用
3. **拆开后大量重复**，只是换了选项名
4. **拆开后仍只能挂在同一落点**，无法让人从位置区分在说谁

### 自检问句

> 产品/测试会不会单独指着这个角标说：我们就核对这一块？  
> - 会 → 可成条  
> - 只会说「这是某个筛选项里的一个值」→ 合并进父条

### 筛选模块示例（目标粒度）

- 一条：筛选抽屉有哪些维度（课程状态 / 试卷状态）
- 一条：课程筛选规则（三态、只滤课程等；选项写在 items 里）
- 一条：试卷筛选规则（二态、只滤试卷等）
- **不要**：已学习、学习中、已练习各一条

## 锚点选择规则

1. **有明确字段/文案/按钮**：`anchorId` 必须对应那个具体对象，不要挂无关父级大容器。  
2. **无独立 UI 的口径规则**：仍单独成条时，锚到**与该逻辑关联性最强**的可见对象旁（关联落点）。  
3. `objectName` 与锚点对象名称应一致，便于 Skill3 贴准角标。

示例：

```txt
section.source.tabs          → 三类来源 Tab
section.source.count         → 来源数量角标
section.papers.count         → 试卷「X 套」
section.filter.course        → 课程筛选（可落在课程状态或筛选入口的课程维度）
```

## 哪些内容进入 excludedDecisions

- “本次不改 / 本期不管 / 已上线非本次范围”
- “不属于当前页面”
- 仅作范围边界说明的内容

## 需求编号 / 锚点 / activate

编号：

```txt
HOME-001
SECTION_COURSE-001
CHAPTER_COURSE-001
SPECIAL_CENTER-001
KP_LECTURE-001
REPORT-001
```

`activate` 常见动作：`navigate`、`openPanel`、`openDialog`、`setStep`、`setTab`、`scrollTo`、`highlight`（含义见 `project-context.md`）。

已有编号不要重排；删除编号不复用。

## 运行后摘要格式

```md
一、生成结果
- 已生成/更新 schema：js/requirements/schema.js
- 已生成/更新注册表：js/requirements/<页面或流程>.registry.js
- 已生成/更新统一出口：js/requirements/index.js

二、进入注册表的需求
1. <需求编号>：<需求标题>（来源：code/code+decision/decision；标题：显示说明/生成规则/...）
2. ...

三、未纳入需求卡片的决策
- <对象>：<原因>

四、需要后续处理
- <例如：需要 Skill3 为 anchorId 增加 data-req-anchor>
```

## 输出约束

- 除必要路径与字段名外，尽量中文
- 不要把未确认审核建议写进 registry
- 不要把“本次不改”伪装成需求卡片
- 不要只输出代码表面实现
- 不要与 Skill1 已确认口径矛盾
- 用 JSDoc，不创建 `.ts`
- 需求 id / 锚点不使用运行时随机值
