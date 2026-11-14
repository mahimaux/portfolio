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
