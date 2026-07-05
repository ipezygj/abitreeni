/* Aihe: Kemiallinen tasapaino (kemia).
   Tasapainovakio Kc = tuotteiden pitoisuudet (kertoimien potensseissa) / lähtöaineiden.
   Interaktiivinen reaktio-osamäärä Q vs Kc (Le Chatelier: kumpaan suuntaan reaktio siirtyy),
   ja arvotut Kc:n laskutehtävät useasta reaktiosta. */
(function () {
  window.TOPICS = window.TOPICS || {};

  // Reaktiot: laji s, kerroin c, puoli "p"=tuote / "r"=lähtöaine.
  var REAKTIOT = [
    { nimi: "H_2 + I_2 \\rightleftharpoons 2\\,HI",
      lajit: [{ s: "HI", c: 2, side: "p" }, { s: "H_2", c: 1, side: "r" }, { s: "I_2", c: 1, side: "r" }] },
    { nimi: "N_2 + 3\\,H_2 \\rightleftharpoons 2\\,NH_3",
      lajit: [{ s: "NH_3", c: 2, side: "p" }, { s: "N_2", c: 1, side: "r" }, { s: "H_2", c: 3, side: "r" }] },
    { nimi: "2\\,SO_2 + O_2 \\rightleftharpoons 2\\,SO_3",
      lajit: [{ s: "SO_3", c: 2, side: "p" }, { s: "SO_2", c: 2, side: "r" }, { s: "O_2", c: 1, side: "r" }] },
    { nimi: "PCl_5 \\rightleftharpoons PCl_3 + Cl_2",
      lajit: [{ s: "PCl_3", c: 1, side: "p" }, { s: "Cl_2", c: 1, side: "p" }, { s: "PCl_5", c: 1, side: "r" }] }
  ];

  // Kc (tai Q) annetuista pitoisuuksista conc[laji].
  function quotient(reaktio, conc) {
    var num = 1, den = 1;
    reaktio.lajit.forEach(function (x) {
      var v = Math.pow(conc[x.s], x.c);
      if (x.side === "p") num *= v; else den *= v;
    });
    return num / den;
  }
  function kcKaava(reaktio) {
    var p = reaktio.lajit.filter(function (x) { return x.side === "p"; });
    var r = reaktio.lajit.filter(function (x) { return x.side === "r"; });
    function term(a) { return a.map(function (x) { return "[\\mathrm{" + x.s + "}]" + (x.c > 1 ? "^{" + x.c + "}" : ""); }).join(""); }
    return "K_c = \\dfrac{" + term(p) + "}{" + term(r) + "}";
  }

  window.TOPICS["kemiallinen-tasapaino"] = {
    id: "kemiallinen-tasapaino",
    title: "Kemiallinen tasapaino (Kc)",
    category: "kemia",
    blurb: "Tasapainovakio ja reaktio-osamäärä Q — kumpaan suuntaan reaktio siirtyy (Le Chatelier).",

    render: function (el) {
      var Kc = 50; // H₂ + I₂ ⇌ 2 HI, esim.-arvo
      el.innerHTML =
        '<div class="card">' +
        "<p>Tasapainovakio kertoo tuotteiden ja lähtöaineiden pitoisuuksien suhteen tasapainossa (kertoimet potensseina). Reaktiolle " +
        tex("H_2 + I_2 \\rightleftharpoons 2\\,HI") + ":</p>" +
        "<p style='text-align:center'>" + tex("K_c = \\dfrac{[\\mathrm{HI}]^2}{[\\mathrm{H_2}][\\mathrm{I_2}]} = 50", true) + "</p>" +
        "<p>Reaktio-osamäärä " + tex("Q") + " lasketaan samoin nykyisistä pitoisuuksista. Vertaa: " +
        tex("Q<K_c") + " → siirtyy oikealle (tuotetta lisää), " + tex("Q>K_c") + " → vasemmalle.</p>" +
        '<div class="controls">' +
        ctl("h2", "[H₂] (mol/l)", 0.1, 2, 0.1, 1) +
        ctl("i2", "[I₂] (mol/l)", 0.1, 2, 0.1, 1) +
        ctl("hi", "[HI] (mol/l)", 0.1, 10, 0.1, 5) +
        "</div>" +
        '<div id="qplot" class="plot"></div>' +
        '<div class="readout" id="qread"></div>' +
        "</div>";

      var H2 = el.querySelector("#h2"), I2 = el.querySelector("#i2"), HI = el.querySelector("#hi");
      var plotEl = el.querySelector("#qplot"), read = el.querySelector("#qread");
      function draw() {
        var h2 = +H2.value, i2 = +I2.value, hi = +HI.value;
        el.querySelector("#h2_out").value = h2.toFixed(1);
        el.querySelector("#i2_out").value = i2.toFixed(1);
        el.querySelector("#hi_out").value = hi.toFixed(1);
        var Q = hi * hi / (h2 * i2);
        plot(plotEl,
          [{ x: ["Q (nyt)", "Kc (tasapaino)"], y: [Q, Kc], type: "bar",
             marker: { color: [Q < Kc ? "#17998a" : "#d64545", "#a23bd6"] } }],
          { xlabel: "", ylabel: "arvo", legend: false });
        var suunta = Math.abs(Q - Kc) / Kc < 0.05 ? "≈ tasapainossa" :
          (Q < Kc ? "siirtyy OIKEALLE → (muodostuu HI)" : "siirtyy VASEMMALLE ← (hajoaa HI)");
        read.innerHTML =
          ro("Q nyt", Q.toFixed(1)) + ro("Kc", Kc.toFixed(0)) + ro("suunta", "<b>" + suunta + "</b>");
      }
      [H2, I2, HI].forEach(function (s) { s.addEventListener("input", draw); });
      draw();
    },

    makeExercise: function () {
      var r = pick(REAKTIOT);
      var conc = {}, parts = [];
      r.lajit.forEach(function (x) {
        var c = pick([0.1, 0.2, 0.25, 0.4, 0.5, 1.0, 2.0]);
        conc[x.s] = c;
        parts.push(tex("[\\mathrm{" + x.s + "}] = " + c + "\\text{ mol/l}"));
      });
      var Kc = quotient(r, conc);
      return {
        promptHTML:
          "Reaktio: " + tex(r.nimi) + "<br>Tasapainopitoisuudet: " + parts.join(", ") +
          ".<br>Laske tasapainovakio " + tex("K_c") + " (2 merkitsevää numeroa).",
        placeholder: "Kc = ?",
        hintHTML: tex(kcKaava(r)) + ".  Muista kertoimet potensseina.",
        answerHTML: tex(kcKaava(r) + " \\approx " + fmt(Kc)),
        check: function (input) { return numClose(parseNum(input), Kc, 0.03); }
      };
    }
  };

  function fmt(x) {
    if (x >= 100 || x < 0.01) return x.toPrecision(2);
    return (Math.round(x * 100) / 100).toString();
  }
  function ctl(id, label, min, max, step, val) {
    return '<div class="control"><label>' + label +
      ': <output id="' + id + '_out">' + val + "</output></label>" +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
  }
  function ro(k, v) { return '<div><span class="k">' + k + ':</span> <span class="v">' + v + "</span></div>"; }
})();
