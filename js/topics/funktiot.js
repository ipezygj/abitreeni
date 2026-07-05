/* Aihe: Funktiot ja derivaatta (puhdas matematiikka).
   Interaktiivinen paraabeli f(x)=ax²+bx+c + sen derivaatta, ja arvotut derivointi-tehtävät. */
(function () {
  window.TOPICS = window.TOPICS || {};
  window.TOPICS["funktiot"] = {
    id: "funktiot",
    title: "Funktiot ja derivaatta",
    category: "matematiikka",
    blurb: "Toisen asteen funktio, sen derivaatta ja nollakohdat — säädä kertoimia ja katso miten kuvaaja muuttuu.",

    render: function (el) {
      el.innerHTML =
        '<div class="card">' +
        "<p>Tarkastellaan funktiota " + tex("f(x)=ax^2+bx+c") + ". Sen derivaatta on " +
        tex("f'(x)=2ax+b") + ". Derivaatan nollakohta antaa huipun paikan, ja " +
        tex("f'(x)") + " kertoo tangentin kulmakertoimen jokaisessa pisteessä.</p>" +
        '<div class="controls">' +
        control("a", "a", -3, 3, 0.1, 1) +
        control("b", "b", -6, 6, 0.5, -2) +
        control("c", "c", -6, 6, 0.5, -3) +
        "</div>" +
        '<div id="fplot" class="plot"></div>' +
        '<div class="readout" id="fread"></div>' +
        "</div>";

      var A = el.querySelector("#a"), B = el.querySelector("#b"), C = el.querySelector("#c");
      var plotEl = el.querySelector("#fplot"), read = el.querySelector("#fread");

      function draw() {
        var a = +A.value, b = +B.value, c = +C.value;
        el.querySelector("#a_out").value = a.toFixed(1);
        el.querySelector("#b_out").value = b.toFixed(1);
        el.querySelector("#c_out").value = c.toFixed(1);
        var xs = [], f = [], df = [];
        for (var x = -8; x <= 8.0001; x += 0.1) { xs.push(x); f.push(a * x * x + b * x + c); df.push(2 * a * x + b); }
        plot(plotEl,
          [{ x: xs, y: f, mode: "lines", name: "f(x)", line: { width: 3 } },
           { x: xs, y: df, mode: "lines", name: "f'(x)", line: { width: 2, dash: "dot" } }],
          { xlabel: "x", ylabel: "y" });

        // nollakohdat + huippu
        var info = [];
        var d = b * b - 4 * a * c;
        if (Math.abs(a) < 1e-9) {
          info.push(["Tyyppi", "suora (a≈0)"]);
        } else {
          info.push(["Huipun x", (-b / (2 * a)).toFixed(2)]);
          if (d > 0) info.push(["Nollakohdat", ((-b - Math.sqrt(d)) / (2 * a)).toFixed(2) + " ja " + ((-b + Math.sqrt(d)) / (2 * a)).toFixed(2)]);
          else if (Math.abs(d) < 1e-9) info.push(["Nollakohta", (-b / (2 * a)).toFixed(2) + " (kaksinkert.)"]);
          else info.push(["Nollakohdat", "ei reaalisia (D=" + d.toFixed(1) + ")"]);
        }
        read.innerHTML = info.map(function (p) {
          return '<div><span class="k">' + p[0] + ':</span> <span class="v">' + p[1] + "</span></div>";
        }).join("");
      }
      [A, B, C].forEach(function (s) { s.addEventListener("input", draw); });
      draw();
    },

    /* Arvottu tehtävä: derivoi polynomi. */
    makeExercise: function () {
      var a = randInt(1, 6), n = randInt(2, 4), b = randInt(-6, 6);
      // f(x) = a x^n + b x  ->  f'(x) = a n x^(n-1) + b
      var promptHTML = "Derivoi funktio " + tex("f(x)=" + a + "x^{" + n + "}" + (b >= 0 ? "+" : "") + b + "x") +
        ".<br>Anna " + tex("f'(x)") + " kysyttäessä kohdassa " + tex("x=1") + " (eli laske " + tex("f'(1)") + ").";
      var val = a * n * Math.pow(1, n - 1) + b; // f'(1)
      return {
        promptHTML: promptHTML,
        placeholder: "f'(1) = ?",
        hintHTML: "Muista: " + tex("\\frac{d}{dx}x^{n}=n\\,x^{n-1}") + " ja " + tex("\\frac{d}{dx}(bx)=b") + ".",
        answerHTML: tex("f'(1)=" + (a + "\\cdot" + n) + "+" + "(" + b + ")=" + val),
        check: function (input) { return numClose(parseNum(input), val, 1e-6); }
      };
    }
  };

  // pikkuapuri liukusäätimen HTML:lle
  function control(id, label, min, max, step, val) {
    return '<div class="control"><label>' + label +
      ' = <output id="' + id + '_out">' + val + "</output></label>" +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
  }
})();
