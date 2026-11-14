/* Global rule: once the reader scrolls past the hero, the top nav slides away;
   it comes back when they scroll back up into the hero. */
(function () {
  var hidden = false;
  function tick() {
    var header = document.querySelector("header");
    var hero = document.querySelector("main section");
    if (!header || !hero) return;
    header.style.transition = "transform .45s cubic-bezier(.16,1,.3,1), opacity .35s ease";
    var past = hero.getBoundingClientRect().bottom < 80;
    if (past === hidden) return;
    hidden = past;
    header.style.transform = past ? "translateY(-110%)" : "none";
    header.style.opacity = past ? "0" : "1";
    header.style.pointerEvents = past ? "none" : "";
  }
  addEventListener("scroll", tick, { passive: true });
  addEventListener("resize", tick);
  addEventListener("load", tick);
  document.addEventListener("DOMContentLoaded", tick);
})();

/* Open every case study at its start. Without this, some browsers and embedded
   viewers keep or restore the previous scroll position, which can land the
   reader at the end of the page. A link to a #section still goes there. */
(function () {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  var touched = false;
  ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (e) {
    addEventListener(e, function () { touched = true; }, { passive: true, once: true });
  });
  function toTop() {
    if (touched) return;
    if (location.hash && document.getElementById(location.hash.slice(1))) return;
    window.scrollTo(0, 0);
  }
  toTop();
  document.addEventListener("DOMContentLoaded", toTop);
  addEventListener("pageshow", toTop);
  addEventListener("load", function () { toTop(); setTimeout(toTop, 60); });
})();
