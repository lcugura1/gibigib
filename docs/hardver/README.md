# Hardver ulaza: dokumentacija

Jedino mjesto s hardverskim odlukama, ugovorima uređaja i provajdera i dokazima. Prije pisanja koda za čitač, most, Tedee ili provajdere pročitati odgovarajući **ugovor**. Formate ne izmišljati: gdje piše "nepotvrđeno" ili "test", format se potvrđuje na uređaju, pa se ugovor ažurira.

## Karta

| Što trebaš | Gdje |
|---|---|
| Zašto smo odabrali taj hardver, status odluka | [odluke.html](../odluke.html#hardver) (O-021 do O-027) |
| Kako sve radi zajedno, što u kodu postoji i što treba | [arhitektura-ulaza.md](arhitektura-ulaza.md) |
| Što klijentu predložiti, cijene, pregled vrata, pilot | [odabir-hardvera.md](odabir-hardvera.md) |
| Format zahtjeva i odgovora (za kod) | [ugovori/](ugovori): [akuvox-a08s](ugovori/akuvox-a08s.md), [tedee](ugovori/tedee.md), [multisport](ugovori/multisport.md), [passsport](ugovori/passsport.md), [wellhub](ugovori/wellhub.md) |
| Dokazi i izvorni PDF-ovi o hardveru | [izvori/akuvox](izvori/akuvox/README.md), [izvori/tedee](izvori/tedee/README.md) |
| MultiSport, PassSport, istraživanje tržišta, pitanja i mailovi | [partneri/](partneri/README.md) |
| Kratki pregled za ljude | [ulaz-hardver.html](../ulaz-hardver.html) |

## Struktura

```
docs/hardver/
  README.md                  ovaj pregled
  arhitektura-ulaza.md       komponente, tokovi, podaci, kvarovi, otvoreno
  odabir-hardvera.md         odabir, cijene, pregled vrata, propisi, pilot
  ugovori/                   što uređaj ili provajder šalje i očekuje (za kod)
  izvori/akuvox/             audit, neovisni dokazi, PDF-ovi
  izvori/tedee/              audit, bilješke priručnika, PDF-ovi
  partneri/                  MultiSport, PassSport, Wellhub, Walletap, Gyms4you
```

## Pravila

- **Ugovor je izvor istine za kod, odluka za razlog, izvori za dokaz.** Isto se ne piše na dva mjesta: ugovor sadrži činjenicu, izvori sadrže odakle dolazi.
- **Oznake:** dokumentirano (piše kod proizvođača), nepotvrđeno (zaključak ili nigdje ne piše), test (potvrđuje se na uređaju). Kad se test napravi, oznaka se zamijeni rezultatom i datumom.
- **Nikad ne izmišljati format** provajdera ili uređaja. Ako nešto ne piše, to je pitanje u [pitanja-i-mailovi.md](partneri/pitanja-i-mailovi.md), a ne pretpostavka u kodu.
- Promjena odluke: u `odluke.html` stara dobiva status "Zamijenjeno" s poveznicom na novu, a ugovor i arhitektura se ažuriraju istodobno.
- Firmware (`.rom`) i druge binarne datoteke ne idu u repozitorij.
- Izvorni PDF-ovi ostaju uz audit koji ih citira, uz datum preuzimanja.

## Stanje (14.11.2026.)

Odluke su donesene na temelju dokumentacije. **Ništa nije isprobano na uređaju.** Za Akuvox nema neovisnog dokaza da callback radi u praksi; za Tedee latencija i oslobađanje mjesta nakon isteka PIN-a nisu poznati. MultiSport i PassSport traže suradnju provajdera. Programiranje nije počelo.
