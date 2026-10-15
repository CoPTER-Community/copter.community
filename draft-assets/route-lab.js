/* Route lab (drafts/terrain.md): pick any place and route and watch it fly.
   The planners and animation live in assets/javascripts/hero-routes.js,
   shared with the home page hero; this file is just the lab's controls. */
(function () {
  "use strict";
  var root = document.getElementById("cp-route-lab");
  if (!root || !window.CopterRoutes) return;
  var R = window.CopterRoutes, ALGOS = R.ALGOS, BASE = "../assets/terrain/";
  var engine = new R.Engine(root.querySelector("svg"));
  var placeSel = root.querySelector('[data-lab="place"]');
  var algoSel = root.querySelector('[data-lab="algo"]');
  var status = root.querySelector(".cp-route-lab__status");
  var explain = root.querySelector(".cp-route-lab__explain");
  var places = [], timer = null;

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  function start() {
    clearTimeout(timer); engine.stop();
    var slug = placeSel.value === "random" ? pick(places).slug : placeSel.value;
    var algo = algoSel.value === "random" ? pick(Object.keys(ALGOS)) : algoSel.value;
    var name = places.filter(function (p) { return p.slug === slug; })[0].name;
    status.textContent = "Planning…";
    R.load(BASE, slug).then(function (data) {
      var result = engine.play(data, algo, 0, function () { timer = setTimeout(start, 3500); }); // loop with a fresh plan
      status.textContent = name + " · " + ALGOS[algo].label + " · planned in " + result.ms.toFixed(0) + " ms";
      explain.textContent = ALGOS[algo].text + (result.plan.note ? " " + result.plan.note : "");
    });
  }

  fetch("../draft-assets/terrain/places.json").then(function (r) { return r.json(); }).then(function (list) {
    places = list;
    placeSel.append(new Option("Random", "random"));
    list.forEach(function (p) { placeSel.append(new Option(p.name, p.slug)); });
    algoSel.append(new Option("Random", "random"));
    Object.keys(ALGOS).forEach(function (k) { algoSel.append(new Option(ALGOS[k].label, k)); });
    var q = new URLSearchParams(location.search); // e.g. ?place=kinder&algo=rrt
    if (q.get("place")) placeSel.value = q.get("place");
    if (q.get("algo")) algoSel.value = q.get("algo");
    placeSel.addEventListener("change", start);
    algoSel.addEventListener("change", start);
    root.querySelector('[data-lab="replay"]').addEventListener("click", start);
    start();
  });
})();
