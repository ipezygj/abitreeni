/* Aihe (SILTA): Integraali = ainemäärä nopeudesta.
   Derivaatta-aiheessa reaktionopeus oli pitoisuuden DERIVAATTA. Käänteinen operaatio: kun tunnetaan
   nopeus v(t), muodostunut kokonaismäärä on INTEGRAALI eli pinta-ala käyrän alla:
       n = ∫₀ᵀ v(t) dt   (pinta-ala v(t)-käyrän alla).
   Interaktiivinen: v(t)=v0·e^(−kt), varjostettu pinta-ala 0..t; arvotut määrätyn integraalin tehtävät. */
(function () {
  window.TOPICS = window.TOPICS || {};

  window.TOPICS["integraali-ainemaara"] = {
    id: "integraali-ainemaara",
    title: "Integraali = ainemäärä nopeudesta",
    category: "sillat",
    blurb: "Pinta-ala nopeuskäyrän alla on kertynyt ainemäärä — derivoinnin käänteisoperaatio.",

    render: function (el) {
      el.innerHTML =
        '<div class="card">' +
        "<p>Reaktionopeus " + tex("v(t)") + " kertoo, kuinka nopeasti tuotetta syntyy. Ajassa " +
        tex("0 \\rightarrow T") + " syntynyt kokonaismäärä on nopeuskäyrän alle jäävä pinta-ala eli integraali:</p>" +
        "<p style='text-align:center'>" + tex("n = \\int_0^{T} v(t)\\,dt", true) + "</p>" +
        "<p>Tämä on <b>derivoinnin käänteisoperaatio</b>: derivaatta-aiheessa nopeus saatiin pitoisuudesta derivoimalla; " +
        "tässä ainemäärä saadaan nopeudesta integroimalla. Esimerkki " + tex("v(t) = v_0 e^{-kt}") +
        ", jolloin " + tex("\\int_0^{T} v_0 e^{-kt}\\,dt = \\dfrac{v_0}{k}\\left(1 - e^{-kT}\\right)") + ".</p>" +
        '<div class="controls">' +
        ctl("v0", "Alkunopeus v₀ (mol/(l·s))", 0.1, 2, 0.1, 1) +
        ctl("k", "Vakio k (1/s)", 0.05, 1, 0.05, 0.3) +
        ctl("T", "Yläraja T (s)", 0.5, 15, 0.5, 5) +
        "</div>" +
        '<div id="iplot" class="plot"></div>' +
        '<div class="readout" id="iread"></div>' +
        "</div>";

      var V0 = el.querySelector("#v0"), K = el.querySelector("#k"), T = el.querySelector("#T");
      var plotEl = el.querySelector("#iplot"), read = el.querySelector("#iread");
      function draw() {
        var v0 = +V0.value, k = +K.value, Tv = +T.value;
        el.querySelector("#v0_out").value = v0.toFixed(1);
        el.querySelector("#k_out").value = k.toFixed(2);
        el.querySelector("#T_out").value = Tv.toFixed(1);

        var xmax = 15, xs = [], ys = [];
        for (var x = 0; x <= xmax + 1e-9; x += xmax / 300) { xs.push(x); ys.push(v0 * Math.exp(-k * x)); }
        // varjostettu osa 0..T
        var fx = [], fy = [];
        for (var x2 = 0; x2 <= Tv + 1e-9; x2 += Math.max(0.02, Tv / 200)) { fx.push(x2); fy.push(v0 * Math.exp(-k * x2)); }
        var area = (v0 / k) * (1 - Math.exp(-k * Tv));

        plot(plotEl,
          [{ x: fx, y: fy, mode: "lines", name: "pinta-ala = n", fill: "tozeroy",
             line: { width: 0 }, fillcolor: "rgba(162,59,214,0.28)" },
           { x: xs, y: ys, mode: "lines", name: "v(t)", line: { width: 3, color: "#2f6df6" } },
           { x: [Tv], y: [v0 * Math.exp(-k * Tv)], mode: "markers", name: "T", marker: { size: 8, color: "#d64545" } }],
          { xlabel: "aika t (s)", ylabel: "nopeus v (mol/(l·s))" });
        read.innerHTML =
          ro("integraali ∫₀ᵀ v dt", "<b>" + area.toFixed(3) + "</b> mol/l") +
          ro("= v₀/k (1−e^(−kT))", (v0 / k).toFixed(2) + " · " + (1 - Math.exp(-k * Tv)).toFixed(3)) +
          ro("raja T→∞", (v0 / k).toFixed(2) + " mol/l");
      }
      [V0, K, T].forEach(function (s) { s.addEventListener("input", draw); });
      draw();
    },

    makeExercise: function () {
      // Määrätty integraali polynomista (pitkän matikan ydintaito), nopeus-kontekstissa.
      var kind = pick(["vakio", "lineaarinen", "nelio"]);
      var T = randInt(2, 6);
      if (kind === "vakio") {
        var c = pick([2, 3, 5]);
        var val = c * T;
        return {
          promptHTML: "Tuotetta syntyy vakionopeudella " + tex("v(t) = " + c + "\\text{ mol/(l·s)}") + ".<br>" +
            "Kuinka paljon tuotetta syntyy ajassa " + tex("0 \\rightarrow " + T + "\\text{ s}") + "? " +
            "(eli " + tex("\\int_0^{" + T + "} " + c + "\\,dt") + ")",
          placeholder: "n = ? mol/l",
          hintHTML: tex("\\int_0^T c\\,dt = c\\,T"),
          answerHTML: tex("\\int_0^{" + T + "} " + c + "\\,dt = " + c + "\\cdot" + T + " = " + val),
          check: function (i) { return numClose(parseNum(i), val, 1e-6); }
        };
      } else if (kind === "lineaarinen") {
        var a = pick([1, 2, 3, 4]);
        var val2 = a * T * T / 2;
        return {
          promptHTML: "Nopeus kasvaa lineaarisesti: " + tex("v(t) = " + a + "t") + " (mol/(l·s)).<br>" +
            "Laske syntynyt ainemäärä " + tex("\\int_0^{" + T + "} " + a + "t\\,dt") + ".",
          placeholder: "n = ? mol/l",
          hintHTML: tex("\\int_0^T a t\\,dt = a\\,\\dfrac{T^2}{2}") + " (tehofunktion integrointi " + tex("\\int t\\,dt=\\tfrac{t^2}{2}") + ").",
          answerHTML: tex("\\int_0^{" + T + "} " + a + "t\\,dt = " + a + "\\cdot\\dfrac{" + T + "^2}{2} = " + val2),
          check: function (i) { return numClose(parseNum(i), val2, 1e-6); }
        };
      } else {
        var b = pick([1, 2, 3]);
        var val3 = b * Math.pow(T, 3) / 3;
        return {
          promptHTML: "Nopeus " + tex("v(t) = " + b + "t^2") + " (mol/(l·s)).<br>" +
            "Laske " + tex("\\int_0^{" + T + "} " + b + "t^2\\,dt") + " (1 desimaali).",
          placeholder: "n = ? mol/l",
          hintHTML: tex("\\int_0^T b t^2\\,dt = b\\,\\dfrac{T^3}{3}"),
          answerHTML: tex("\\int_0^{" + T + "} " + b + "t^2\\,dt = " + b + "\\cdot\\dfrac{" + T + "^3}{3} = " + val3.toFixed(1)),
          check: function (i) { return numClose(parseNum(i), val3, 0.01); }
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
