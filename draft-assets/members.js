/* Members page: join form (posts to the form's action; endpoint TBC) and
   signature copy buttons. */
(function () {
  var form = document.getElementById("cp-join-form");
  if (form) {
    var formStatus = form.querySelector(".cp-form__status");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = form.querySelector("button[type=submit]");
      button.disabled = true;
      formStatus.textContent = "Sending…";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (response) {
          if (!response.ok) throw new Error(response.status);
          form.reset();
          formStatus.textContent = "Thanks. We'll be in touch to confirm your membership.";
        })
        .catch(function () {
          formStatus.textContent = "Sorry, that didn't send. Please email hello@copter.community instead.";
        })
        .finally(function () { button.disabled = false; });
    });
  }

  var signature = document.getElementById("cp-signature");
  var status = document.querySelector(".cp-signature__status");
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var html = signature.innerHTML.trim();
      var text = signature.textContent.trim() + " https://copter.community";
      var done = function () { status.textContent = "Copied"; setTimeout(function () { status.textContent = ""; }, 2000); };
      var copy = button.dataset.copy === "html" ? html : text;
      navigator.clipboard.writeText(copy).then(done, function () { status.textContent = "Copy failed; select the text instead"; });
    });
  });
})();
