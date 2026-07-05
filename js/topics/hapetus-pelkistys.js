/* Aihe: Hapetus-pelkistys ja hapetusluvut (kemia).
   Säännöt: O = −2, H = +1, alkuaine = 0, ionissa summa = varaus, yhdisteessä summa = 0.
   Interaktiivinen: klikkaa yhdistettä → hapetuslukujen erittely. Arvotut "mikä on alkuaineen X
   hapetusluku yhdisteessä Y" -tehtävät. */
(function () {
  window.TOPICS = window.TOPICS || {};

  // Esimerkkiyhdisteet erittelyineen (näytettäväksi).
  var ESIMERKIT = [
    { f: "H_2O", osat: [["H", +1, 2], ["O", -2, 1]], varaus: 0 },
    { f: "H_2SO_4", osat: [["H", +1, 2], ["S", +6, 1], ["O", -2, 4]], varaus: 0 },
    { f: "KMnO_4", osat: [["K", +1, 1], ["Mn", +7, 1], ["O", -2, 4]], varaus: 0 },
    { f: "CO_2", osat: [["C", +4, 1], ["O", -2, 2]], varaus: 0 },
    { f: "NH_3", osat: [["N", -3, 1], ["H", +1, 3]], varaus: 0 },
    { f: "Fe_2O_3", osat: [["Fe", +3, 2], ["O", -2, 3]], varaus: 0 },
    { f: "HNO_3", osat: [["H", +1, 1], ["N", +5, 1], ["O", -2, 3]], varaus: 0 }
  ];

  // Tehtävät: ratkaise yhden alkuaineen hapetusluku. answer = (varaus − tunnettu) / n.
  var TEHTAVAT = [
    { f: "H_2SO_4", el: "S", n: 1, tunnettu: 2 * 1 + 4 * -2, varaus: 0 },
    { f: "KMnO_4", el: "Mn", n: 1, tunnettu: 1 + 4 * -2, varaus: 0 },
    { f: "Cr_2O_7^{2-}", el: "Cr", n: 2, tunnettu: 7 * -2, varaus: -2 },
    { f: "NO_3^{-}", el: "N", n: 1, tunnettu: 3 * -2, varaus: -1 },
    { f: "CO_2", el: "C", n: 1, tunnettu: 2 * -2, varaus: 0 },
    { f: "NH_3", el: "N", n: 1, tunnettu: 3 * 1, varaus: 0 },
    { f: "SO_2", el: "S", n: 1, tunnettu: 2 * -2, varaus: 0 },
    { f: "HClO_4", el: "Cl", n: 1, tunnettu: 1 + 4 * -2, varaus: 0 },
    { f: "Fe_2O_3", el: "Fe", n: 2, tunnettu: 3 * -2, varaus: 0 },
    { f: "MnO_4^{-}", el: "Mn", n: 1, tunnettu: 4 * -2, varaus: -1 }
  ];

  window.TOPICS["hapetus-pelkistys"] = {
    id: "hapetus-pelkistys",
    title: "Hapetusluvut (redox)",
    category: "kemia",
    blurb: "Hapetuslukujen säännöt ja määritys — klikkaa yhdistettä ja näe erittely.",

    render: function (el) {
      el.innerHTML =
        '<div class="card">' +
        "<p><b>Säännöt:</b> alkuaine 0 · " + tex("\\mathrm{O}=-2") + " · " + tex("\\mathrm{H}=+1") +
        " · ryhmä 1 = +1, ryhmä 2 = +2 · " + tex("\\mathrm{F}=-1") +
        " · yhdisteessä summa = 0, ionissa summa = varaus.</p>" +
        '<p>Klikkaa yhdistettä:</p><div id="chips" style="display:flex;flex-wrap:wrap;gap:4px"></div>' +
        '<div id="breakdown" style="margin-top:14px"></div>' +
        "</div>";

      // renderöi chipit KaTeXilla
      var chipWrap = el.querySelector("#chips");
      ESIMERKIT.forEach(function (e, i) {
        var b = document.createElement("button");
        b.className = "btn ghost"; b.style.margin = "3px";
        b.innerHTML = tex(e.f); b.setAttribute("data-i", i);
        b.onclick = function () { show(i); };
        chipWrap.appendChild(b);
      });
      var bd = el.querySelector("#breakdown");
      function show(i) {
        var e = ESIMERKIT[i];
        var rows = e.osat.map(function (o) {
          return '<div><span class="k">' + tex("\\mathrm{" + o[0] + "}") + ':</span> <span class="v">' +
            (o[1] > 0 ? "+" : "") + o[1] + (o[2] > 1 ? "  (×" + o[2] + ")" : "") + '</span></div>';
        }).join("");
        var summa = e.osat.reduce(function (s, o) { return s + o[1] * o[2]; }, 0);
        bd.innerHTML = "<p>" + tex(e.f) + " — hapetusluvut:</p><div class='readout'>" + rows + "</div>" +
          "<p class='hint'>Summa: " + e.osat.map(function (o) { return o[2] + "·(" + (o[1] > 0 ? "+" : "") + o[1] + ")"; }).join(" + ") +
          " = " + summa + " = varaus " + e.varaus + " ✓</p>";
      }
      show(1); // näytä H₂SO₄ aluksi
    },

    makeExercise: function () {
      var t = pick(TEHTAVAT);
      var ans = (t.varaus - t.tunnettu) / t.n;
      return {
        promptHTML: "Mikä on alkuaineen " + tex("\\mathrm{" + t.el + "}") + " hapetusluku yhdisteessä/ionissa " +
          tex(t.f) + "? (anna etumerkki, esim. +6 tai −3)",
        placeholder: "hapetusluku",
        hintHTML: "Muut atomit ovat sääntöjen mukaan; ratkaise " + tex("\\mathrm{" + t.el + "}") +
          " siitä että summa = varaus (" + t.varaus + ").",
        answerHTML: tex("\\mathrm{" + t.el + "} = " + (ans > 0 ? "+" : "") + ans),
        check: function (input) { return numClose(parseNum(input), ans, 1e-9); }
      };
    }
  };
})();
