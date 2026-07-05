# Abitreeni — pitkä matikka + kemia

Interaktiivinen harjoitussivusto YO-kokeisiin. Yhdistää **pitkän matematiikan** ja **kemian**
käytännön esimerkein: derivaatta, funktiot, titrauskäyrät, reaktionopeus. Pelkkää staattista
HTML/CSS/JS:ää — toimii GitHub Pagesilla ilman mitään käännösvaihetta.

Idea: kemiassa matematiikka esiintyy luonnostaan (reaktionopeus = derivaatta, titrauskäyrä =
funktio, hajoaminen = eksponentti + logaritmi). "Sillat"-aiheet näyttävät nämä yhteydet.

## Sisältö nyt

- **Matematiikka:** Funktiot ja derivaatta (paraabeli + derivaatta, arvotut tehtävät)
- **Sillat:** Derivaatta = reaktionopeus · Titrauskäyrä (happo–emäs)

Jokaisessa aiheessa: teoria + interaktiivinen kuvaaja (liukusäätimet) + loputtomasti arvottuja
harjoituksia, joissa automaattitarkistus. Edistyminen tallentuu selaimeen (localStorage).

## Kokeile paikallisesti

Avaa `index.html` selaimessa. (Suositus: pieni paikallinen palvelin, ettei selaimen tietoturva
estä skriptejä.)

```bash
# mikä tahansa näistä:
python -m http.server 8000        # → http://localhost:8000
npx serve .
```

## Julkaise GitHub Pagesiin

1. Luo GitHubiin uusi repo (esim. `abitreeni`) ja työnnä tämä kansio sinne:
   ```bash
   git init
   git add .
   git commit -m "Abitreeni starter"
   git branch -M main
   git remote add origin https://github.com/<käyttäjä>/abitreeni.git
   git push -u origin main
   ```
2. GitHubissa: **Settings → Pages → Build and deployment → Source: _Deploy from a branch_**,
   valitse **`main`** ja kansio **`/ (root)`**, tallenna.
3. Sivu ilmestyy osoitteeseen `https://<käyttäjä>.github.io/abitreeni/` noin minuutissa.

> Repo sisältää `.nojekyll`-tiedoston, joka kertoo Pagesille "älä aja Jekyllia". Se on tärkeä,
> koska muuten alaviivalla alkavat tiedostot (kuten `js/topics/_MALLI.js`) jätettäisiin pois.

## Lisää uusi aihe (5 min)

1. Kopioi `js/topics/_MALLI.js` → esim. `js/topics/tasapaino.js`.
2. Muuta `id`, `title`, `category` (`matematiikka` | `kemia` | `sillat`), `blurb` ja sisältö.
3. Lisää `index.html`:ään rivi `<script src="js/topics/tasapaino.js"></script>` **ennen** `app.js`:ää.

Navigaatio, etusivukortti ja tehtäväkortti syntyvät automaattisesti — `app.js` ei tarvitse muutoksia.
Apufunktiot (`tex`, `plot`, `numClose`, `parseNum`, `randInt`, `pick`) on dokumentoitu `_MALLI.js`:ssä.

## Hyviä seuraavia aiheita

- Kemia: stoikiometria, kemiallinen tasapaino (Kc), pH ja puskurit, hapetusluvut
- Matikka: integraali (pinta-ala = ainemäärä nopeudesta), logaritmit, todennäköisyys
- Sillat: radioaktiivinen hajoaminen (t½, ln), Arrhenius (k = A·e^(−Ea/RT)), ideaalikaasu pV = nRT

## Tekniikka

- **KaTeX** (CDN) — kaavat
- **Plotly basic** (CDN) — kuvaajat
- Vanilla JS, hash-reititys (`#/t/<id>`), ei riippuvuuksia asennettavaksi

## Tekijänoikeus

Älä kopioi MAOL-taulukoita tai kustantajien tehtäviä sivustolle. Kaavat ja itse laaditut /
arvotut tehtävät ovat ok; linkitä virallisiin taulukoihin.
