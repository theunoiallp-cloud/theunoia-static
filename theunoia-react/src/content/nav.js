/* THEUNOiA site header: opens and closes the menu on phones */
(function () {
  document.querySelectorAll("[data-tn]").forEach(function (bar) {
    var btn = bar.querySelector(".tn-burger");
    if (!btn) return;
    function set(open) {
      bar.classList.toggle("tn-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    btn.addEventListener("click", function (e) { e.stopPropagation(); set(!bar.classList.contains("tn-open")); });
    bar.querySelectorAll(".tn-links a").forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("click", function (e) { if (!bar.contains(e.target)) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && bar.classList.contains("tn-open")) { set(false); btn.focus(); } });
  });
})();
