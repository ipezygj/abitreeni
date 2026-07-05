/* app.js — sovelluksen runko: navigaatio, hash-reititys, tehtävämoottori, teema ja edistyminen.
   Aihe-moduulit rekisteröityvät window.TOPICS:iin (ks. js/topics/_MALLI.js). Tämä tiedosto ei tiedä
   aiheista mitään etukäteen — se lukee vain window.TOPICS:in, joten uuden aiheen lisääminen ei vaadi
   muutoksia tänne. */
(function () {
  "use strict";

  var TOPICS = window.TOPICS || {};
  var CATS = {
    matematiikka: "Matematiikka",
    kemia: "Kemia",
    sillat: "★ Sillat (matikka × kemia)"
  };

  /* ---------- Apufunktiot, joita aihe-moduulit käyttävät ---------- */

  // Renderöi LaTeX-merkkijonon HTML:ksi. tex("x^2") tai tex("\\int_0^1 x\\,dx", true) (display-tila).
  window.tex = function (s, display) {
    try {
      return window.katex.renderToString(s, { displayMode: !!display, throwOnError: false });
    } catch (e) { return "<code>" + s + "</code>"; }
  };

  // Piirrä viivakuvaaja Plotlyllä. plot(el, traces, {xlabel, ylabel, title}).
  window.plot = function (el, traces, opts) {
    opts = opts || {};
    var dark = document.documentElement.getAttribute("data-theme") === "dark" ||
      (matchMedia("(prefers-color-scheme: dark)").matches &&
        document.documentElement.getAttribute("data-theme") !== "light");
    var fg = dark ? "#e7ecf5" : "#1a1f2b";
    var grid = dark ? "#263141" : "#e2e6ee";
    var layout = {
      margin: { l: 52, r: 16, t: opts.title ? 34 : 12, b: 44 },
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: fg, size: 13 },
      title: opts.title ? { text: opts.title, font: { size: 15 } } : undefined,
      xaxis: { title: opts.xlabel || "", gridcolor: grid, zerolinecolor: grid },
      yaxis: { title: opts.ylabel || "", gridcolor: grid, zerolinecolor: grid },
      showlegend: opts.legend !== false,
      legend: { orientation: "h", y: 1.12 }
    };
    window.Plotly.react(el, traces, layout, { responsive: true, displayModeBar: false });
  };

  // Numeerinen vertailu suhteellisella toleranssilla (tehtävien tarkistukseen).
  window.numClose = function (a, b, relTol) {
    relTol = relTol == null ? 0.01 : relTol;
    if (!isFinite(a) || !isFinite(b)) return false;
    var scale = Math.max(1, Math.abs(b));
    return Math.abs(a - b) <= relTol * scale;
  };

  // Lue käyttäjän vastaus numeroksi (hyväksy pilkku desimaalierottimena, poista välit).
  window.parseNum = function (str) {
    if (str == null) return NaN;
    return parseFloat(String(str).trim()
      .replace(/\s+/g, "")
      .replace(/[−–‒]/g, "-") // unicode-miinus / ajatusviiva → tavallinen miinus
      .replace("+", "")
      .replace(",", "."));
  };

  window.randInt = function (lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); };
  window.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };

  /* ---------- Edistyminen (localStorage) ---------- */
  var PKEY = "abitreeni.progress.v1";
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { return {}; }
  }
  function saveProgress(p) { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {} }
  function markSolved(id) {
    var p = loadProgress();
    p[id] = (p[id] || 0) + 1;
    saveProgress(p);
    buildNav(); // päivitä ✓-merkinnät
  }

  /* ---------- Navigaatio ---------- */
  function buildNav() {
    var p = loadProgress();
    var nav = document.getElementById("sidebar");
    var cur = location.hash;
    var html = "";
    Object.keys(CATS).forEach(function (cat) {
      var ids = Object.keys(TOPICS).filter(function (id) { return TOPICS[id].category === cat; });
      if (!ids.length) return;
      html += '<div class="nav-group"><h4>' + CATS[cat] + "</h4>";
      ids.forEach(function (id) {
        var t = TOPICS[id];
        var active = cur === "#/t/" + id ? " active" : "";
        var done = p[id] ? '<span class="done" title="' + p[id] + ' tehtävää ratkaistu">✓</span>' : "";
        html += '<a class="nav-link' + active + '" href="#/t/' + id + '">' +
          '<span class="dot ' + cat + '"></span>' + t.title + done + "</a>";
      });
      html += "</div>";
    });
    nav.innerHTML = html;
  }

  /* ---------- Tehtäväkortti (yleinen, toimii minkä tahansa aiheen makeExercise():n kanssa) ---------- */
  function renderExercise(topic, mount) {
    var card = document.createElement("div");
    card.className = "card exercise";
    mount.appendChild(card);
    var cur;

    function fresh() {
      cur = topic.makeExercise();
      card.innerHTML =
        '<h2 style="margin-top:0">Harjoitus</h2>' +
        '<div class="q">' + cur.promptHTML + "</div>" +
        '<div class="answer-row">' +
        '<input type="text" class="ans" placeholder="' + (cur.placeholder || "vastaus") + '" autocomplete="off">' +
        '<button class="btn check">Tarkista</button>' +
        '<button class="btn ghost next">Uusi tehtävä</button>' +
        "</div>" +
        '<div class="feedback"></div>' +
        (cur.hintHTML ? '<div class="hint">' + cur.hintHTML + "</div>" : "");
      wire();
    }
    function wire() {
      var input = card.querySelector(".ans");
      var fb = card.querySelector(".feedback");
      function check() {
        var ok = cur.check(input.value);
        if (ok) {
          fb.className = "feedback good";
          fb.innerHTML = "✔ Oikein! " + (cur.answerHTML ? "" : "");
          markSolved(topic.id);
        } else {
          fb.className = "feedback bad";
          fb.innerHTML = "✗ Ei aivan. Oikea vastaus: " + (cur.answerHTML || "—") +
            '  <button class="btn ghost retry" style="margin-left:8px">Yritä uudelleen</button>';
          var r = fb.querySelector(".retry");
          if (r) r.onclick = function () { fb.textContent = ""; fb.className = "feedback"; input.value = ""; input.focus(); };
        }
      }
      card.querySelector(".check").onclick = check;
      card.querySelector(".next").onclick = fresh;
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
      input.focus();
    }
    fresh();
  }

  /* ---------- Reititys ---------- */
  function renderHome() {
    var el = document.getElementById("content");
    var html = '<h1>Abitreeni</h1>' +
      '<p class="lead">Pitkä matematiikka ja kemia yhdistettynä — käytännön esimerkein. ' +
      'Valitse aihe: teoria, interaktiivinen kuvaaja ja loputtomasti arvottuja harjoituksia.</p>';
    Object.keys(CATS).forEach(function (cat) {
      var ids = Object.keys(TOPICS).filter(function (id) { return TOPICS[id].category === cat; });
      if (!ids.length) return;
      html += "<h2>" + CATS[cat] + "</h2><div class='grid'>";
      ids.forEach(function (id) {
        var t = TOPICS[id];
        html += '<a class="tile" href="#/t/' + id + '"><div class="card">' +
          '<span class="tag ' + cat + '">' + CATS[cat].replace("★ ", "") + "</span>" +
          "<h3>" + t.title + "</h3><p>" + (t.blurb || "") + "</p></div></a>";
      });
      html += "</div>";
    });
    el.innerHTML = html;
  }

  function renderTopic(id) {
    var el = document.getElementById("content");
    var t = TOPICS[id];
    if (!t) { el.innerHTML = "<h1>Aihetta ei löytynyt</h1><p><a href='#/'>Takaisin etusivulle</a></p>"; return; }
    el.innerHTML =
      '<span class="tag ' + t.category + '">' + CATS[t.category].replace("★ ", "") + "</span>" +
      "<h1>" + t.title + "</h1>" +
      (t.blurb ? '<p class="lead">' + t.blurb + "</p>" : "");
    var body = document.createElement("div");
    el.appendChild(body);
    try { t.render(body); } catch (e) { body.innerHTML = "<p class='bad'>Virhe aiheen piirrossa: " + e.message + "</p>"; }
    if (typeof t.makeExercise === "function") renderExercise(t, el);
    document.getElementById("content").scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function route() {
    var h = location.hash || "#/";
    if (h.indexOf("#/t/") === 0) renderTopic(h.slice(4));
    else renderHome();
    buildNav();
    document.getElementById("sidebar").classList.remove("open");
  }

  /* ---------- Teema ---------- */
  function initTheme() {
    var saved = localStorage.getItem("abitreeni.theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    document.getElementById("themeToggle").onclick = function () {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark" ||
        (matchMedia("(prefers-color-scheme: dark)").matches &&
          document.documentElement.getAttribute("data-theme") !== "light");
      var next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("abitreeni.theme", next);
      route(); // piirrä kuvaajat uudelleen teemaväreillä
    };
  }

  /* ---------- Käynnistys ---------- */
  function boot() {
    initTheme();
    document.getElementById("navToggle").onclick = function () {
      document.getElementById("sidebar").classList.toggle("open");
    };
    window.addEventListener("hashchange", route);
    route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
