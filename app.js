(function () {
  "use strict";

  var menuButton = document.getElementById("menuButton");
  var primaryNav = document.getElementById("primaryNav");
  var progressBar = document.getElementById("progressBar");
  var year = document.getElementById("year");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".primary-nav a"));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function closeMenu() {
    if (!menuButton || !primaryNav) return;
    menuButton.setAttribute("aria-expanded", "false");
    primaryNav.removeAttribute("data-open");
  }

  if (menuButton && primaryNav) {
    menuButton.addEventListener("click", function () {
      var willOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(willOpen));
      if (willOpen) {
        primaryNav.setAttribute("data-open", "true");
      } else {
        primaryNav.removeAttribute("data-open");
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  var scrollTicking = false;
  function updateScrollState() {
    scrollTicking = false;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;

    if (progressBar) {
      progressBar.style.width = (progress * 100).toFixed(2) + "%";
    }

    var activeId = "";
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.38) {
        activeId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === "#" + activeId) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function requestScrollUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollState);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  updateScrollState();

  var CONTENT_KEY = "8ac71b45de92764dc2176bc939";
  var GHOST_ROOT = "https://blog.eschocolat.dev/ghost/api/content";

  function fetchJSON(url, timeout) {
    if (!window.fetch) return Promise.reject(new Error("fetch unavailable"));

    var controller = "AbortController" in window ? new AbortController() : null;
    var timer = controller
      ? window.setTimeout(function () { controller.abort(); }, timeout)
      : null;

    return fetch(url, {
      headers: { "Accept-Version": "v6.0" },
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    }).finally(function () {
      if (timer) window.clearTimeout(timer);
    });
  }

  function formatDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date).replace(/\s/g, "");
  }

  function loadPosts() {
    var postList = document.getElementById("postList");
    if (!postList) return;

    var endpoint = GHOST_ROOT + "/posts/?key=" + CONTENT_KEY
      + "&limit=4&fields=title,url,published_at&order=published_at%20desc";

    fetchJSON(endpoint, 5500).then(function (data) {
      var posts = (data.posts || []).filter(function (post) {
        return post && post.title && post.url;
      }).slice(0, 4);

      if (!posts.length) return;

      var fragment = document.createDocumentFragment();
      posts.forEach(function (post, index) {
        var link = document.createElement("a");
        var number = document.createElement("span");
        var title = document.createElement("span");
        var meta = document.createElement("span");
        var arrow = document.createElement("span");

        link.className = "post-row";
        link.href = post.url;
        link.target = "_blank";
        link.rel = "noreferrer";

        number.className = "post-no";
        number.textContent = String(index + 1).padStart(2, "0");

        title.className = "post-title";
        title.textContent = post.title;

        meta.className = "post-meta";
        meta.textContent = formatDate(post.published_at) || "ESLOG";

        arrow.className = "post-go";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";

        link.appendChild(number);
        link.appendChild(title);
        link.appendChild(meta);
        link.appendChild(arrow);
        fragment.appendChild(link);
      });

      postList.replaceChildren(fragment);
      postList.setAttribute("data-content-state", "live");
    }).catch(function () {
      postList.setAttribute("data-content-state", "fallback");
    });
  }

  function loadNow() {
    var excerpt = document.getElementById("nowExcerpt");
    var dateLabel = document.getElementById("nowDate");
    if (!excerpt || !dateLabel || !window.DOMParser) return;

    var endpoint = GHOST_ROOT + "/pages/slug/now/?key=" + CONTENT_KEY
      + "&fields=html,updated_at";

    fetchJSON(endpoint, 5500).then(function (data) {
      var page = (data.pages || [])[0];
      if (!page || !page.html) return;

      var doc = new DOMParser().parseFromString(page.html, "text/html");
      doc.querySelectorAll("br").forEach(function (breakElement) {
        breakElement.replaceWith(" ");
      });
      var paragraphs = Array.prototype.slice.call(doc.querySelectorAll("p"));
      var dateLine = "";
      var body = [];

      paragraphs.forEach(function (paragraph) {
        var text = paragraph.textContent.replace(/\s+/g, " ").trim();
        if (!text) return;
        if (!dateLine && /남긴\s*날/.test(text)) {
          dateLine = text.replace(/남긴\s*날\s*[:：]\s*/, "");
          return;
        }
        if (body.join(" ").length < 230) body.push(text);
      });

      var combined = body.join(" ");
      if (combined) {
        excerpt.textContent = combined.length > 250
          ? combined.slice(0, 250).trim() + "…"
          : combined;
      }

      var resolvedDate = dateLine || formatDate(page.updated_at);
      if (resolvedDate) {
        dateLabel.textContent = "LAST UPDATED — " + resolvedDate;
      }
    }).catch(function () {
      // Static copy is intentionally complete when the live source is unavailable.
    });
  }

  loadPosts();
  loadNow();
}());
