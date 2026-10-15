/* Make the site name in the header link home, like the logo. Uses the theme's
   own logo link, so if the header markup ever changes this simply does nothing. */
(function () {
  var logo = document.querySelector(".md-header a.md-logo");
  var name = document.querySelector(".md-header__title .md-header__topic:first-child .md-ellipsis");
  if (!logo || !name || name.querySelector("a")) return;
  var link = document.createElement("a");
  link.href = logo.getAttribute("href");
  link.className = "cp-header__home";
  link.textContent = name.textContent.trim();
  name.replaceChildren(link);
})();
