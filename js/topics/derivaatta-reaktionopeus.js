/* Aihe (SILTA): Derivaatta = reaktionopeus.
   1. kertaluvun reaktio A → tuotteet: [A](t) = A0·e^(−k t). Reaktionopeus = −d[A]/dt = k·[A].
   Käyttäjä säätää aikaa t: tangentin kulmakerroin käyrällä ON reaktionopeus sillä hetkellä.
   Tämä on se kohta jossa matikan derivaatta ja kemian reaktionopeus ovat SAMA asia. */
(function () {
  window.TOPICS = window.TOPICS || {};
  window.TOPICS["derivaatta-reaktionopeus"] = {
    id: "derivaatta-reaktionopeus",
    title: "Derivaatta = reaktionopeus",
    category: "sillat",
    blurb: "1. kertaluvun reaktion pitoisuuskäyrä — tangentin kulmakerroin on hetkellinen reaktionopeus.",

    render: function (el) {
      el.innerHTML =
        '<div class="card">' +
        "<p>1. kertaluvun reaktiossa " + tex("A \\rightarrow \\text{tuotteet}") + " pitoisuus noudattaa " +
        tex("[A](t) = [A]_0\\,e^{-k t}") + ". Reaktionopeus on pitoisuuden muutosnopeus eli derivaatta:</p>" +
        "<p style='text-align:center'>" + tex("v(t) = -\\dfrac{d[A]}{dt} = k\\,[A]_0\\,e^{-kt} = k\\,[A](t)", true) + "</p>" +
        "<p>Raahaa aikaa " + tex("t") + ": punainen tangentti on käyrän kulmakerroin — ja juuri se on hetkellinen reaktionopeus " +
        tex("-v(t)") + ".</p>" +
        '<div class="controls">' +
        ctl("k", "Nopeusvakio k (1/s)", 0.05, 1.0, 0.05, 0.3) +
        ctl("t", "Aika t (s)", 0, 10, 0.1, 2) +
        "</div>" +
        '<div id="rplot" class="plot"></div>' +
        '<div class="readout" id="rread"></div>' +
        "</div>";

      var K = el.querySelector("#k"), T = el.querySelector("#t");
      var plotEl = el.querySelector("#rplot"), read = el.querySelector("#rread");
      var A0 = 1.0; // mol/l

      function draw() {
        var k = +K.value, t = +T.value;
        el.querySelector("#k_out").value = k.toFixed(2);
        el.querySelector("#t_out").value = t.toFixed(1);

        var xs = [], ys = [];
        for (var x = 0; x <= 10.0001; x += 0.1) { xs.push(x); ys.push(A0 * Math.exp(-k * x)); }

        var At = A0 * Math.exp(-k * t);          // [A](t)
        var slope = -k * A0 * Math.exp(-k * t);   // d[A]/dt (negatiivinen)
        var rate = -slope;                        // reaktionopeus (positiivinen)
        // tangenttisuora: y = At + slope·(x − t)
        var tx = [Math.max(0, t - 2.5), Math.min(10, t + 2.5)];
        var ty = tx.map(function (x) { return At + slope * (x - t); });

        plot(plotEl,
          [{ x: xs, y: ys, mode: "lines", name: "[A](t)", line: { width: 3 } },
           { x: tx, y: ty, mode: "lines", name: "tangentti (kulmakerroin = −v)", line: { width: 2, color: "#d64545", dash: "dash" } },
           { x: [t], y: [At], mode: "markers", name: "kohta t", marker: { size: 10, color: "#d64545" } }],
          { xlabel: "aika t (s)", ylabel: "[A]  (mol/l)" });

        read.innerHTML =
          ro("[A](t)", At.toFixed(3) + " mol/l") +
          ro("kulmakerroin d[A]/dt", slope.toFixed(3) + " mol/(l·s)") +
          ro("reaktionopeus v", "<b>" + rate.toFixed(3) + "</b> mol/(l·s)") +
          ro("puoliintumisaika t½", (Math.log(2) / k).toFixed(2) + " s");
      }
      [K, T].forEach(function (s) { s.addEventListener("input", draw); });
      draw();
    },

    /* Arvottu tehtävä: laske reaktionopeus annetulla hetkellä. */
    makeExercise: function () {
      var k = pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]);
      var A0 = pick([0.5, 1.0, 1.5, 2.0]);
      var t = randInt(1, 6);
      var rate = k * A0 * Math.exp(-k * t); // = k[A](t)
      return {
        promptHTML:
          "1. kertaluvun reaktiolle " + tex("[A]_0 = " + A0 + "\\text{ mol/l}") + " ja " +
          tex("k = " + k + "\\text{ /s}") + ".<br>Laske reaktionopeus " + tex("v = k[A](t)") +
          " hetkellä " + tex("t = " + t + "\\text{ s}") + " (yksikkö mol/(l·s), 3 desimaalia).",
        placeholder: "v = ? mol/(l·s)",
        hintHTML: "Ensin " + tex("[A](t)=[A]_0 e^{-kt}") + ", sitten " + tex("v=k\\,[A](t)") + ".",
        answerHTML: tex("v = " + k + "\\cdot" + A0 + "e^{-" + k + "\\cdot" + t + "} \\approx " + rate.toFixed(3)),
        check: function (input) { return numClose(parseNum(input), rate, 0.03); }
      };
    }
  };

  function ctl(id, label, min, max, step, val) {
    return '<div class="control"><label>' + label +
      ': <output id="' + id + '_out">' + val + "</output></label>" +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
  }
  function ro(k, v) { return '<div><span class="k">' + k + ':</span> <span class="v">' + v + "</span></div>"; }
})();
