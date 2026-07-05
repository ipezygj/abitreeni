/* Aihe: Stoikiometria (kemia).
   Reaktioyhtälön kertoimet + moolimassat → ainemäärät ja massat. Interaktiivinen metaanin poltto,
   ja arvotut "kuinka monta grammaa tuotetta" -tehtävät useasta reaktiosta. */
(function () {
  window.TOPICS = window.TOPICS || {};

  // Reaktiokirjasto tehtäviä varten. M = moolimassa (g/mol), c = kerroin yhtälössä.
  var REAKTIOT = [
    { nimi: "CH_4 + 2\\,O_2 \\rightarrow CO_2 + 2\\,H_2O",
      lajit: { "CH₄": { M: 16.04, c: 1 }, "O₂": { M: 32.00, c: 2 }, "CO₂": { M: 44.01, c: 1 }, "H₂O": { M: 18.02, c: 2 } },
      lahto: ["CH₄", "O₂"], tuote: ["CO₂", "H₂O"] },
    { nimi: "2\\,H_2 + O_2 \\rightarrow 2\\,H_2O",
      lajit: { "H₂": { M: 2.016, c: 2 }, "O₂": { M: 32.00, c: 1 }, "H₂O": { M: 18.02, c: 2 } },
      lahto: ["H₂", "O₂"], tuote: ["H₂O"] },
    { nimi: "N_2 + 3\\,H_2 \\rightarrow 2\\,NH_3",
      lajit: { "N₂": { M: 28.02, c: 1 }, "H₂": { M: 2.016, c: 3 }, "NH₃": { M: 17.03, c: 2 } },
      lahto: ["N₂", "H₂"], tuote: ["NH₃"] },
    { nimi: "2\\,Na + Cl_2 \\rightarrow 2\\,NaCl",
      lajit: { "Na": { M: 22.99, c: 2 }, "Cl₂": { M: 70.90, c: 1 }, "NaCl": { M: 58.44, c: 2 } },
      lahto: ["Na", "Cl₂"], tuote: ["NaCl"] }
  ];

  window.TOPICS["stoikiometria"] = {
    id: "stoikiometria",
    title: "Stoikiometria",
    category: "kemia",
    blurb: "Reaktioyhtälön kertoimet ja moolimassat: ainemäärästä massaan ja tuotteeseen.",

    render: function (el) {
      // Interaktiivinen: metaanin poltto CH₄ + 2 O₂ → CO₂ + 2 H₂O
      var M = { "CH₄": 16.04, "O₂": 32.00, "CO₂": 44.01, "H₂O": 18.02 };
      el.innerHTML =
        '<div class="card">' +
        "<p>Reaktioyhtälön kertoimet kertovat ainemäärien (mool) suhteet. Massa saadaan moolimassalla " +
        tex("m = n \\cdot M") + ". Esimerkki — metaanin täydellinen palaminen:</p>" +
        "<p style='text-align:center'>" + tex("CH_4 + 2\\,O_2 \\rightarrow CO_2 + 2\\,H_2O", true) + "</p>" +
        "<p>Säädä metaanin ainemäärää — muut lasketaan kertoimista ja moolimassoista:</p>" +
        '<div class="controls">' +
        '<div class="control"><label>n(CH₄) = <output id="n_out">1.0</output> mol</label>' +
        '<input type="range" id="n" min="0" max="5" step="0.1" value="1"></div>' +
        "</div>" +
        '<div id="splot" class="plot"></div>' +
        '<div class="readout" id="sread"></div>' +
        "</div>";

      var N = el.querySelector("#n"), plotEl = el.querySelector("#splot"), read = el.querySelector("#sread");
      function draw() {
        var n = +N.value;
        el.querySelector("#n_out").value = n.toFixed(1);
        var mol = { "CH₄": n, "O₂": 2 * n, "CO₂": n, "H₂O": 2 * n };
        var lajit = ["CH₄", "O₂", "CO₂", "H₂O"];
        plot(plotEl,
          [{ x: lajit, y: lajit.map(function (s) { return mol[s]; }), type: "bar",
             name: "ainemäärä (mol)",
             marker: { color: ["#17998a", "#17998a", "#a23bd6", "#a23bd6"] } }],
          { xlabel: "", ylabel: "n (mol)", legend: false });
        read.innerHTML = lajit.map(function (s) {
          return '<div><span class="k">' + s + ':</span> <span class="v">' +
            mol[s].toFixed(2) + " mol · " + (mol[s] * M[s]).toFixed(1) + " g</span></div>";
        }).join("");
      }
      N.addEventListener("input", draw);
      draw();
    },

    makeExercise: function () {
      var r = pick(REAKTIOT);
      var lahto = pick(r.lahto), tuote = pick(r.tuote);
      var mLahto = pick([2, 4, 5, 8, 10, 16, 20]); // g
      var A = r.lajit[lahto], B = r.lajit[tuote];
      var nLahto = mLahto / A.M;
      var nTuote = nLahto * (B.c / A.c);
      var mTuote = nTuote * B.M;
      return {
        promptHTML:
          "Reaktio: " + tex(r.nimi) + "<br>" +
          "Kuinka monta grammaa " + tex("\\mathrm{" + tuote.replace(/[₀₁₂₃₄]/g, sub) + "}") +
          " syntyy, kun reagoi " + tex(mLahto + "\\text{ g }\\mathrm{" + lahto.replace(/[₀₁₂₃₄]/g, sub) + "}") +
          "? (1 desimaali)",
        placeholder: "m = ? g",
        hintHTML: "1) " + tex("n=\\frac{m}{M}") + "  2) kerroinsuhteella tuotteen mooli  3) " + tex("m=nM") +
          ".  Moolimassat: " + tex("M(" + lahto.replace(/[₀₁₂₃₄]/g, sub) + ")=" + A.M) + ", " +
          tex("M(" + tuote.replace(/[₀₁₂₃₄]/g, sub) + ")=" + B.M) + " g/mol.",
        answerHTML: tex("m = \\frac{" + mLahto + "}{" + A.M + "}\\cdot\\frac{" + B.c + "}{" + A.c + "}\\cdot" + B.M +
          " \\approx " + mTuote.toFixed(1) + "\\text{ g}"),
        check: function (input) { return numClose(parseNum(input), mTuote, 0.02); }
      };
    }
  };

  // unicode-alaindeksi → LaTeX-alaindeksi, esim. "CO₂" → "CO_2" → \mathrm{CO_2} renderöi oikein CO₂
  function sub(ch) { return ({ "₀": "_0", "₁": "_1", "₂": "_2", "₃": "_3", "₄": "_4" })[ch] || ch; }
})();
