/* Aihe (SILTA): Radioaktiivinen hajoaminen = eksponenttifunktio + logaritmi + derivaatta.
   N(t) = N0·(1/2)^(t/t½) = N0·e^(−λt), missä λ = ln2 / t½.
   - Jäljellä olevan osuuden laskeminen = eksponenttifunktio.
   - Ajan ratkaiseminen (milloin jäljellä X %) = LOGARITMI.
   - Hajoamisnopeus (aktiivisuus) A = λN = −dN/dt = DERIVAATTA.
   Kolme YO-aihetta samassa käyrässä. */
(function () {
  window.TOPICS = window.TOPICS || {};

  window.TOPICS["radioaktiivinen-hajoaminen"] = {
    id: "radioaktiivinen-hajoaminen",
    title: "Radioaktiivinen hajoaminen",
    category: "sillat",
    blurb: "Puoliintumisaika, hajoamislaki ja logaritmi — eksponenttifunktio ja derivaatta samassa.",

    render: function (el) {
      el.innerHTML =
        '<div class="card">' +
        "<p>Radioaktiivinen hajoaminen noudattaa eksponenttifunktiota. Kun puoliintumisaika on " +
        tex("t_{1/2}") + ", jäljellä oleva osuus ajan " + tex("t") + " kuluttua on</p>" +
        "<p style='text-align:center'>" +
        tex("\\frac{N(t)}{N_0} = \\left(\\tfrac12\\right)^{t/t_{1/2}} = e^{-\\lambda t}, \\qquad \\lambda = \\frac{\\ln 2}{t_{1/2}}", true) +
        "</p>" +
        "<p>Ajan ratkaiseminen vaatii <b>logaritmin</b>: " + tex("t = t_{1/2}\\,\\dfrac{\\ln(N_0/N)}{\\ln 2}") +
        ". Hajoamisnopeus eli aktiivisuus on <b>derivaatta</b>: " + tex("A = -\\dfrac{dN}{dt} = \\lambda N") + ".</p>" +
        '<div class="controls">' +
        ctl("th", "Puoliintumisaika t½", 1, 40, 1, 8) +
        ctl("t", "Kulunut aika t", 0, 120, 1, 10) +
        "</div>" +
        '<div id="dplot" class="plot"></div>' +
        '<div class="readout" id="dread"></div>' +
        "</div>";

      var TH = el.querySelector("#th"), T = el.querySelector("#t");
      var plotEl = el.querySelector("#dplot"), read = el.querySelector("#dread");

      function draw() {
        var th = +TH.value, t = +T.value;
        el.querySelector("#th_out").value = th.toFixed(0);
        el.querySelector("#t_out").value = t.toFixed(0);
        var lam = Math.log(2) / th;

        var xmax = Math.max(t + 5, th * 5, 20);
        var xs = [], ys = [];
        for (var x = 0; x <= xmax + 1e-9; x += xmax / 300) { xs.push(x); ys.push(100 * Math.exp(-lam * x)); }
        var frac = Math.exp(-lam * t);

        plot(plotEl,
          [{ x: xs, y: ys, mode: "lines", name: "jäljellä (%)", line: { width: 3 } },
           { x: [t], y: [100 * frac], mode: "markers", name: "kohta t", marker: { size: 9, color: "#d64545" } },
           { x: [th], y: [50], mode: "markers", name: "t½ → 50 %", marker: { size: 10, color: "#a23bd6", symbol: "diamond" } }],
          { xlabel: "aika t", ylabel: "jäljellä oleva osuus (%)" });

        read.innerHTML =
          ro("jäljellä", (100 * frac).toFixed(1) + " %") +
          ro("hajoamisvakio λ", lam.toFixed(4) + " /aikayks.") +
          ro("puoliintumisia kulunut", (t / th).toFixed(2) + " kpl") +
          ro("suht. aktiivisuus A/A₀", frac.toFixed(3));
      }
      [TH, T].forEach(function (s) { s.addEventListener("input", draw); });
      draw();
    },

    makeExercise: function () {
      var th = pick([2, 4, 5, 8, 10, 12, 20, 24, 30]);
      if (Math.random() < 0.5) {
        // Variantti A: annettu t½ ja t → jäljellä oleva osuus (%). (eksponenttifunktio)
        var kpl = pick([1, 2, 3, 4]);           // kokonaisia puoliintumisaikoja → siisti vastaus
        var t = kpl * th;
        var frac = Math.pow(0.5, t / th) * 100;
        return {
          promptHTML:
            "Isotoopin puoliintumisaika on " + tex("t_{1/2} = " + th + "\\text{ a}") + ".<br>" +
            "Kuinka monta prosenttia alkuperäisestä on jäljellä ajan " + tex("t = " + t + "\\text{ a}") + " kuluttua? (1 desimaali)",
          placeholder: "jäljellä ? %",
          hintHTML: tex("\\frac{N}{N_0} = \\left(\\tfrac12\\right)^{t/t_{1/2}}") + ", kerro sadalla → prosentti.",
          answerHTML: tex("\\left(\\tfrac12\\right)^{" + t + "/" + th + "} = \\left(\\tfrac12\\right)^{" + (t / th) + "} = " + frac.toFixed(1) + "\\%"),
          check: function (input) { return numClose(parseNum(input), frac, 0.02); }
        };
      } else {
        // Variantti B: annettu t½ ja jäljellä oleva osuus → aika t. (LOGARITMI)
        var osuus = pick([10, 20, 25, 30, 40, 75]); // %
        var tt = th * Math.log(100 / osuus) / Math.log(2);
        return {
          promptHTML:
            "Isotoopin puoliintumisaika on " + tex("t_{1/2} = " + th + "\\text{ a}") + ".<br>" +
            "Kuinka kauan kestää, että jäljellä on enää " + tex(osuus + "\\%") + " alkuperäisestä? (1 desimaali)",
          placeholder: "t = ? a",
          hintHTML: "Ratkaise " + tex("t") + " logaritmilla: " + tex("t = t_{1/2}\\,\\dfrac{\\ln(N_0/N)}{\\ln 2}") + ".",
          answerHTML: tex("t = " + th + "\\cdot\\dfrac{\\ln(100/" + osuus + ")}{\\ln 2} \\approx " + tt.toFixed(1) + "\\text{ a}"),
          check: function (input) { return numClose(parseNum(input), tt, 0.02); }
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
