# 需求注释运行时安装细节

## 脚本引入顺序

放在业务 `app.js` 之前：

```html
<link rel="stylesheet" href="css/prd.css" />
<link rel="stylesheet" href="css/prd-panel.css" />
```

```html
<script src="js/prd/prd-annotation-config.js"></script>
<script src="js/requirements/<page>.registry.js"></script>
<script src="js/requirements/index.js"></script>
<script src="js/prd/requirement-utils.js"></script>
<script src="js/prd/requirement-highlight.js"></script>
<script src="js/prd/requirement-writeback.js"></script>
<script src="js/prd/requirement-floating-card.js"></script>
<script src="js/prd/requirement-marker.js"></script>
<script src="js/prd/requirement-panel.js"></script>
<script src="js/prd/requirement-reader-shell.js"></script>
```

## 入口结构

页面主内容包进 `#prd-reader-shell > .prd-prototype-area`。  
`</body>` 前保留：

```html
<aside id="prd-side-panel" class="prd-side-panel" hidden>
  <div id="prd-panel-resizer" class="prd-panel-resizer" aria-hidden="true"></div>
  <header class="prd-panel-header">
    <div>
      <h2>PRD 阅读面板</h2>
      <div class="prd-panel-sub" data-prd-page-title>选择页面需求</div>
    </div>
    <button type="button" class="prd-panel-close" data-prd-close aria-label="关闭">×</button>
  </header>
  <div class="prd-panel-toolbar">
    <label for="prd-page-select">当前页面注册表</label>
    <select id="prd-page-select" data-prd-page-select></select>
  </div>
  <div class="prd-panel-body">
    <div class="prd-req-list" data-prd-list></div>
    <div class="prd-detail" data-prd-detail>
      <div class="prd-detail-placeholder">选择左侧需求卡片，查看业务逻辑并定位页面对象。</div>
    </div>
  </div>
</aside>

<button type="button" id="prd-markers-toggle" class="prd-markers-toggle">角标</button>
<button type="button" id="prd-panel-toggle" class="prd-panel-toggle">PRD</button>
```

## 配置

`js/prd/prd-annotation-config.js`：

```js
window.PRD_ANNOTATION_CONFIG = {
  writebackUrl: "/__prd/writeback",
  routeRegistries: {
    section: "section-course",
    chapter: "chapter-course",
  },
  resolveRegistryForHash: function (hash, getById) {
    return null; // 一页多注册表时在这里分支
  },
};
```

`routeRegistries` 的 key 是去掉 `#` 的 hash，value 是注册表 `registryId`。

## 锚点

Skill3 在对象 DOM 上写：

```html
data-req-anchor="<anchorId>"
```

短文案、数量、状态用 `class="req-anchor-inline"`。

## 写回协议

`POST /__prd/writeback`

```json
{
  "registryId": "kp-lecture-concept",
  "requirementId": "KP_LECTURE_CONCEPT-002",
  "patch": {
    "title": "学业要求",
    "logicSections": [{ "title": "数据规则", "items": ["..."] }]
  }
}
```

服务只改 `js/requirements/*.registry.js` 里对应需求的 `title` / `logicSections`，不改 `id`、`anchorId`、`activate`。

## 预览

```txt
node scripts/prd-dev-server.js --port 8085
```

打开 `http://127.0.0.1:8085/`。  
`python -m http.server` 能看角标，但不能反写文件。
