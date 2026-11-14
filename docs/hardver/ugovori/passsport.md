# Ugovor: PassSport

Što je poznato o provjeri PassSport korisnika na vratima i što NIJE. **Javni API ni dokumentacija ne postoje** (`api.passsport.com` vraća 401, ostali poddomene ne postoje). Sve programsko dolazi od PassSporta nakon zahtjeva teretane ([mail](../partneri/pitanja-i-mailovi.md)). Izvori: [partneri/passsport](../partneri/passsport/istrazivanje.md).

## Poznato

| Stavka | Vrijednost | Izvor |
|---|---|---|
| QR kod u aplikaciji | vrijedi 1 minutu. Ispod njega 8-znamenkasti PIN koji se mijenja svakih 60 s. Snimka zaslona nije moguća | informacija vlasnika projekta iz aplikacije (nema javnog izvora) |
| Povezanost s lokacijom | "QR kod je jedinstven i povezan s vašom trenutnom GPS lokacijom"; licenca je osobna i vezana uz jedan uređaj; jedan ulazak dnevno | [FAQ](https://passsport.com/hr/faq) |
| Pravila posjeta | jedna posjeta dnevno, najviše 60 minuta, otkazivanje u roku od 15 minuta; identifikacija QR-om, jednokratnom lozinkom (OTP), NFC-om ili drugim postupkom koji platforma podržava | [uvjeti korištenja](https://passsport.com/hr/terms-of-use) čl. 3 |
| Što partner koristi | aplikacija **PassSport Scanner** na mobitelu osoblja (skeniranje korisnika, praćenje dolazaka), portal app.passsport.com. Namjenski hardver nije spomenut | [Google Play](https://play.google.com/store/apps/details?id=com.passsport.scanner) |
| Fiksni QR | teretana postavi QR na ulaz ili pult, a član ga skenira u aplikaciji ("Tvoja kartica", kamera). To bilježi dolazak, ali ne otvara vrata; vrata otvara teretanin sustav | opisi lokacija (La Fit, KK Fitness, Powerfit...) |
| Automatski ulaz | aplikacija v2.0.0 (13.11.2024.): "Automatic Entry... facilities that support the 1-click function". U Sloveniji 15 teretana: korisnik skenira kod na kapiji. Kako radi i s kojim kapijama: nedokumentirano | App Store, opisi lokacija |
| Walletap | navodi da se PassSport povezuje s njim: član skenira QR, Walletap provjeri i otvori vrata. Pojedinosti nisu navedene | [Walletap](https://www.walletap.com/membership) |

## Nepoznato (pitati)

Je li PIN ispod QR-a zamjena za QR pri ulazu, i je li jedinstven globalno ili po korisniku i objektu; sadržaj i provjera QR-a; što se provjerava za GPS kad čitač nema GPS; API ili webhook za provjeru i za dolazak (posebno za model u kojem član skenira fiksni QR, jer nam provajder tada mora javiti dolazak da bismo otvorili vrata); autentikacija, kodovi grešaka, ograničenje zahtjeva, testno okruženje; uvjeti i provizija.

## Što to znači za kod (dizajn, ne dokumentirano)

Isti adapter kao za MultiSport (`validate`, `cancel`). Moguća su dva toka: čitač skenira mobitel (provjera preko API-ja) ili član skenira fiksni QR (potreban webhook dolaska). Do odgovora PassSporta ništa se ne programira.
