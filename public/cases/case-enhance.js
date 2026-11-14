/* Reading aids shared by every case-study page. They add navigation and zoom
   around the existing write-up and never change its text or images.
   1. "On this page": a floating button that lists the section headings and
      jumps to them, with the current section marked.
   2. Click (or Enter) on a screenshot to see it full size. */
(function () {
  var css =
    ".ce-toc-btn{position:fixed;left:var(--gutter,20px);bottom:20px;z-index:110;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 16px;border:2px solid var(--ink);border-radius:999px;background:var(--paper);color:var(--ink);box-shadow:0 4px 0 var(--ink);font:700 12px/1 var(--font-mono,ui-monospace,monospace);text-transform:uppercase;letter-spacing:.12em;cursor:pointer;transition:transform .3s,opacity .3s}" +
    ".ce-toc-btn[hidden]{display:none}" +
    ".ce-toc-btn:hover{transform:translateY(-2px)}" +
    ".ce-toc{position:fixed;left:var(--gutter,20px);bottom:76px;z-index:111;width:min(340px,calc(100vw - 2*var(--gutter,20px)));max-height:min(70vh,560px);overflow:auto;background:var(--paper);color:var(--ink);border:3px solid var(--ink);border-radius:16px;box-shadow:0 6px 0 var(--ink);padding:14px 8px 10px}" +
    ".ce-toc[hidden]{display:none}" +
    ".ce-toc p{margin:0 10px 8px;font:700 11px/1.2 var(--font-mono,ui-monospace,monospace);text-transform:uppercase;letter-spacing:.14em;opacity:.7}" +
    ".ce-toc ol{list-style:none;margin:0;padding:0}" +
    ".ce-toc a{display:grid;grid-template-columns:28px 1fr;gap:6px;align-items:baseline;padding:8px 10px;border-radius:10px;font-size:15px;line-height:1.3;color:inherit;text-decoration:none}" +
    ".ce-toc a span{font:500 12px/1 var(--font-mono,ui-monospace,monospace);opacity:.6}" +
    ".ce-toc a:hover,.ce-toc a:focus-visible{background:var(--lime);outline:none}" +
    ".ce-toc a[aria-current=true]{background:var(--ink);color:var(--paper)}" +
    ".ce-zoomable{cursor:zoom-in}" +
    ".ce-zoomable:focus-visible{outline:3px solid var(--tomato);outline-offset:3px}" +
    ".ce-lb{position:fixed;inset:0;margin:auto;width:fit-content;height:fit-content;max-width:96vw;max-height:94vh;padding:0;border:3px solid var(--ink);border-radius:16px;background:var(--paper);box-shadow:0 8px 0 var(--ink);overflow:auto}" +
    ".ce-lb::backdrop{background:rgb(18 17 16 / .82)}" +
    ".ce-lb img{display:block;width:auto;height:auto;max-width:calc(96vw - 6px);cursor:zoom-out}" +
    ".ce-lb .ce-bar{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 10px 8px 16px;background:var(--paper);border-bottom:2px solid var(--ink)}" +
    ".ce-lb .ce-bar span{font-size:14px;line-height:1.4;max-width:70ch}" +
    ".ce-lb button{flex:none;width:40px;height:40px;border-radius:999px;border:2px solid var(--ink);background:var(--lime);color:var(--ink);font-size:20px;line-height:1;cursor:pointer}" +
    ".ce-lb button:focus-visible,.ce-toc-btn:focus-visible{outline:3px solid var(--tomato);outline-offset:2px}" +
        "@media print{.ce-toc-btn,.ce-toc{display:none!important}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var main = document.querySelector("main");
    if (!main) return;

    /* 1. Section index */
    var secs = [].slice.call(main.querySelectorAll(":scope > section")).filter(function (s, i) {
      return i > 0 && !s.classList.contains("arc-top") && s.querySelector("h2");
    });
    if (secs.length >= 3) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ce-toc-btn";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "ce-toc");
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>On this page';
      var panel = document.createElement("nav");
      panel.id = "ce-toc";
      panel.className = "ce-toc";
      panel.hidden = true;
      panel.setAttribute("aria-label", "Sections in this case study");
      var list = document.createElement("ol");
      var links = secs.map(function (s, i) {
        var h = s.querySelector("h2");
        if (!s.id) s.id = "section-" + (i + 1);
        s.style.scrollMarginTop = "24px";
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + s.id;
        a.innerHTML = "<span>" + String(i + 1).padStart(2, "0") + "</span>";
        a.appendChild(document.createTextNode(h.textContent.trim()));
        a.addEventListener("click", function (e) {
          e.preventDefault();
          close();
          s.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
          history.replaceState(null, "", "#" + s.id);
          h.setAttribute("tabindex", "-1");
          h.focus({ preventScroll: true });
        });
        li.appendChild(a);
        list.appendChild(li);
        return a;
      });
      var label = document.createElement("p");
      label.textContent = "On this page";
      panel.appendChild(label);
      panel.appendChild(list);
      document.body.appendChild(panel);
      document.body.appendChild(btn);

      function open() {
        panel.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        var cur = panel.querySelector("[aria-current=true]") || links[0];
        cur.focus();
      }
      function close() {
        panel.hidden = true;
        btn.setAttribute("aria-expanded", "false");
      }
      btn.addEventListener("click", function () {
        panel.hidden ? open() : close();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !panel.hidden) {
          close();
          btn.focus();
        }
      });
      document.addEventListener("click", function (e) {
        if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) close();
      });

      /* Show the button once the reader is past the intro, and mark the current section. */
      var first = secs[0];
      function onScroll() {
        btn.hidden = first.getBoundingClientRect().top > innerHeight * 0.6;
        if (btn.hidden) close();
        var idx = 0;
        secs.forEach(function (s, i) {
          if (s.getBoundingClientRect().top < innerHeight * 0.35) idx = i;
        });
        links.forEach(function (a, i) {
          a.setAttribute("aria-current", i === idx ? "true" : "false");
        });
      }
      addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    /* 2. Click a screenshot to see it full size */
    if (!window.HTMLDialogElement) return;
    var dlg = document.createElement("dialog");
    dlg.className = "ce-lb";
    dlg.setAttribute("aria-label", "Enlarged image");
    dlg.innerHTML = '<div class="ce-bar"><span></span><button type="button" aria-label="Close enlarged image">&times;</button></div><img alt="">';
    document.body.appendChild(dlg);
    var big = dlg.querySelector("img");
    var cap = dlg.querySelector(".ce-bar span");
    dlg.querySelector("button").addEventListener("click", function () { dlg.close(); });
    big.addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    var opener = null;
    dlg.addEventListener("close", function () { if (opener) opener.focus(); });

    function zoom(img) {
      opener = img;
      big.src = img.currentSrc || img.src;
      /* On phones show the image larger than the screen so details can be read; the dialog scrolls. */
      var phone = innerWidth < 700;
      big.style.maxWidth = phone ? "none" : "";
      big.style.width = phone ? Math.min(img.naturalWidth, innerWidth * 2) + "px" : "";
      big.alt = img.alt || "";
      var fc = img.closest("figure") && img.closest("figure").querySelector("figcaption");
      var nextP = !fc && img.closest("figure") && img.closest("figure").nextElementSibling;
      cap.textContent = fc ? fc.textContent.trim() : nextP && nextP.matches("p.small") ? nextP.textContent.trim() : img.alt || "";
      dlg.showModal();
    }
    [].slice.call(main.querySelectorAll("figure img")).forEach(function (img) {
      if (img.closest("a")) return;
      function arm() {
        var r = img.getBoundingClientRect();
        if (!img.naturalWidth || r.width === 0 || img.naturalWidth < r.width * 1.15) return;
        if (img.classList.contains("ce-zoomable")) return;
        img.classList.add("ce-zoomable");
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", "Enlarge image" + (img.alt ? ": " + img.alt : ""));
        img.addEventListener("click", function () { zoom(img); });
        img.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); zoom(img); }
        });
      }
      if (img.complete) arm();
      else img.addEventListener("load", arm, { once: true });
    });
  });
})();
