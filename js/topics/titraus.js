/* Aihe (SILTA): Titrauskäyrä = funktio + ekvivalenssikohta.
   Vahva happo (Va0, Ca) titrataan vahvalla emäksellä (Cb). pH on FUNKTIO lisätystä tilavuudesta Vb.
   Ekvivalenssikohta = kohta jossa käyrän jyrkkyys (derivaatta) on suurin — funktion ja derivaatan yhteys. */
(function () {
  window.TOPICS = window.TOPICS || {};

  function pHof(Ca, Va0, Cb, Vb) {
    var na = Ca * Va0 / 1000;   // mol happoa
    var nb = Cb * Vb / 1000;    // mol emästä
    var Vtot = (Va0 + Vb) / 1000; // L
    if (Vtot <= 0) return 7;
    if (na - nb > 1e-12) return -Math.log10((na - nb) / Vtot);        // ylimäärä happoa
    if (nb - na > 1e-12) return 14 + Math.log10((nb - na) / Vtot);    // ylimäärä emästä  (14 − pOH)
    return 7; // ekvivalenssi (vahva–vahva)
  }

  window.TOPICS["titraus"] = {
    id: "titraus",
    title: "Titrauskäyrä (happo–emäs)",
    category: "sillat",
    blurb: "pH lisätyn emäksen funktiona. Ekvivalenssikohta on käyrän jyrkin kohta = derivaatan huippu.",

    render: function (el) {
      el.innerHTML =
        '<div class="card">' +
        "<p>Vahvan hapon (tilavuus " + tex("V_{a0}") + ", pitoisuus " + tex("c_a") +
        ") titraus vahvalla emäksellä (" + tex("c_b") + "). pH on funktio lisätystä emästilavuudesta " +
        tex("V_b") + ". Ekvivalenssikohdassa " + tex("n_{emäs}=n_{happo}") + ", jolloin pH = 7 ja käyrä on jyrkimmillään:</p>" +
        "<p style='text-align:center'>" + tex("V_{ekv} = \\dfrac{c_a V_{a0}}{c_b}", true) + "</p>" +
        '<div class="controls">' +
        ctl("ca", "Hapon c_a (mol/l)", 0.05, 0.5, 0.05, 0.1) +
        ctl("va", "Hapon V_a0 (ml)", 10, 50, 5, 25) +
        ctl("cb", "Emäksen c_b (mol/l)", 0.05, 0.5, 0.05, 0.1) +
        ctl("vb", "Lisätty emäs V_b (ml)", 0, 80, 0.5, 10) +
        "</div>" +
        '<div id="tplot" class="plot"></div>' +
        '<div class="readout" id="tread"></div>' +
        "</div>";

      var CA = el.querySelector("#ca"), VA = el.querySelector("#va"),
          CB = el.querySelector("#cb"), VB = el.querySelector("#vb");
      var plotEl = el.querySelector("#tplot"), read = el.querySelector("#tread");

      function draw() {
        var ca = +CA.value, va = +VA.value, cb = +CB.value, vb = +VB.value;
        el.querySelector("#ca_out").value = ca.toFixed(2);
        el.querySelector("#va_out").value = va.toFixed(0);
        el.querySelector("#cb_out").value = cb.toFixed(2);
        el.querySelector("#vb_out").value = vb.toFixed(1);

        var Veq = ca * va / cb;
        var xmax = Math.max(vb + 5, Veq * 2, 20);
        var xs = [], ys = [];
        for (var v = 0; v <= xmax + 1e-9; v += xmax / 300) { xs.push(v); ys.push(pHof(ca, va, cb, v)); }
        var curPH = pHof(ca, va, cb, vb);

        plot(plotEl,
          [{ x: xs, y: ys, mode: "lines", name: "pH(V_b)", line: { width: 3 } },
           { x: [Veq], y: [7], mode: "markers", name: "ekvivalenssi", marker: { size: 11, color: "#a23bd6", symbol: "diamond" } },
           { x: [vb], y: [curPH], mode: "markers", name: "nyt", marker: { size: 9, color: "#d64545" } }],
          { xlabel: "lisätty emäs V_b (ml)", ylabel: "pH" });

        read.innerHTML =
          ro("pH nyt", curPH.toFixed(2)) +
          ro("ekvivalenssitilavuus V_ekv", "<b>" + Veq.toFixed(1) + "</b> ml") +
          ro("tila", vb < Veq - 1e-6 ? "happo ylimäärin" : (vb > Veq + 1e-6 ? "emäs ylimäärin" : "ekvivalenssi"));
      }
      [CA, VA, CB, VB].forEach(function (s) { s.addEventListener("input", draw); });
      draw();
    },

    makeExercise: function () {
      var ca = pick([0.1, 0.15, 0.2, 0.25]);
      var va = pick([20, 25, 30, 40]);
      var cb = pick([0.1, 0.2, 0.25]);
      var Veq = ca * va / cb;
      return {
        promptHTML:
          tex(va + "\\text{ ml}") + " happoa, jonka " + tex("c_a=" + ca + "\\text{ mol/l}") +
          ", titrataan emäksellä " + tex("c_b=" + cb + "\\text{ mol/l}") + ".<br>" +
          "Kuinka monta millilitraa emästä tarvitaan ekvivalenssikohtaan? (1 desimaali)",
        placeholder: "V_ekv = ? ml",
        hintHTML: "Ekvivalenssissa " + tex("c_b V_b = c_a V_{a0}") + "  ⟹  " + tex("V_b = \\dfrac{c_a V_{a0}}{c_b}") + ".",
        answerHTML: tex("V_{ekv} = \\dfrac{" + ca + "\\cdot" + va + "}{" + cb + "} = " + Veq.toFixed(1) + "\\text{ ml}"),
        check: function (input) { return numClose(parseNum(input), Veq, 0.01); }
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
