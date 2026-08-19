(function () {
  const views = {
    home: document.getElementById("view-home"),
    section: document.getElementById("view-section"),
    chapter: document.getElementById("view-chapter"),
    papers: document.getElementById("view-papers"),
    special: document.getElementById("view-special"),
    "kp-lecture": document.getElementById("view-kp-lecture"),
  };

  const modal = document.getElementById("course-modal");
  let homeScope = "section";

  function normalizeHash(hash) {
    const value = (hash || "").replace(/^#/, "").trim();
    if (
      value === "section" ||
      value === "chapter" ||
      value === "papers" ||
      value === "special" ||
      value === "kp-lecture"
    ) {
      return value;
    }
    return "home";
  }

  function showView(name) {
    const key = normalizeHash(name);
    Object.entries(views).forEach(([id, el]) => {
      if (!el) return;
      el.classList.toggle("active", id === key);
    });
    const nextHash = "#" + key;
    if (location.hash !== nextHash) {
      location.hash = nextHash;
    }
    if (key === "kp-lecture") {
      // 默认落在知识点精讲 Tab；卡片模式由演示开关控制
      const textTab = document.querySelector('.lecture-tab[data-panel="lecture-text"]');
      const videoTab = document.querySelector('.lecture-tab[data-panel="lecture-video"]');
      const textPanel = document.getElementById("lecture-text");
      const videoPanel = document.getElementById("lecture-video");
      if (textTab && videoTab) {
        textTab.classList.add("active");
        videoTab.classList.remove("active");
      }
      if (textPanel && videoPanel) {
        textPanel.classList.add("active");
        videoPanel.classList.remove("active");
      }
      if (typeof renderKpCard === "function") renderKpCard();
    }
  }

  function closeModal() {
    if (modal) modal.classList.remove("show");
  }

  // Hash routing
  window.addEventListener("hashchange", () => {
    showView(location.hash);
  });

  // 首页顶部：章节树形下拉（章节 / 小节）
  const scopePicker = document.getElementById("scope-picker");
  const scopeMenu = document.getElementById("scope-menu");
  const homeScopeName = document.getElementById("home-scope-name");
  const homeScopeTitle = document.getElementById("home-scope-title");

  function setHomeScope(scope, label, selectedEl) {
    homeScope = scope === "chapter" ? "chapter" : "section";
    if (homeScopeName && label) homeScopeName.textContent = label;
    if (!scopePicker) return;

    scopePicker.querySelectorAll(".catalog-section, .catalog-chapter").forEach((el) => {
      el.classList.remove("active");
    });
    if (selectedEl) selectedEl.classList.add("active");

    scopePicker.classList.remove("open");
    if (scopeMenu) scopeMenu.hidden = true;
    if (homeScopeTitle) homeScopeTitle.setAttribute("aria-expanded", "false");
  }

  if (scopePicker) {
    homeScopeTitle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = scopePicker.classList.toggle("open");
      scopeMenu.hidden = !open;
      homeScopeTitle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    scopePicker.querySelectorAll("[data-toggle-group]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const groupId = btn.getAttribute("data-toggle-group");
        const group = scopePicker.querySelector('.catalog-group[data-group="' + groupId + '"]');
        if (group) group.classList.toggle("open");
      });
    });

    scopePicker.querySelectorAll(".catalog-section").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        setHomeScope("section", opt.getAttribute("data-scope-label"), opt);
      });
    });

    scopePicker.querySelectorAll(".catalog-chapter .catalog-label").forEach((labelBtn) => {
      labelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const chapterRow = labelBtn.closest(".catalog-chapter");
        setHomeScope(
          "chapter",
          chapterRow.getAttribute("data-scope-label"),
          chapterRow
        );
      });
    });

    document.addEventListener("click", (e) => {
      if (!scopePicker.contains(e.target)) {
        scopePicker.classList.remove("open");
        scopeMenu.hidden = true;
        homeScopeTitle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 事件委托导航
  document.addEventListener("click", (e) => {
    const navEl = e.target.closest("[data-nav]");
    if (!navEl) return;
    e.preventDefault();
    const target = navEl.getAttribute("data-nav");
    if (target === "course-center" || target === "course-pick") {
      closeModal();
      showView(homeScope);
      return;
    }
    closeModal();
    showView(target);
  });

  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Course center tabs (section + chapter)
  // chapter：顶部课型 Tab 由下方 switchChapterType 统一处理
  let switchChapterType = null;
  document.querySelectorAll(".tabs").forEach((tabBar) => {
    tabBar.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const scope = tabBar.getAttribute("data-scope");
        const chapterType = tab.getAttribute("data-chapter-type");
        if (scope === "chapter" && chapterType && typeof switchChapterType === "function") {
          // 先确保课程面板可见，再切课型
          tabBar.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          document
            .querySelectorAll(`[data-panel-scope="${scope}"]`)
            .forEach((panel) => {
              panel.classList.toggle("active", panel.id === "chapter-sync");
            });
          switchChapterType(chapterType);
          return;
        }
        tabBar.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        document
          .querySelectorAll(`[data-panel-scope="${scope}"]`)
          .forEach((panel) => {
            panel.classList.toggle("active", panel.id === tab.dataset.panel);
          });
      });
    });
  });

  // Subject switch (visual only)
  document.querySelectorAll(".subject").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".subject").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Side nav (visual only)
  document.querySelectorAll(".side-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".side-item").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Section source tabs (平台精选 / 备课 / 录像) — 仅小节维度
  const sectionSync = document.getElementById("section-sync");
  if (sectionSync) {
    const sourceTabs = sectionSync.querySelectorAll(".source-tab");
    const sourcePanels = sectionSync.querySelectorAll(".source-panel");
    sourceTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-source");
        sourceTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        sourcePanels.forEach((panel) => {
          panel.classList.toggle("active", panel.getAttribute("data-source-panel") === key);
        });
      });
    });
  }

  // Chapter：顶部课型 Tab 联动左侧课程列表 + 右侧试卷
  const chapterSplit = document.getElementById("chapter-type-split");
  const chapterTabBar = document.querySelector('.tabs[data-scope="chapter"]');
  const CHAPTER_TYPE_META = {
    sync: {
      courseHint: "重难点 · 专项突破",
      courseCount: "3 门",
      papersHint: "强化突破",
      count: "2 套",
      empty: false,
      theme: "theme-sync",
    },
    extend: {
      courseHint: "学有余力 · 拔高拓展",
      courseCount: "2 门",
      papersHint: "挑战进阶",
      count: "",
      empty: true,
      theme: "theme-extend",
    },
  };
  if (chapterSplit) {
    const typePanels = chapterSplit.querySelectorAll("[data-chapter-panel]");
    const paperLists = chapterSplit.querySelectorAll("[data-chapter-papers]");
    const courseHint = document.getElementById("chapter-course-hint");
    const courseCount = document.getElementById("chapter-course-count");
    const papersHint = document.getElementById("chapter-papers-hint");
    const papersCount = document.getElementById("chapter-papers-count");

    switchChapterType = function (key) {
      if (key === "topic") key = "sync";
      if (!CHAPTER_TYPE_META[key]) return;

      if (chapterTabBar) {
        chapterTabBar.querySelectorAll(".tab").forEach((t) => {
          t.classList.toggle("active", t.getAttribute("data-chapter-type") === key);
        });
      }

      typePanels.forEach((panel) => {
        panel.classList.toggle("active", panel.getAttribute("data-chapter-panel") === key);
      });
      paperLists.forEach((list) => {
        list.classList.toggle("active", list.getAttribute("data-chapter-papers") === key);
      });

      const meta = CHAPTER_TYPE_META[key];
      if (courseHint) courseHint.textContent = meta.courseHint;
      if (courseCount) {
        courseCount.textContent = meta.courseCount || "";
        courseCount.style.display = meta.courseCount ? "" : "none";
      }
      if (papersHint) papersHint.textContent = meta.papersHint;
      if (papersCount) {
        papersCount.textContent = meta.count;
        papersCount.style.display = meta.empty || !meta.count ? "none" : "";
      }
      // Tab 壳承载设计感；内容区仍挂主题 class，供点缀色/缩略图用
      const tabsShell = document.getElementById("chapter-tabs-shell");
      [tabsShell, chapterSplit].forEach((host) => {
        if (!host) return;
        host.classList.remove("theme-sync", "theme-topic", "theme-extend");
        host.classList.add(meta.theme);
      });
    };

    chapterSplit.querySelectorAll("[data-jump-chapter-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchChapterType(btn.getAttribute("data-jump-chapter-type"));
      });
    });
  }

  // ========== 知识点精讲卡片 ==========
  const KP_DATASETS = {
    multi: {
      name: "幂函数的单调性",
      ability: "掌握",
      frequency: "高频",
      core: [
        {
          text: "形如 y = x<sup>α</sup>（α 为常数，x 是自变量）的函数称为幂函数，系数必须为 1。",
          image: "assets/kp-power-functions.png",
          imageAlt: "幂函数 y = x<sup>α</sup> 图象示意",
        },
        "当 α > 0 时，幂函数在 (0, +∞) 上单调递增，图象过定点 (1,1)；若定义域包含 0，则同时过 (0,0)。当 α < 0 时，幂函数在 (0, +∞) 上单调递减，图象过定点 (1,1)，并以两坐标轴为渐近线。学习时务必先根据指数 α 的符号判断第一象限的增减趋势，再结合奇偶性去推导对称区间上的单调性，避免脱离定义域空谈增减。",
        "判断单调性须优先确定定义域，并结合奇偶性推导对称区间；定义域不连续时，单调区间必须分开书写，不能用 ∪ 随意连接。",
      ],
      formulas: [
        { name: "定义式", expr: "y = x<sup>α</sup>（α 为常数，系数必须为 1）" },
        { name: "递增条件", expr: "α > 0 时，幂函数在 (0, +∞) 上单调递增，过定点 (1,1)" },
        { name: "递减条件", expr: "α < 0 时，幂函数在 (0, +∞) 上单调递减，以坐标轴为渐近线" },
      ],
      examPoints: [
        {
          name: "考点1：判断一般幂函数的单调性",
          direction:
            "直接给定幂函数解析式，判断单调区间，重点考察定义域与 α 符号的结合。",
          stem: "判断函数 y = x<sup>2/3</sup> 的定义域与单调性。",
          steps: [
            {
              text: "1. 明确定义域与指数符号：",
              hl: "先将指数化为最简分数 α = 2/3，分子偶数、分母奇数，故定义域为全体实数 ℝ；同时记下 α > 0，后续判断单调性时要用到这一符号条件。",
            },
            {
              text: "2. 先判断 (0, +∞) 上的单调性：",
              hl: "在 (0, +∞) 上，由 α = 2/3 > 0 可知幂函数 y = x<sup>α</sup> 单调递增；再补上端点 x = 0，得到在 [0, +∞) 上单调递增。",
            },
            {
              text: "3. 结合奇偶性：",
              hl: "又因为 α = 2/3 的分子为偶数，函数为偶函数，图像关于 y 轴对称，所以左侧与右侧单调方向相反，故在 (-∞, 0] 上单调递减。",
            },
          ],
          keyPoints: [
            "第一步必求定义域，单调性不能脱离定义域单独讨论；",
            "先由 α 符号确定 [0, +∞) 上的单调性；",
            "结合奇偶性推导对称区间的单调性，无对称性则单独分析。",
          ],
        },
        {
          name: "考点2：判断与幂函数相关的复合函数的单调性",
          direction:
            "幂函数作为外层 / 内层函数构成复合函数，判断单调区间，核心法则为“同增异减”。",
          stem: "求函数 f(x) = √(x² − 2x − 3) 的单调递增区间。",
          steps: [
            { text: "1. 求定义域：", hl: "(-∞, −1] ∪ [3, +∞)" },
            { text: "2. 拆分内外层：", hl: "外层 √t 在 [0, +∞) 递增" },
            { text: "3. 同增异减得：", hl: "单调递增区间为 [3, +∞)" },
          ],
          keyPoints: [
            "定义域优先：所有单调区间必为定义域的子集；",
            "拆分内外层函数，分别判断各自单调性；",
            "依据“同增异减”确定复合单调性，注意内层值域需匹配外层定义域。",
          ],
        },
        {
          name: "考点3：由幂函数的单调性求参数",
          direction:
            "已知单调性求解解析式中参数，常结合幂函数定义（系数为 1）综合考察。",
          stem: "已知幂函数 f(x) = (m² − m − 1)x<sup>m² − 2m − 3</sup> 在 (0, +∞) 上单调递减，求实数 m 的值。",
          steps: [
            { text: "1. 由幂函数定义，系数必为 1：", hl: "m = 2 或 m = −1" },
            { text: "2. 代入指数并用递减条件筛选：", hl: "仅 m = 2 符合" },
            { text: "3. 结论：", hl: "m = 2" },
          ],
          keyPoints: [
            "先利用“系数为 1”求出参数的所有候选值；",
            "代入指数，根据 α 的符号与单调性条件筛选；",
            "验证定义域与特殊情况（如 α = 0 时常函数），排除矛盾解。",
          ],
        },
        {
          name: "考点4：由幂函数的单调性解不等式",
          direction:
            "利用单调性将函数值不等式转化为自变量不等式，常结合奇偶性、定义域设置易错点。",
          stem: "已知幂函数 f(x) = x<sup>2/3</sup>，解不等式 f(2x − 1) < f(x + 2)。",
          steps: [
            { text: "1. 利用偶性与单调性转化：", hl: "|2x − 1| < |x + 2|" },
            { text: "2. 平方整理：", hl: "3x² − 8x − 3 < 0" },
            { text: "3. 解得：", hl: "−1/3 < x < 3" },
          ],
          keyPoints: [
            "先明确函数的奇偶性与核心单调区间；",
            "偶函数利用 f(x) = f(|x|) 转化为非负区间的不等式，避免分类讨论；",
            "转化后需验证自变量定义域，确保有意义。",
          ],
        },
        {
          name: "考点5：由幂函数的单调性比较大小",
          direction:
            "给定多个幂式，利用幂函数单调性比较大小，为高考选择填空常见题型。",
          stem: "比较下列两组数的大小：(1) 1.5<sup>1/3</sup> 与 1.7<sup>1/3</sup>；(2) 3.14<sup>−2/3</sup> 与 π<sup>−2/3</sup>。",
          steps: [
            { text: "1. 同指数正幂：构造 y = x<sup>1/3</sup>，", hl: "1.5<sup>1/3</sup> < 1.7<sup>1/3</sup>" },
            { text: "2. 同指数负幂：构造 y = x<sup>−2/3</sup>，", hl: "3.14<sup>−2/3</sup> > π<sup>−2/3</sup>" },
          ],
          keyPoints: [
            "指数相同、底数不同：构造对应幂函数，直接用单调性比较；",
            "α > 0 时，底数越大函数值越大；α < 0 时，底数越大函数值越小；",
            "底数不在同一单调区间时，借助 0、1 等中间量过渡比较。",
          ],
        },
        {
          name: "考点6：幂函数单调性的其他应用",
          direction:
            "综合定义、奇偶性、单调性，解决值域、恒成立、参数范围等综合问题。",
          stem: "已知幂函数 f(x) = x<sup>m² − 2m − 3</sup>（m ∈ ℕ*）的图象关于 y 轴对称，且在 (0, +∞) 上单调递减，求满足 (a+1)<sup>−m/3</sup> < (3−2a)<sup>−m/3</sup> 的实数 a 的取值范围。",
          steps: [
            { text: "1. 由单调性与奇偶性求参数 m：", hl: "得 m = 1，指数为 −1/3" },
            { text: "2. 按同正 / 同负 / 一负一正分类讨论：", hl: "注意 y = x<sup>−1/3</sup> 在正负区间均递减" },
            { text: "3. 综合得：", hl: "a ∈ (−∞, −1) ∪ (2/3, 3/2)" },
          ],
          keyPoints: [
            "先用奇偶性与单调性锁定未知参数；",
            "解幂函数不等式时关注定义域与不同区间的符号变化，常需分类讨论；",
            "综合题要把“求参”和“解不等式”拆成两段，逐步落地。",
          ],
        },
      ],
    },
    single: {
      name: "解一元一次方程",
      ability: "运用",
      frequency: "高频",
      core: [
        {
          text: "利用等式的基本性质和运算律可以解一元一次方程。",
          image: "assets/kp-power-functions.png",
          imageAlt: "函数图象示意",
        },
        "一般步骤包含：去分母、去括号、移项、合并同类项、系数化为 1。解题时要按顺序推进：先看有没有分母和括号，再把含未知数的项与常数项分列两边，合并同类项后把未知数的系数化为 1，最终得到 x = a 的形式；中间每一步都要保证等式两边同时进行相同运算，避免移项漏变号或去分母漏乘某一项。",
        "通过这些步骤可以使以 x 为未知数的方程逐步向着 x = a 的形式转化。",
      ],
      formulas: [
        {
          name: "一般形式",
          expr: "ax + b = 0（a ≠ 0）→ x = −b / a",
        },
      ],
      examPoints: [
        {
          name: "考点：根据方程的解求字母值",
          direction:
            "已知方程的一个解，反求字母参数，核心是“代回去”得到只含字母的方程。",
          stem: "已知 x = 1 是方程 2ax − 5 = a 的解，则 a =（ ）。",
          steps: [
            { text: "1. 将已知解代入原方程，", hl: "将 x = 1 代入方程 2ax − 5 = a" },
            { text: "2. 得到仅含待求字母的方程", hl: "2a − 5 = a" },
            { text: "3. 解此方程得到字母值", hl: "a = 5" },
          ],
          keyPoints: [
            "把已知解完整代入原方程，得到关于字母的方程；",
            "整理并求解字母，注意移项变号；",
            "必要时回代检验，确认字母值使原方程有意义。",
          ],
        },
      ],
    },
  };

  /** 设计预览：考点类型。确认后再改为后台字段，不在此写入业务规则。 */
  const KP_EXAM_TYPE_CLASS = {
    概念理解: "is-concept",
    方法应用: "is-method",
    综合运用: "is-integrate",
    易错辨析: "is-pitfall",
  };
  const KP_EXAM_TYPE_PREVIEW = [
    "概念理解",
    "方法应用",
    "综合运用",
    "易错辨析",
    "方法应用",
    "综合运用",
  ];

  const kpRoot = document.getElementById("kp-card-root");
  let kpMode = "multi";
  let kpPage = 0; // 0 核心概念 | 1 考点
  /** @type {Record<number, boolean>} 已展开的考点 */
  let kpOpenExams = Object.create(null);
  /** @type {Record<number, boolean>} 各考点解析是否展开 */
  let kpAnalysisOpenMap = Object.create(null);
  /** @type {Record<number, boolean>} 各考点好题本状态 */
  let kpFavoritedMap = Object.create(null);
  let kpSwipeBound = false;
  let kpToastTimer = null;

  const STAR_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 3.6l2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 15.58 7.3 18.05l.9-5.23-3.8-3.7 5.25-.76L12 3.6z"/>' +
    "</svg>";

  const ANALYSIS_EYE_ICON =
    '<svg class="kp-analysis-icon-eye" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M2.8 12s3.2-6.2 9.2-6.2S21.2 12 21.2 12s-3.2 6.2-9.2 6.2S2.8 12 2.8 12z"/>' +
    '<circle cx="12" cy="12" r="2.6"/>' +
    "</svg>" +
    '<svg class="kp-analysis-icon-eye-off" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M3.2 3.2l17.6 17.6"/>' +
    '<path d="M9.7 9.85A2.6 2.6 0 0 0 12 14.6c.5 0 .97-.14 1.37-.38"/>' +
    '<path d="M6.55 6.7C4.4 8.05 2.8 12 2.8 12s3.2 6.2 9.2 6.2c1.7 0 3.2-.45 4.5-1.15"/>' +
    '<path d="M12.9 6.9c2.7.3 5.3 2.35 7.3 5.1-1.05 1.55-2.35 2.85-3.75 3.7"/>' +
    "</svg>";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** 允许数据里的简易 <sup> 标签 */
  function formatRich(str) {
    return escapeHtml(str)
      .replace(/&lt;sup&gt;/g, "<sup>")
      .replace(/&lt;\/sup&gt;/g, "</sup>");
  }

  function buildDirectionHtml(point, withAnchor) {
    if (!point.direction) return "";
    return (
      '<div class="kp-direction' +
      (withAnchor ? " req-anchor-inline" : "") +
      '"' +
      (withAnchor ? ' data-req-anchor="kp-lecture.exam.direction"' : "") +
      ">" +
      '<div class="kp-direction-label">考点说明：</div>' +
      '<p class="kp-direction-text">' +
      formatRich(point.direction) +
      "</p>" +
      "</div>"
    );
  }

  function buildExampleHtml(point, examIndex, withAnchors) {
    const steps = point.steps || [];
    const stepsHtml = steps.length
      ? steps
          .map(function (step) {
            return (
              '<div class="kp-step">' +
              '<div class="kp-step-label">' +
              formatRich(step.text) +
              "</div>" +
              (step.hl
                ? '<div class="kp-step-detail"><span class="kp-hl">' +
                  formatRich(step.hl) +
                  "</span></div>"
                : "") +
              "</div>"
            );
          })
          .join("")
      : '<div class="kp-steps-empty">更新中~</div>';

    const keyPoints = point.keyPoints || [];
    const keyPointsHtml = keyPoints.length
      ? '<div class="kp-keypoints">' +
        '<div class="kp-keypoints-title"' +
        (withAnchors ? ' data-req-anchor="kp-lecture.exam.keypoints"' : "") +
        "><span>解题要点</span></div>" +
        '<ol class="kp-keypoints-list">' +
        keyPoints
          .map(function (item) {
            return "<li>" + formatRich(item) + "</li>";
          })
          .join("") +
        "</ol></div>"
      : "";

    const favorited = !!kpFavoritedMap[examIndex];
    const analysisOpen = !!kpAnalysisOpenMap[examIndex];
    const favLabel = favorited ? "移出好题本" : "加入好题本";

    const badgeBlock =
      '<div class="kp-example-badge' +
      (favorited ? " is-added" : "") +
      (withAnchors ? " req-anchor-inline" : "") +
      '"' +
      (withAnchors ? ' data-req-anchor="kp-lecture.exam.example-badge"' : "") +
      ">" +
      "<span>典型例题</span>" +
      '<button type="button" class="kp-star-btn' +
      (favorited ? " is-added" : "") +
      (withAnchors ? " req-anchor-inline" : "") +
      '"' +
      (withAnchors ? ' data-req-anchor="kp-lecture.exam.favorite"' : "") +
      ' data-kp-action="favorite" data-exam-index="' +
      examIndex +
      '" aria-label="' +
      favLabel +
      '">' +
      STAR_ICON +
      "</button></div>";

    const footBlock =
      '<div class="kp-foot">' +
      '<button type="button" class="kp-fav-btn' +
      (favorited ? " is-added" : "") +
      '" data-kp-action="favorite" data-exam-index="' +
      examIndex +
      '" aria-label="' +
      favLabel +
      '">' +
      "<span>" +
      favLabel +
      "</span>" +
      STAR_ICON +
      "</button>" +
      (withAnchors
        ? '<span class="req-anchor-inline req-marker-slot" data-req-anchor="kp-lecture.exam.favorite-toast" aria-hidden="true"></span>'
        : "") +
      "</div>";

    return (
      '<div class="kp-example">' +
      badgeBlock +
      (withAnchors
        ? '<span class="req-anchor-inline req-marker-slot kp-exam-analysis-slot" data-req-anchor="kp-lecture.exam.analysis" aria-hidden="true"></span>'
        : "") +
      '<button type="button" class="kp-analysis-btn' +
      (analysisOpen ? " is-open" : "") +
      '" data-kp-action="analysis" data-exam-index="' +
      examIndex +
      '" aria-label="' +
      (analysisOpen ? "收起解析" : "查看解析") +
      '">' +
      ANALYSIS_EYE_ICON +
      "<span>解析</span></button>" +
      '<div class="kp-example-stem"' +
      (withAnchors ? ' data-req-anchor="kp-lecture.exam.stem"' : "") +
      ">" +
      formatRich(point.stem) +
      "</div>" +
      '<div class="kp-analysis' +
      (analysisOpen ? " is-open" : "") +
      '" data-kp-analysis data-exam-index="' +
      examIndex +
      '">' +
      '<div class="kp-analysis-title' +
      (withAnchors ? " req-anchor-inline" : "") +
      '"' +
      (withAnchors ? ' data-req-anchor="kp-lecture.exam.steps"' : "") +
      "><span>✦</span><span>解题步骤</span></div>" +
      '<div class="kp-steps">' +
      stepsHtml +
      "</div>" +
      keyPointsHtml +
      footBlock +
      "</div>" +
      '<div class="kp-toast" data-kp-toast data-exam-index="' +
      examIndex +
      '" hidden></div>' +
      "</div>"
    );
  }

  function showKpToast(message, examIndex) {
    if (!kpRoot) return;
    const toast =
      (typeof examIndex === "number"
        ? kpRoot.querySelector('[data-kp-toast][data-exam-index="' + examIndex + '"]')
        : null) || kpRoot.querySelector("[data-kp-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("show");
    if (kpToastTimer) clearTimeout(kpToastTimer);
    kpToastTimer = setTimeout(function () {
      toast.classList.remove("show");
      toast.hidden = true;
    }, 1600);
  }

  function syncFavoriteUI(examIndex) {
    if (!kpRoot) return;
    const favorited = !!kpFavoritedMap[examIndex];
    const scope = kpRoot.querySelector('.kp-exam-card[data-exam-card="' + examIndex + '"]') || kpRoot;
    const badge = scope.querySelector(".kp-example-badge");
    if (badge) badge.classList.toggle("is-added", favorited);
    scope.querySelectorAll('[data-kp-action="favorite"][data-exam-index="' + examIndex + '"]').forEach(function (el) {
      el.classList.toggle("is-added", favorited);
      el.setAttribute("aria-label", favorited ? "移出好题本" : "加入好题本");
      const btnText = el.querySelector("span");
      if (btnText) btnText.textContent = favorited ? "移出好题本" : "加入好题本";
    });
  }

  function resetKpExamPageState() {
    kpOpenExams = Object.create(null);
    kpAnalysisOpenMap = Object.create(null);
  }

  function resetKpInteraction() {
    // 保留各考点解析/好题本独立状态；仅在需要时由调用方清理解析
  }

  function setKpPage(page) {
    const next = page === 1 ? 1 : 0;
    const enteringExam = next === 1 && kpPage !== 1;
    if (enteringExam) {
      kpAnalysisOpenMap = Object.create(null);
    }
    kpPage = next;
    if (!kpRoot) return;
    const slider = kpRoot.querySelector(".kp-slider");
    if (slider) slider.setAttribute("data-page", String(kpPage));
    kpRoot.querySelectorAll("[data-kp-page]").forEach(function (btn) {
      const target = Number(btn.getAttribute("data-kp-page"));
      if (btn.classList.contains("kp-pager-dot")) {
        btn.classList.toggle("active", target === kpPage);
      }
    });
    const prevBtn = kpRoot.querySelector('[data-kp-nav="prev"]');
    const nextBtn = kpRoot.querySelector('[data-kp-nav="next"]');
    if (prevBtn) prevBtn.disabled = kpPage === 0;
    if (nextBtn) nextBtn.disabled = kpPage === 1;
    if (enteringExam) {
      kpRoot.querySelectorAll("[data-kp-analysis]").forEach(function (el) {
        el.classList.remove("is-open");
      });
      kpRoot.querySelectorAll('[data-kp-action="analysis"]').forEach(function (btn) {
        btn.classList.remove("is-open");
        btn.setAttribute("aria-label", "查看解析");
      });
    }
    remountKpRequirementMarkers();
  }

  function renderKpCard() {
    if (!kpRoot) return;
    const data = KP_DATASETS[kpMode] || KP_DATASETS.multi;
    const points = Array.isArray(data.examPoints) ? data.examPoints : [];

    // 公式定理：多考点保留多条编号示例；单考点只展示 1 条简版
    const formulasToShow = Array.isArray(data.formulas)
      ? kpMode === "multi"
        ? data.formulas
        : data.formulas.slice(0, 1)
      : [];
    const showFormula = formulasToShow.length > 0;
    const formulaIsMultiStyle = kpMode === "multi" && formulasToShow.length > 1;

    function normalizeCoreItem(item) {
      if (item && typeof item === "object") {
        return {
          text: item.text || "",
          image: item.image || "",
          imageAlt: item.imageAlt || "示意图",
        };
      }
      return { text: String(item || ""), image: "", imageAlt: "" };
    }

    function buildCoreImageHtml(item, withImageAnchor) {
      if (!item.image) return "";
      return (
        '<figure class="kp-concept-figure"' +
        (withImageAnchor ? ' data-req-anchor="kp-lecture.concept.images"' : "") +
        ">" +
        '<button type="button" class="kp-concept-figure-btn" data-kp-action="preview-image" data-preview-src="' +
        escapeHtml(item.image) +
        '" data-preview-alt="' +
        escapeHtml(item.imageAlt) +
        '" aria-label="放大查看配图">' +
        '<img src="' +
        escapeHtml(item.image) +
        '" alt="' +
        escapeHtml(item.imageAlt) +
        '" loading="lazy" />' +
        "</button>" +
        "</figure>"
      );
    }

    // 核心概念：多/单考点统一为「要点」单容器呈现
    let imageAnchorUsed = false;
    const coreBlockHtml =
      !data.core || !data.core.length
        ? ""
        : '<div class="kp-concept-panel">' +
          '<div class="kp-concept-ribbon req-anchor-inline" data-req-anchor="kp-lecture.concept.points">要点</div>' +
          '<div class="kp-concept-panel-body">' +
          data.core
            .map(function (p, i) {
              const item = normalizeCoreItem(p);
              const withImageAnchor = !!item.image && !imageAnchorUsed;
              if (withImageAnchor) imageAnchorUsed = true;
              return (
                '<div class="kp-concept-point">' +
                '<span class="kp-concept-point-num">' +
                (i + 1) +
                "</span>" +
                '<div class="kp-concept-point-main">' +
                '<p class="kp-concept-point-text' +
                (i === 0 ? " req-anchor-inline" : "") +
                '"' +
                (i === 0 ? ' data-req-anchor="kp-lecture.concept.point-text"' : "") +
                ">" +
                formatRich(item.text) +
                "</p>" +
                buildCoreImageHtml(item, withImageAnchor) +
                "</div></div>"
              );
            })
            .join("") +
          "</div></div>";

    function buildExamCardHtml(ep, i, options) {
      const open = !!options.open;
      const withShellAnchors = !!options.withShellAnchors;
      const withContentAnchors = !!options.withContentAnchors;
      const badgeText = "考点" + (i + 1);
      const tone = typeof options.tone === "number" ? options.tone % 3 : 0;
      const title = formatRich(ep.name || "");
      const examType = KP_EXAM_TYPE_PREVIEW[i] || "概念理解";
      const examTypeClass = KP_EXAM_TYPE_CLASS[examType] || "is-concept";
      return (
        '<div class="kp-exam-card tone-' +
        tone +
        (open ? " is-open" : "") +
        ' is-clickable" data-exam-card="' +
        i +
        '">' +
        '<div class="kp-exam-edge" aria-hidden="true">' +
        '<svg class="kp-exam-wave" viewBox="0 0 320 28" preserveAspectRatio="none">' +
        '<path class="wave-fill" d="M0,18 C40,6 80,26 120,14 C160,2 200,24 240,12 C280,0 300,16 320,10 L320,0 L0,0 Z"/>' +
        "</svg>" +
        '<div class="kp-exam-stickers">' +
        '<span class="eks ek-1"></span><span class="eks ek-2"></span><span class="eks ek-3"></span>' +
        "</div>" +
        '<span class="kp-exam-badge' +
        (withShellAnchors ? " req-anchor-inline" : "") +
        '"' +
        (withShellAnchors ? ' data-req-anchor="kp-lecture.exam.badge"' : "") +
        ">" +
        formatRich(badgeText) +
        "</span>" +
        "</div>" +
        '<button type="button" class="kp-exam-head' +
        (withShellAnchors ? " req-anchor-inline" : "") +
        '"' +
        (withShellAnchors ? ' data-req-anchor="kp-lecture.exam.expand"' : "") +
        ' data-exam-index="' +
        i +
        '">' +
        '<div class="kp-exam-title">' +
        '<span class="kp-exam-name' +
        (withShellAnchors ? " req-anchor-inline" : "") +
        '"' +
        (withShellAnchors ? ' data-req-anchor="kp-lecture.exam.name"' : "") +
        ">" +
        title +
        "</span>" +
        (withShellAnchors
          ? '<span class="kp-exam-type-host req-anchor-inline" data-req-anchor="kp-lecture.exam.type">'
          : "") +
        '<span class="kp-exam-type ' +
        examTypeClass +
        '"><span class="kp-exam-type-text">' +
        examType +
        "</span></span>" +
        (withShellAnchors ? "</span>" : "") +
        "</div>" +
        '<svg class="kp-exam-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>' +
        "</button>" +
        (open
          ? buildDirectionHtml(ep, withContentAnchors) +
            '<div class="kp-exam-body">' +
            buildExampleHtml(ep, i, withContentAnchors) +
            "</div>"
          : "") +
        "</div>"
      );
    }

    const examPageTitle = points.length === 1 ? "考点" : "考点清单";
    const examPageHint =
      points.length === 1
        ? "右滑查看核心概念"
        : "点击考点查看例题 · 右滑查看概念";

    let examPageHtml =
      '<div class="kp-page-title">' +
      '<h2 class="req-anchor-inline" data-req-anchor="kp-lecture.exam.page-title">' +
      examPageTitle +
      "</h2>" +
      '<span class="kp-page-hint"><span class="req-anchor-inline" data-req-anchor="kp-lecture.exam.hint">' +
      examPageHint +
      "</span></span>" +
      "</div>";

    if (!points.length) {
      examPageHtml +=
        '<div class="kp-exam-empty req-anchor-inline" data-req-anchor="kp-lecture.exam.list">暂无考点，先去学习其他内容吧~</div>';
    } else {
      let shellAnchorsUsed = false;
      let contentAnchorsUsed = false;
      examPageHtml +=
        '<div class="kp-exam-list" data-req-anchor="kp-lecture.exam.list">' +
        points
          .map(function (ep, i) {
            const open = !!kpOpenExams[i];
            const withShellAnchors = !shellAnchorsUsed;
            if (withShellAnchors) shellAnchorsUsed = true;
            const withContentAnchors = open && !contentAnchorsUsed;
            if (withContentAnchors) contentAnchorsUsed = true;
            return buildExamCardHtml(ep, i, {
              open: open,
              withShellAnchors: withShellAnchors,
              withContentAnchors: withContentAnchors,
              tone: i,
            });
          })
          .join("") +
        "</div>";
    }

    const formulaItemsHtml = formulasToShow
      .map(function (item, i) {
        const name = typeof item === "string" ? "" : item.name || "";
        const expr = typeof item === "string" ? item : item.expr || "";
        const line = name ? name + "：" + expr : expr;
        return (
          '<li class="kp-formula-item">' +
          (formulaIsMultiStyle
            ? '<span class="kp-formula-no">' + (i + 1) + "</span>"
            : "") +
          '<p class="kp-formula-line">' +
          formatRich(line) +
          "</p></li>"
        );
      })
      .join("");

    const formulaBlock = showFormula
      ? '<div class="kp-formula' +
        (formulaIsMultiStyle ? "" : " is-single") +
        '"><div class="kp-formula-ribbon req-anchor-inline" data-req-anchor="kp-lecture.concept.formulas">公式定理' +
        (formulaIsMultiStyle ? " · " + formulasToShow.length + " 条" : "") +
        '</div><ul class="kp-formula-list">' +
        formulaItemsHtml +
        "</ul></div>"
      : "";

    const abilityText = String(data.ability || "").trim();
    const frequencyText = String(data.frequency || "").trim();
    const abilitySealHtml = abilityText
      ? '<span class="kp-seal ability req-anchor-inline" data-req-anchor="kp-lecture.concept.ability" title="学业要求：' +
        formatRich(abilityText) +
        '">' +
        '<span class="kp-seal-ornament" aria-hidden="true"></span>' +
        '<span class="kp-seal-text">' +
        formatRich(abilityText) +
        "</span>" +
        '<span class="kp-seal-spark" aria-hidden="true"></span>' +
        "</span>"
      : "";
    const frequencySealHtml = frequencyText
      ? '<span class="kp-seal freq req-anchor-inline" data-req-anchor="kp-lecture.concept.frequency" title="考察频率：' +
        formatRich(frequencyText) +
        '">' +
        '<span class="kp-seal-ornament" aria-hidden="true"></span>' +
        '<span class="kp-seal-text">' +
        formatRich(frequencyText) +
        "</span>" +
        '<span class="kp-seal-spark" aria-hidden="true"></span>' +
        "</span>"
      : "";
    const stampsHtml =
      abilitySealHtml || frequencySealHtml
        ? '<div class="kp-stamps" aria-label="知识点属性">' +
          abilitySealHtml +
          frequencySealHtml +
          "</div>"
        : "";

    kpRoot.innerHTML =
      '<article class="kp-deck">' +
      '<div class="kp-deck-deco" aria-hidden="true"></div>' +
      '<header class="kp-head">' +
      '<div class="kp-head-main">' +
      '<h1 class="kp-title req-anchor-inline" data-req-anchor="kp-lecture.concept.name">' +
      formatRich(data.name) +
      "</h1>" +
      stampsHtml +
      "</div></header>" +
      '<div class="kp-slider-shell">' +
      '<div class="kp-slider" data-page="' +
      kpPage +
      '">' +
      '<section class="kp-page">' +
      '<div class="kp-page-inner">' +
      '<div class="kp-page-title">' +
      '<h2 class="req-anchor-inline" data-req-anchor="kp-lecture.concept.page-title">核心概念</h2>' +
      '<span class="kp-page-hint"><span class="req-anchor-inline" data-req-anchor="kp-lecture.concept.hint">点击下方圆点或箭头查看考点</span></span>' +
      "</div>" +
      coreBlockHtml +
      formulaBlock +
      "</div></section>" +
      '<section class="kp-page">' +
      '<div class="kp-page-inner">' +
      examPageHtml +
      "</div></section>" +
      "</div></div>" +
      '<div class="kp-pager req-anchor-inline" data-req-anchor="kp-lecture.concept.pager">' +
      '<button type="button" class="kp-pager-btn" data-kp-nav="prev" aria-label="上一页">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>' +
      "</button>" +
      '<div class="kp-pager-dots">' +
      '<button type="button" class="kp-pager-dot' +
      (kpPage === 0 ? " active" : "") +
      '" data-kp-page="0" aria-label="核心概念"></button>' +
      '<button type="button" class="kp-pager-dot' +
      (kpPage === 1 ? " active" : "") +
      '" data-kp-page="1" aria-label="考点"></button>' +
      "</div>" +
      '<button type="button" class="kp-pager-btn" data-kp-nav="next" aria-label="下一页">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>' +
      "</button>" +
      "</div></article>";

    setKpPage(kpPage);
    bindKpSwipe();
    remountKpRequirementMarkers();
  }

  function remountKpRequirementMarkers() {
    if (
      window.RequirementMarker &&
      typeof window.RequirementMarker.remount === "function"
    ) {
      window.RequirementMarker.remount();
    }
  }

  function ensureKpImagePreview() {
    let mask = document.getElementById("kp-image-preview");
    if (mask) return mask;
    const shell = document.querySelector(".shell") || document.body;
    mask = document.createElement("div");
    mask.id = "kp-image-preview";
    mask.className = "kp-image-preview";
    mask.hidden = true;
    mask.innerHTML =
      '<div class="kp-image-preview-dialog" role="dialog" aria-modal="true" aria-label="图片预览">' +
      '<button type="button" class="kp-image-preview-close" data-kp-preview-close aria-label="关闭">×</button>' +
      '<img class="kp-image-preview-img" alt="" />' +
      "</div>";
    shell.appendChild(mask);
    mask.addEventListener("click", function (e) {
      if (
        e.target === mask ||
        e.target.closest("[data-kp-preview-close]")
      ) {
        closeKpImagePreview();
      }
    });
    return mask;
  }

  function openKpImagePreview(src, alt) {
    if (!src) return;
    const mask = ensureKpImagePreview();
    const img = mask.querySelector(".kp-image-preview-img");
    if (img) {
      img.src = src;
      img.alt = alt || "示意图";
    }
    mask.hidden = false;
    mask.classList.add("show");
  }

  function closeKpImagePreview() {
    const mask = document.getElementById("kp-image-preview");
    if (!mask) return;
    mask.classList.remove("show");
    mask.hidden = true;
  }

  function setKpMode(mode) {
    kpMode = mode === "single" ? "single" : "multi";
    kpPage = 0;
    resetKpExamPageState();
    kpFavoritedMap = Object.create(null);
    document.querySelectorAll("[data-kp-mode]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-kp-mode") === kpMode);
    });
    renderKpCard();
  }

  function toggleKpAnalysis(examIndex) {
    const idx = typeof examIndex === "number" ? examIndex : 0;
    kpAnalysisOpenMap[idx] = !kpAnalysisOpenMap[idx];
    const open = !!kpAnalysisOpenMap[idx];
    const card = kpRoot && kpRoot.querySelector('.kp-exam-card[data-exam-card="' + idx + '"]');
    const scope = card || kpRoot;
    if (!scope) return;
    const analysis = scope.querySelector("[data-kp-analysis]");
    const btn = scope.querySelector('[data-kp-action="analysis"]');
    if (analysis) analysis.classList.toggle("is-open", open);
    if (btn) {
      btn.classList.toggle("is-open", open);
      btn.setAttribute("aria-label", open ? "收起解析" : "查看解析");
    }
    if (open && analysis) {
      analysis.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function bindKpSwipe() {
    // Skill1 口径：不提供手势左右滑；仅底部分页圆点/箭头切换
    return;
  }

  document.querySelectorAll("[data-kp-mode]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      setKpMode(btn.getAttribute("data-kp-mode"));
    });
  });

  if (kpRoot) {
    kpRoot.addEventListener("click", function (e) {
      // 需求角标点击不触发考点展开/解析等业务交互
      if (e.target.closest(".req-marker, .req-marker-input")) return;

      const navBtn = e.target.closest("[data-kp-nav]");
      if (navBtn && kpRoot.contains(navBtn) && !navBtn.disabled) {
        e.preventDefault();
        e.stopPropagation();
        setKpPage(navBtn.getAttribute("data-kp-nav") === "next" ? 1 : 0);
        return;
      }

      const pageDot = e.target.closest("[data-kp-page]");
      if (pageDot && kpRoot.contains(pageDot)) {
        e.preventDefault();
        e.stopPropagation();
        setKpPage(Number(pageDot.getAttribute("data-kp-page")) || 0);
        return;
      }

      const examBtn = e.target.closest("[data-exam-index]");
      if (
        examBtn &&
        kpRoot.contains(examBtn) &&
        examBtn.classList.contains("kp-exam-head")
      ) {
        e.preventDefault();
        e.stopPropagation();
        const next = Number(examBtn.getAttribute("data-exam-index"));
        if (Number.isNaN(next)) return;
        if (kpOpenExams[next]) {
          delete kpOpenExams[next];
        } else {
          kpOpenExams[next] = true;
        }
        const keepPage = kpPage;
        renderKpCard();
        setKpPage(keepPage);
        return;
      }

      const actionEl = e.target.closest("[data-kp-action]");
      if (!actionEl || !kpRoot.contains(actionEl)) return;
      e.preventDefault();
      e.stopPropagation();

      const action = actionEl.getAttribute("data-kp-action");
      const actionExamIndex = Number(actionEl.getAttribute("data-exam-index"));
      if (action === "analysis") {
        toggleKpAnalysis(Number.isNaN(actionExamIndex) ? 0 : actionExamIndex);
        return;
      }
      if (action === "favorite") {
        const idx = Number.isNaN(actionExamIndex) ? 0 : actionExamIndex;
        kpFavoritedMap[idx] = !kpFavoritedMap[idx];
        syncFavoriteUI(idx);
        showKpToast(kpFavoritedMap[idx] ? "已加入好题本" : "已移除好题本", idx);
        return;
      }
      if (action === "preview-image") {
        openKpImagePreview(
          actionEl.getAttribute("data-preview-src"),
          actionEl.getAttribute("data-preview-alt")
        );
      }
    });
  }

  // 精讲页 Tab
  document.querySelectorAll(".lecture-tabs").forEach(function (tabBar) {
    tabBar.querySelectorAll(".lecture-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        const scope = tabBar.getAttribute("data-scope");
        tabBar.querySelectorAll(".lecture-tab").forEach(function (t) {
          t.classList.remove("active");
        });
        tab.classList.add("active");
        document.querySelectorAll('[data-panel-scope="' + scope + '"]').forEach(function (panel) {
          panel.classList.toggle("active", panel.id === tab.dataset.panel);
        });
      });
    });
  });

  renderKpCard();
  showView(location.hash || "home");

  // Keep tablet frame visually 1024×768; scale down only when PC viewport is smaller
  const frame = document.getElementById("device-frame");
  function fitTablet() {
    if (!frame) return;
    const padX = 40;
    const padY = 56;
    const scale = Math.min(
      1,
      (window.innerWidth - padX) / 1024,
      (window.innerHeight - padY) / 768
    );
    frame.style.transform = "scale(" + scale + ")";
  }
  fitTablet();
  window.addEventListener("resize", fitTablet);

  // Filter drawer
  const filterDrawer = document.getElementById("filter-drawer");
  const filterSelect = document.getElementById("filter-select");
  const filterTriggerText = document.getElementById("filter-trigger-text");
  const filterOptions = document.getElementById("filter-options");
  const filterTrigger = document.getElementById("filter-trigger");
  const filterConfirm = document.getElementById("filter-confirm");
  const FILTER_LABELS = {
    todo: "待学习",
    learning: "学习中",
    learned: "已学习",
    practiced: "已练习",
    unpracticed: "待练习",
  };
  const COURSE_FILTERS = { todo: true, learning: true, learned: true };
  let pendingFilter = "todo";
  let appliedFilter = null;

  function openFilter(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!filterDrawer) return;
    pendingFilter = appliedFilter || "todo";
    syncFilterUI(pendingFilter);
    if (filterSelect) filterSelect.classList.remove("open");
    filterDrawer.hidden = false;
    filterDrawer.classList.add("show");
  }

  function closeFilter(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!filterDrawer) return;
    filterDrawer.classList.remove("show");
    filterDrawer.hidden = true;
    if (filterSelect) filterSelect.classList.remove("open");
  }

  function syncFilterUI(value) {
    if (filterTriggerText) {
      filterTriggerText.textContent = FILTER_LABELS[value] || "待学习";
    }
    if (!filterOptions) return;
    filterOptions.querySelectorAll(".filter-option").forEach((opt) => {
      opt.classList.toggle("active", opt.dataset.value === value);
    });
  }

  function matchCourseStatus(statusEl, value) {
    if (!statusEl) return true;
    if (value === "todo") return statusEl.classList.contains("todo");
    if (value === "learning") return statusEl.classList.contains("doing");
    if (value === "learned") return statusEl.classList.contains("done");
    return true;
  }

  function applyFilter(value) {
    appliedFilter = value;
    const isCourseFilter = !!COURSE_FILTERS[value];
    const isPaperFilter = value === "practiced" || value === "unpracticed";

    document.querySelectorAll(".resource-card").forEach((card) => {
      const statusEl = card.querySelector(".status");
      let match = true;
      if (isCourseFilter) {
        match = matchCourseStatus(statusEl, value);
      } else if (isPaperFilter) {
        match = true;
      }
      card.classList.toggle("is-filtered-out", !match);
    });

    document.querySelectorAll(".paper-item").forEach((item) => {
      let match = true;
      if (isPaperFilter) {
        const practiced = item.classList.contains("is-done");
        const unpracticed = item.classList.contains("is-todo");
        match = value === "practiced" ? practiced : unpracticed;
      } else if (isCourseFilter) {
        match = true;
      }
      item.classList.toggle("is-filtered-out", !match);
    });

    document.querySelectorAll(".exam-card").forEach((card) => {
      let match = true;
      if (isPaperFilter) {
        const practiced = card.dataset.examStatus === "done";
        const unpracticed = card.dataset.examStatus !== "done";
        match = value === "practiced" ? practiced : unpracticed;
      } else if (isCourseFilter) {
        match = true;
      }
      card.classList.toggle("is-filtered-out", !match);
    });
  }

  // 事件委托，避免按钮内 SVG 点击失效
  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open-filter]");
    if (openBtn) {
      openFilter(e);
      return;
    }

    const closeBtn = e.target.closest("[data-close-filter]");
    if (closeBtn) {
      closeFilter(e);
      return;
    }

    if (e.target === filterDrawer) {
      closeFilter(e);
    }
  });

  if (filterTrigger) {
    filterTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (filterSelect) filterSelect.classList.toggle("open");
    });
  }

  if (filterOptions) {
    filterOptions.querySelectorAll(".filter-option").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        pendingFilter = opt.dataset.value;
        syncFilterUI(pendingFilter);
        if (filterSelect) filterSelect.classList.remove("open");
      });
    });
  }

  if (filterConfirm) {
    filterConfirm.addEventListener("click", (e) => {
      e.stopPropagation();
      applyFilter(pendingFilter);
      closeFilter();
    });
  }

  // Skill4：供右侧 PRD 面板 activate 调用的显式控制器
  window.PrdPrototypeBridge = {
    openFilter: openFilter,
    closeFilter: closeFilter,
    switchChapterType: function (key) {
      if (typeof switchChapterType === "function") switchChapterType(key);
    },
    setKpPage: function (page) {
      if (typeof setKpPage === "function") setKpPage(page);
    },
    setLectureTab: function (panelId) {
      var tab = document.querySelector('.lecture-tab[data-panel="' + panelId + '"]');
      if (tab) tab.click();
    },
    setTab: function (tab) {
      if (tab === "lecture-text" || tab === "lecture-video") {
        window.PrdPrototypeBridge.setLectureTab(tab);
        return;
      }
      if (typeof switchChapterType === "function") switchChapterType(tab);
    },
  };
})();
