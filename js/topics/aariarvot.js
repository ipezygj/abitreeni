/* Aihe: Derivaatan ääriarvot ja optimointi (matematiikka).
   Ääriarvot löytyvät derivaatan nollakohdista: f'(x)=0. Interaktiivinen kolmannen asteen funktio,
   jonka ääriarvokohdat (f'=0) merkitään ja luokitellaan (max/min). Arvotut optimointitehtävät. */
(function () {
  window.TOPICS = window.TOPICS || {};

  window.TOPICS["aariarvot"] = {
    id: "aariarvot",
    title: "Ääriarvot ja optimointi",
    category: "matematiikka",
    blurb: "Ääriarvokohdat derivaatan nollakohdista f'(x)=0 — paikallinen maksimi ja minimi.",

    render: function (el) {
      el.innerHTML =
        '<div class="card">' +
        "<p>Funktion ääriarvokohdat ovat siellä missä derivaatta on nolla: " + tex("f'(x)=0") + ". " +
        "Kolmannen asteen funktiolla " + tex("f(x)=ax^3+bx^2+cx+d") + " derivaatta on " +
        tex("f'(x)=3ax^2+2bx+c") + " — sen nollakohdat antavat paikallisen maksimin ja minimin.</p>" +
        '<div class="controls">' +
        ctl("a", "a", -1, 1, 0.1, 0.3) +
        ctl("b", "b", -3, 3, 0.5, -1) +
        ctl("c", "c", -4, 4, 0.5, -2) +
        ctl("d", "d", -4, 4, 0.5, 1) +
        "</div>" +
        '<div id="eplot" class="plot"></div>' +
        '<div class="readout" id="eread"></div>' +
        "</div>";

      var A = el.querySelector("#a"), B = el.querySelector("#b"), C = el.querySelector("#c"), D = el.querySelector("#d");
      var plotEl = el.querySelector("#eplot"), read = el.querySelector("#eread");
      function f(a, b, c, d, x) { return a * x * x * x + b * x * x + c * x + d; }
      function draw() {
        var a = +A.value, b = +B.value, c = +C.value, d = +D.value;
        el.querySelector("#a_out").value = a.toFixed(1);
        el.querySelector("#b_out").value = b.toFixed(1);
        el.querySelector("#c_out").value = c.toFixed(1);
        el.querySelector("#d_out").value = d.toFixed(1);

        var xs = [], ys = [], dys = [];
        for (var x = -8; x <= 8.0001; x += 0.1) { xs.push(x); ys.push(f(a, b, c, d, x)); dys.push(3 * a * x * x + 2 * b * x + c); }

        // f'(x)=0: 3a x² + 2b x + c = 0
        var extX = [], extY = [];
        var info = [];
        if (Math.abs(a) < 1e-9) {
          // toisen asteen: yksi ääriarvo x=−c/(2b) jos b≠0
          if (Math.abs(b) > 1e-9) { var xe = -c / (2 * b); extX.push(xe); extY.push(f(a, b, c, d, xe)); info.push([(b > 0 ? "minimi" : "maksimi"), "x=" + xe.toFixed(2)]); }
        } else {
          var disc = (2 * b) * (2 * b) - 4 * (3 * a) * c;
          if (disc > 0) {
            [(-2 * b - Math.sqrt(disc)) / (2 * 3 * a), (-2 * b + Math.sqrt(disc)) / (2 * 3 * a)].forEach(function (xe) {
              extX.push(xe); extY.push(f(a, b, c, d, xe));
              var toinen = 6 * a * xe + 2 * b; // f''(x): >0 min, <0 max
              info.push([(toinen > 0 ? "minimi" : "maksimi"), "x=" + xe.toFixed(2) + ", f=" + f(a, b, c, d, xe).toFixed(2)]);
            });
          } else info.push(["ääriarvot", "ei paikallisia (f' ei nollakohtia)"]);
        }

        plot(plotEl,
          [{ x: xs, y: ys, mode: "lines", name: "f(x)", line: { width: 3 } },
           { x: xs, y: dys, mode: "lines", name: "f'(x)", line: { width: 2, dash: "dot" } },
           { x: extX, y: extY, mode: "markers", name: "f'=0 (ääriarvot)", marker: { size: 10, color: "#d64545" } }],
          { xlabel: "x", ylabel: "y" });
        read.innerHTML = info.map(function (p) {
          return '<div><span class="k">' + p[0] + ':</span> <span class="v">' + p[1] + "</span></div>";
        }).join("");
      }
      [A, B, C, D].forEach(function (s) { s.addEventListener("input", draw); });
      draw();
    },

    makeExercise: function () {
      if (Math.random() < 0.5) {
        // Optimointi: kahden luvun summa S, suurin tulo.
        var S = pick([10, 12, 16, 20, 24, 30]);
        var maxTulo = (S / 2) * (S / 2);
        return {
          promptHTML: "Kahden positiivisen luvun summa on " + tex("" + S) + ".<br>" +
            "Mikä on suurin mahdollinen tulo? (optimoi derivaatalla)",
          placeholder: "suurin tulo",
          hintHTML: "Olkoot luvut " + tex("x") + " ja " + tex(S + "-x") + ". Tulo " + tex("P(x)=x(" + S + "-x)") +
            "; ratkaise " + tex("P'(x)=0") + " → " + tex("x=" + (S / 2)) + ".",
          answerHTML: tex("P_{max}=\\tfrac{" + S + "}{2}\\cdot\\tfrac{" + S + "}{2}=" + maxTulo),
          check: function (i) { return numClose(parseNum(i), maxTulo, 1e-6); }
        };
      } else {
        // Paraabelin ääriarvokohta: f(x)=ax²+bx+c, x = −b/(2a) derivaatan nollakohdasta.
        var a = pick([1, 2, -1, -2, 3]);
        var b = pick([-6, -4, -2, 2, 4, 6]);
        var xe = -b / (2 * a);
        var tyyppi = a > 0 ? "minimi" : "maksimi";
        return {
          promptHTML: "Funktiolla " + tex("f(x)=" + a + "x^2" + (b >= 0 ? "+" : "") + b + "x+3") +
            " on " + tyyppi + ".<br>Missä kohdassa " + tex("x") + " se on? (ratkaise " + tex("f'(x)=0") + ")",
          placeholder: "x = ?",
          hintHTML: tex("f'(x)=" + (2 * a) + "x" + (b >= 0 ? "+" : "") + b + "=0"),
          answerHTML: tex("x = \\dfrac{-b}{2a} = \\dfrac{" + (-b) + "}{" + (2 * a) + "} = " + xe),
          check: function (i) { return numClose(parseNum(i), xe, 1e-6); }
        };
      }
    }
  };

  function ctl(id, label, min, max, step, val) {
    return '<div class="control"><label>' + label +
      ' = <output id="' + id + '_out">' + val + "</output></label>" +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
  }
})();
