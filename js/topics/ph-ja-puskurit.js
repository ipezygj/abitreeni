/* Aihe: pH ja puskurit (kemia).
   Vahva happo/emäs: pH = −log[H₃O⁺]. Puskuri: Henderson–Hasselbalch pH = pKa + log([A⁻]/[HA]).
   Interaktiivinen puskurikäyrä (pH suhteen [A⁻]/[HA] funktiona) + arvotut pH-tehtävät. */
(function () {
  window.TOPICS = window.TOPICS || {};

  window.TOPICS["ph-ja-puskurit"] = {
    id: "ph-ja-puskurit",
    title: "pH ja puskurit",
    category: "kemia",
    blurb: "pH = −log[H₃O⁺], vahvat hapot/emäkset ja puskurit (Henderson–Hasselbalch).",

    render: function (el) {
      el.innerHTML =
        '<div class="card">' +
        "<p>Vahvalle hapolle " + tex("\\mathrm{pH} = -\\log[\\mathrm{H_3O^+}]") + " ja vahvalle emäkselle " +
        tex("\\mathrm{pH} = 14 - \\mathrm{pOH} = 14 + \\log[\\mathrm{OH^-}]") + ".</p>" +
        "<p>Puskuriliuoksen pH saadaan Henderson–Hasselbalch-yhtälöstä:</p>" +
        "<p style='text-align:center'>" + tex("\\mathrm{pH} = \\mathrm{p}K_a + \\log\\dfrac{[\\mathrm{A^-}]}{[\\mathrm{HA}]}", true) + "</p>" +
        "<p>Kun " + tex("[\\mathrm{A^-}]=[\\mathrm{HA}]") + ", pH = p" + tex("K_a") + " (puskuri tehokkaimmillaan). Säädä:</p>" +
        '<div class="controls">' +
        ctl("pka", "pKa", 3, 10, 0.1, 4.8) +
        ctl("a", "[A⁻] (mol/l)", 0.01, 1, 0.01, 0.1) +
        ctl("ha", "[HA] (mol/l)", 0.01, 1, 0.01, 0.1) +
        "</div>" +
        '<div id="pplot" class="plot"></div>' +
        '<div class="readout" id="pread"></div>' +
        "</div>";

      var PKA = el.querySelector("#pka"), A = el.querySelector("#a"), HA = el.querySelector("#ha");
      var plotEl = el.querySelector("#pplot"), read = el.querySelector("#pread");
      function draw() {
        var pka = +PKA.value, a = +A.value, ha = +HA.value;
        el.querySelector("#pka_out").value = pka.toFixed(1);
        el.querySelector("#a_out").value = a.toFixed(2);
        el.querySelector("#ha_out").value = ha.toFixed(2);
        var pH = pka + Math.log10(a / ha);

        // Käyrä: pH suhteen r = [A⁻]/[HA] funktiona (logaritminen)
        var xs = [], ys = [];
        for (var r = 0.1; r <= 10.001; r += 0.05) { xs.push(r); ys.push(pka + Math.log10(r)); }
        var rCur = a / ha;
        plot(plotEl,
          [{ x: xs, y: ys, mode: "lines", name: "pH(r)", line: { width: 3 } },
           { x: [rCur], y: [pH], mode: "markers", name: "nyt", marker: { size: 9, color: "#d64545" } },
           { x: [1], y: [pka], mode: "markers", name: "r=1 → pH=pKa", marker: { size: 10, color: "#a23bd6", symbol: "diamond" } }],
          { xlabel: "suhde [A⁻]/[HA]", ylabel: "pH" });
        read.innerHTML =
          ro("pH", "<b>" + pH.toFixed(2) + "</b>") +
          ro("suhde [A⁻]/[HA]", rCur.toFixed(2)) +
          ro("liuos", pH < 7 ? "hapan" : (pH > 7 ? "emäksinen" : "neutraali"));
      }
      [PKA, A, HA].forEach(function (s) { s.addEventListener("input", draw); });
      draw();
    },

    makeExercise: function () {
      var kind = pick(["vahva-happo", "vahva-emas", "puskuri"]);
      if (kind === "vahva-happo") {
        var c = pick([0.001, 0.005, 0.01, 0.02, 0.05, 0.1]);
        var pH = -Math.log10(c);
        return {
          promptHTML: "Vahvan hapon pitoisuus on " + tex("c = " + c + "\\text{ mol/l}") +
            " (täysin protolysoituva).<br>Laske liuoksen pH (2 desimaalia).",
          placeholder: "pH = ?",
          hintHTML: tex("\\mathrm{pH} = -\\log[\\mathrm{H_3O^+}] = -\\log c"),
          answerHTML: tex("\\mathrm{pH} = -\\log(" + c + ") \\approx " + pH.toFixed(2)),
          check: function (i) { return numClose(parseNum(i), pH, 0.01); }
        };
      } else if (kind === "vahva-emas") {
        var cb = pick([0.001, 0.005, 0.01, 0.02, 0.05, 0.1]);
        var pOH = -Math.log10(cb), pH2 = 14 - pOH;
        return {
          promptHTML: "Vahvan emäksen pitoisuus on " + tex("c = " + cb + "\\text{ mol/l}") +
            " (esim. NaOH).<br>Laske liuoksen pH (2 desimaalia).",
          placeholder: "pH = ?",
          hintHTML: "Ensin " + tex("\\mathrm{pOH} = -\\log[\\mathrm{OH^-}]") + ", sitten " + tex("\\mathrm{pH} = 14 - \\mathrm{pOH}"),
          answerHTML: tex("\\mathrm{pH} = 14 - (-\\log " + cb + ") \\approx " + pH2.toFixed(2)),
          check: function (i) { return numClose(parseNum(i), pH2, 0.01); }
        };
      } else {
        var pka = pick([3.8, 4.2, 4.8, 6.4, 7.2, 9.3]);
        var a = pick([0.05, 0.1, 0.2, 0.5]);
        var ha = pick([0.05, 0.1, 0.2, 0.5]);
        var pH3 = pka + Math.log10(a / ha);
        return {
          promptHTML: "Puskuriliuoksessa " + tex("\\mathrm{p}K_a = " + pka) + ", " +
            tex("[\\mathrm{A^-}] = " + a + "\\text{ mol/l}") + " ja " + tex("[\\mathrm{HA}] = " + ha + "\\text{ mol/l}") +
            ".<br>Laske pH (2 desimaalia).",
          placeholder: "pH = ?",
          hintHTML: tex("\\mathrm{pH} = \\mathrm{p}K_a + \\log\\dfrac{[\\mathrm{A^-}]}{[\\mathrm{HA}]}"),
          answerHTML: tex("\\mathrm{pH} = " + pka + " + \\log\\dfrac{" + a + "}{" + ha + "} \\approx " + pH3.toFixed(2)),
          check: function (i) { return numClose(parseNum(i), pH3, 0.01); }
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
