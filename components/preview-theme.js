/* ----------------------------------------------------------------------------
   preview-theme.js — light/dark toggle + localStorage persistence.
   Shared by every component preview and every prototype. No deps, no build.

   API:
     window.UnifyTheme.get()        -> "light" | "dark"
     window.UnifyTheme.set(theme)   -> apply + persist
     window.UnifyTheme.destroy()    -> remove every listener this installed

   Listeners are bound through an AbortController signal, so destroy() is a
   single abort() and cannot drift out of sync with the bindings.
---------------------------------------------------------------------------- */
(function () {
  "use strict";

  var KEY = "unify-theme";
  var root = document.documentElement;
  var controller = new AbortController();

  function get() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function set(theme) {
    root.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    try { localStorage.setItem(KEY, theme); } catch (e) { /* private mode */ }
  }

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (btn) set(get() === "dark" ? "light" : "dark");
  }, { signal: controller.signal });

  window.UnifyTheme = {
    get: get,
    set: set,
    destroy: function () { controller.abort(); }
  };
})();
