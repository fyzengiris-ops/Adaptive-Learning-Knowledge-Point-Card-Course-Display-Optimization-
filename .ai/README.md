# 自适应学习 · `.ai` 工作流

把**整个 `.ai` 目录**复制到另一个前端原型项目后，在 Cursor 里打开该项目，即可继续写业务逻辑。

## 复制后先做什么

1. 让代理执行 **Skill 7**（`.ai/skills/07-prd-annotation-kit/SKILL.md`），把角标运行时拷进当前项目。
2. 之后按页面走：Skill0 清单 → Skill1 决策 → Skill2 注册表 → Skill3 角标 → Skill5 PRD。
3. 本地预览用：

```txt
node scripts/prd-dev-server.js --port 8085
```

才能在浏览器里双击需求正文，并写回 `js/requirements/*.registry.js`。

## 浏览器里怎么改注释

| 操作 | 效果 |
| --- | --- |
| 单击蓝色数字角标 | 打开悬浮业务逻辑 |
| 双击蓝色数字 | 改讲解序号（不改需求 id / 锚点） |
| 双击面板标题或条目 | 编辑正文，失焦后反写注册表 |

## Skill 目录

| 编号 | 目录 | 作用 |
| --- | --- | --- |
| 0 | `skills/00-page-object-inventory` | 审哪些对象 |
| 1 | `skills/01-page-logic-auditor` | 待确认问题 / 决策 |
| 2 | `skills/02-requirement-registry-writer` | 生成需求注册表 |
| 7 | `skills/07-prd-annotation-kit` | 接入角标运行时与写回 |
| 3 | `skills/03-requirement-marker-reviewer` | 往页面对象上挂角标 |
| 4 | `skills/04-prd-prototype-integrator` | 右侧 PRD 面板 |
| 5 | `skills/05-registry-to-prd-generator` | 生成 Markdown PRD |
| 6 | `skills/06-requirement-annotation-refiner` | 清洗注释表达 |
