/* ─────────────────────────────────────────────────────────────────────────────
   MALLITIEDOSTO — näin lisäät uuden aiheen. (Alkaa alaviivalla → ei ladata sivulle.)

   1. Kopioi tämä tiedosto, esim.  js/topics/tasapaino.js
   2. Muuta id, title, category, blurb ja sisältö.
   3. Lisää index.html:ään <script src="js/topics/tasapaino.js"></script>  ENNEN app.js:ää.
   Siinä kaikki — navigaatio, etusivukortti ja tehtäväkortti syntyvät automaattisesti.

   Käytettävissä olevat apufunktiot (määritelty app.js:ssä, globaaleja):
     tex(s, display)      → LaTeX-kaava HTML:ksi.  tex("x^2")  /  tex("\\int_0^1 x dx", true)
     plot(el, traces, o)  → Plotly-viivakuvaaja. o = {xlabel, ylabel, title, legend}
     numClose(a, b, tol)  → numeroiden vertailu toleranssilla (tehtävän tarkistus)
     parseNum(str)        → lukee vastauksen (hyväksyy pilkun desimaalina)
     randInt(lo, hi), pick(arr)  → arvonta tehtäviin
   ───────────────────────────────────────────────────────────────────────────── */
(function () {
  window.TOPICS = window.TOPICS || {};

  window.TOPICS["malli"] = {              // ← UNIIKKI id (myös URL: #/t/malli)
    id: "malli",
    title: "Malliaihe (poista tämä)",
    category: "matematiikka",             // "matematiikka" | "kemia" | "sillat"
    blurb: "Lyhyt kuvaus, joka näkyy etusivun kortissa ja aiheen alussa.",

    // render(el): rakenna interaktiivinen sisältö annettuun elementtiin.
    render: function (el) {
      el.innerHTML =
        '<div class="card">' +
        "<p>Teoria tähän. Kaava esimerkiksi: " + tex("E = mc^2") + ".</p>" +
        '<div class="controls">' +
        '<div class="control"><label>Parametri x: <output id="x_out">1</output></label>' +
        '<input type="range" id="x" min="0" max="10" step="0.1" value="1"></div>' +
        "</div>" +
        '<div id="myplot" class="plot"></div>' +
        "</div>";

      var X = el.querySelector("#x"), plotEl = el.querySelector("#myplot");
      function draw() {
        var x0 = +X.value;
        el.querySelector("#x_out").value = x0.toFixed(1);
        var xs = [], ys = [];
        for (var x = 0; x <= 10; x += 0.1) { xs.push(x); ys.push(x0 * Math.sin(x)); }
        plot(plotEl, [{ x: xs, y: ys, mode: "lines", name: "y" }], { xlabel: "x", ylabel: "y" });
      }
      X.addEventListener("input", draw);
      draw();
    },

    // makeExercise(): (valinnainen) palauta yksi arvottu tehtävä. Jätä pois jos ei tehtäviä.
    makeExercise: function () {
      var a = randInt(2, 9), b = randInt(2, 9), oikea = a * b;
      return {
        promptHTML: "Paljonko on " + tex(a + "\\cdot" + b) + "?",
        placeholder: "vastaus",
        hintHTML: "Vinkki näkyy tässä (valinnainen).",
        answerHTML: tex(a + "\\cdot" + b + "=" + oikea),
        check: function (input) { return numClose(parseNum(input), oikea, 1e-9); }
      };
    }
  };
})();
