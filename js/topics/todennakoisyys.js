/* Aihe: Todennäköisyys (matematiikka).
   Binomijakauma: P(X=k) = C(n,k) p^k (1−p)^(n−k). Interaktiivinen jakauman pylväskuvaaja (säädä n, p),
   odotusarvo np ja keskihajonta. Arvotut binomi- ja kombinatoriikkatehtävät. */
(function () {
  window.TOPICS = window.TOPICS || {};

  // Binomikerroin C(n,k) kertolaskuna (välttää suuret kertomat).
  function nCk(n, k) {
    if (k < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    var r = 1;
    for (var i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }
  function binomPmf(n, k, p) { return nCk(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k); }

  window.TOPICS["todennakoisyys"] = {
    id: "todennakoisyys",
    title: "Todennäköisyys (binomijakauma)",
    category: "matematiikka",
    blurb: "Binomijakauma P(X=k), odotusarvo ja keskihajonta — säädä toistoja ja onnistumistodennäköisyyttä.",

    render: function (el) {
      el.innerHTML =
        '<div class="card">' +
        "<p>Kun koe toistetaan " + tex("n") + " kertaa ja onnistuminen kerralla on " + tex("p") +
        ", onnistumisten lukumäärä " + tex("X") + " noudattaa binomijakaumaa:</p>" +
        "<p style='text-align:center'>" + tex("P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}", true) + "</p>" +
        "<p>Odotusarvo " + tex("E(X)=np") + ", keskihajonta " + tex("\\sigma=\\sqrt{np(1-p)}") + ".</p>" +
        '<div class="controls">' +
        ctl("n", "Toistot n", 1, 20, 1, 10) +
        ctl("p", "Onnistumis-p", 0.05, 0.95, 0.05, 0.5) +
        "</div>" +
        '<div id="bplot" class="plot"></div>' +
        '<div class="readout" id="bread"></div>' +
        "</div>";

      var N = el.querySelector("#n"), P = el.querySelector("#p");
      var plotEl = el.querySelector("#bplot"), read = el.querySelector("#bread");
      function draw() {
        var n = +N.value, p = +P.value;
        el.querySelector("#n_out").value = n;
        el.querySelector("#p_out").value = p.toFixed(2);
        var ks = [], ps = [];
        for (var k = 0; k <= n; k++) { ks.push(k); ps.push(binomPmf(n, k, p)); }
        plot(plotEl, [{ x: ks, y: ps, type: "bar", name: "P(X=k)", marker: { color: "#2f6df6" } }],
          { xlabel: "onnistumisten määrä k", ylabel: "P(X=k)", legend: false });
        read.innerHTML =
          ro("odotusarvo np", (n * p).toFixed(2)) +
          ro("keskihajonta σ", Math.sqrt(n * p * (1 - p)).toFixed(2)) +
          ro("todennäköisin k", ks[ps.indexOf(Math.max.apply(null, ps))]);
      }
      [N, P].forEach(function (s) { s.addEventListener("input", draw); });
      draw();
    },

    makeExercise: function () {
      if (Math.random() < 0.6) {
        // Binomi: P(X=k)
        var n = randInt(4, 8);
        var p = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
        var k = randInt(1, n - 1);
        var val = binomPmf(n, k, p);
        return {
          promptHTML: "Koe toistetaan " + tex("n=" + n) + " kertaa, onnistumistodennäköisyys " + tex("p=" + p) +
            ".<br>Laske " + tex("P(X=" + k + ")") + " (3 desimaalia).",
          placeholder: "P = ?",
          hintHTML: tex("P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}") + ", missä " + tex("\\binom{" + n + "}{" + k + "}=" + nCk(n, k)),
          answerHTML: tex("\\binom{" + n + "}{" + k + "}\\cdot" + p + "^{" + k + "}\\cdot" + (1 - p).toFixed(2) + "^{" + (n - k) + "} \\approx " + val.toFixed(3)),
          check: function (i) { return numClose(parseNum(i), val, 0.02); }
        };
      } else {
        // Kombinatoriikka: kuinka monta k:n osajoukkoa
        var n2 = randInt(5, 10), k2 = randInt(2, n2 - 2);
        var c = nCk(n2, k2);
        return {
          promptHTML: "Kuinka monella tavalla " + tex(n2 + "") + " eri alkiosta voidaan valita " + tex(k2 + "") +
            " (järjestyksellä ei väliä)?",
          placeholder: "lukumäärä",
          hintHTML: "Kombinaatio: " + tex("\\binom{n}{k}=\\dfrac{n!}{k!(n-k)!}"),
          answerHTML: tex("\\binom{" + n2 + "}{" + k2 + "} = " + c),
          check: function (i) { return numClose(parseNum(i), c, 1e-9); }
        };
      }
    }
  };

  function ctl(id, label, min, max, step, val) {
    return '<div class="control"><label>' + label +
      ': <output id="' + id + '_out">' + val + "</output></label>" +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
  }
  function ro(k, v) { return '<div><span class="k">' + k + ':</span> <span class="v">' + v + "</span></div>"; }
})();
