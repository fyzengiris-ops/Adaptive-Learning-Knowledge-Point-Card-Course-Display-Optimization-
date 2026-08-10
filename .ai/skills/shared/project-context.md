# 自适应学习原型项目上下文

本文件约束 `.ai/skills` 下全部 Skill 在本仓库中的落地方式。执行任一 Skill 前，必须先阅读本文件。

## Skill 主流程顺序

业务逻辑相关 Skill 默认按以下顺序执行：

```txt
Skill0 页面对象清单 → Skill1 页面逻辑审核 → Skill2 需求注册表 → Skill3 角标评审 → …
```

| Skill | 目录 | 作用 |
| --- | --- | --- |
| 0 | `00-page-object-inventory` | 先锁「审什么」：对象清单，用户核对遗漏并确认必审/可跳过 |
| 1 | `01-page-logic-auditor` | 再定「怎么定」：只对已确认「必审」对象出决策题 |
| 2+ | `02-…` 及之后 | 注册表、角标、PRD 等，输入以 Skill1 决策为准 |

清单落盘路径：

```txt
docs/prd-workflow/inventories/<页面或流程>.inventory.md
```

约束：

- 没有已确认的 Skill0 清单时，不要直接开始 Skill1 的 `1A2C3D` 输出。
- Skill0 只产出清单，不替代 `docs/prd-workflow/decisions/*.decision.md`。

## 项目类型

本项目是**静态前端原型**，不是 Next.js / React / TypeScript 工程。

主要入口与文件：

```txt
index.html
css/app.css
js/app.js
assets/
```

页面切换使用 hash 路由，例如：

| hash | 页面/视图 | 主容器 id |
| --- | --- | --- |
| `#home` | 首页 | `view-home` |
| `#section` | 课程中心·小节 | `view-section` |
| `#chapter` | 课程中心·章节 | `view-chapter` |
| `#special` | 专项学习中心 | `view-special` |
| `#kp-lecture` | 知识点精讲卡片 | `view-kp-lecture` |
| `#papers` | 试卷相关视图（如有） | `view-papers` |

没有 `package.json` 业务依赖、没有 `pnpm`/`npm` 业务脚本、没有 `src/` React 目录、没有 shadcn/ui、没有 lucide-react。

## 需求注册表落地路径

需求注册表统一放在：

```txt
js/requirements/schema.js
js/requirements/<页面或流程>.registry.js
js/requirements/index.js
```

说明：

- 使用 **JavaScript + JSDoc** 描述结构，不生成 TypeScript `.ts` 文件。
- `schema.js` 用 JSDoc `@typedef` 定义字段；各 `*.registry.js` 导出普通对象。
- `index.js` 统一导出 `requirementRegistries` 数组或映射，供角标与面板读取。
- 字段名（`id`、`anchorId`、`display`、`operation`、`activate` 等）保持 Skill 原有语义，不因技术栈变化而改名。

## 页面角标 / 悬浮面板 / 右侧 PRD 面板落地路径

通用实现放在：

```txt
js/prd/requirement-utils.js
js/prd/requirement-marker.js
js/prd/requirement-floating-card.js
js/prd/requirement-reader-shell.js
js/prd/requirement-panel.js
js/prd/requirement-highlight.js
css/prd.css
```

接入方式：

- 在 `index.html` 中按需引入 `css/prd.css` 与上述脚本。
- 在 `js/app.js` 或独立初始化脚本中挂载角标、悬浮面板、右侧面板。
- 页面锚点使用 `data-req-anchor="<anchorId>"`，写在 `index.html` 对应 DOM 上。

## 路由与激活动作约定

`route` 字段优先写 hash，例如：`#chapter`、`#kp-lecture`。

组件级页面可写：`view:view-kp-lecture`。

`activate` 常用动作在本项目中的含义：

| type | 本项目落地方式 |
| --- | --- |
| `navigate` | 设置 `location.hash`，如 `#chapter` |
| `openPanel` | 打开筛选抽屉、目录下拉、专项面板等已有面板 |
| `openDialog` | 打开课程中心入口弹窗等已有 dialog/mask |
| `setTab` | 切换页面 Tab，如章节 `同步课/专题课/拓展课`、小节来源 Tab、知识点演示模式 |
| `setStep` | 切换原型内步骤/分页，如知识点卡片左右页 |
| `scrollTo` | 滚动到 `data-req-anchor` |
| `highlight` | 高亮 `data-req-anchor` |

优先调用 `js/app.js` 已有函数或补充清晰控制器，不要用脆弱的文案查找点击。

## 本项目常见页面命名示例

编写示例、编号前缀、锚点时，优先使用本项目对象：

- 首页科目切换、章节树选择、课程中心入口
- 课程中心·小节：同步课/校本课、来源 Tab、配套试卷
- 课程中心·章节：同步课/专题课/拓展课、考点说明、典型例题、空状态跳转
- 专项学习中心：专项卡片入口
- 知识点精讲：核心概念、公式定理、考点清单、典型例题、解析、好题本

需求编号前缀示例：

```txt
HOME-001
SECTION_COURSE-001
CHAPTER_COURSE-001
SPECIAL_CENTER-001
KP_LECTURE-001
```

锚点示例：

```txt
chapter.tabs.extend
chapter.direction
chapter.example.badge
kp-lecture.concept.panel
kp-lecture.exam.point-1
```

## 验证方式

本项目默认验证方式：

1. 用本地静态服务打开 `index.html`（例如已有 `http://127.0.0.1:5500/`）。
2. 手动检查目标 hash 页面是否正常。
3. 检查角标、悬浮面板、右侧面板交互是否可用。
4. 如改动了 JS，可用 Node 做语法检查：`node --check js/xxx.js`。

不要要求执行 `pnpm ts-check`、`pnpm lint`，除非后续项目真的引入了对应工具链。

## 决策与 PRD 文档路径

保持不变：

```txt
docs/prd-workflow/decisions/<页面或流程>.decision.md
docs/prd/<页面或流程>.prd.md
```

## 禁止沿用的旧项目假设

以下内容属于原作业/AI 小乐项目假设，**不要**作为本项目默认前提：

- Next.js、React、TypeScript、Tailwind、shadcn/ui、lucide-react
- `src/requirements/*.ts`、`src/components/prd/*.tsx`
- `pnpm ts-check` / `pnpm lint`
- 作业管理、上传录题、AI 小乐识别资料、题号框选、裁剪还原等业务示例（除非用户明确要求写这类逻辑）
