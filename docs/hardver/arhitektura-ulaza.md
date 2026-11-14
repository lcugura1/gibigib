# Arhitektura ulaza

Kako član ulazi u teretanu i koji dio sustava što radi. Sažetak odluka O-021 do O-027 ([odluke](../odluke.html#hardver)). Oznake: **odluka** = prihvaćeno ili privremeno u odlukama; **dizajn** = prijedlog u skladu s odlukama, još ne potvrđen i ne programiran; **postoji** = već u kodu. Formati koje očekuju uređaji i provajderi su u [ugovorima](ugovori/akuvox-a08s.md).

## Načelo

O svakom ulasku odlučuje naš BE. Čitač ili brava nikad sami ne odlučuju (osim što su odbijanje i istek zadani na uređaju). Odluka se sastoji od provjere koda, članarine, pauze i anti-passbacka, a svaki pokušaj ostaje u `EntryEvent`.

## Komponente

| Komponenta | Uloga | Status |
|---|---|---|
| Mobilna aplikacija | prikazuje rotirajući QR (20 znamenki, 45 s) i, za PIN tok, PIN | postoji (QR); PIN dizajn |
| BE (`apps/api`) | provjera koda, članarina, anti-passback, evidencija, popunjenost | postoji (`POST /entry/scan`, ključ uređaja) |
| Akuvox A08S | čitač QR-a i numpad; šalje sirovi kod | odluka O-021 |
| SR01 | relej unutra; zapor je spojen samo na njega; veza s čitačem RS-485 | odluka O-022 |
| Električni zapor | 12 V DC, fail-secure, u okviru | odluka O-024 (model nakon pregleda vrata) |
| Lokalni most | proces u mreži teretane (Raspberry Pi): prima callback čitača, zove BE, okida SR01 | odluka O-022; kod za Akuvox ne postoji (`apps/bridge` je Hikvision) |
| Tedee keypad + brava + Bridge | alternativa za klijente koji žele samo PIN | odluka O-023 |
| Adapteri provajdera | MultiSport, PassSport (i Wellhub kao referenca) | odluka O-026; čeka provajdere |

## Tok A: Akuvox, naš član (QR ili PIN)

```
Mobitel (QR / PIN)
   -> A08S ---- http (LAN) ----> lokalni most ---- https + ključ uređaja ----> BE (odluka, EntryEvent)
                                      |                                           |
                                      |<------------- ok / odbijeno --------------+
                                      |-- http: /fcgi/OpenDoor?...&DoorNum=SB --> A08S ---RS-485---> SR01 ---> zapor
   A08S <---- {"isvalid": true/false} ----+  (za povratnu informaciju, rok 3 s)
```

1. Čitač pročita QR ili PIN i pošalje ga mostu (callback). Rok odgovora čitaču je 3 s.
2. Most šalje BE-u `POST /entry/scan` s `Authorization: Device <ključ>` i `{ "code": "..." }`. **Postoji.** Odgovor `{ ok, message, memberName? }`.
3. Na `ok:true` most okida SR01 naredbom čitaču i vraća `isvalid:true`; inače `isvalid:false`.
4. BE zapisuje `EntryEvent` i, uz odobren ulaz, `Attendance` i `DoorCommand` (koji uz most nitko ne preuzme i istekne za 5 s).

Razlog za most: callback ne podržava (dokumentirano) HTTPS niti zaglavlje `Device`, nije dokumentirano koji relej otvara odobrenje, a zapor mora biti iza SR01. Detalji: [ugovor Akuvox](ugovori/akuvox-a08s.md).

## Tok B: Tedee, samo PIN

```
Mobitel -- GET PIN --> BE -- POST /my/lock/{id}/pin (red po bravi) --> Tedee cloud --> Bridge --BLE--> brava
član utipka PIN na Keypad PRO -> brava otključa; BE polla /my/deviceactivity (UnlockedByPin, pinAlias) -> EntryEvent
```

- BE izdaje PIN (5-8 znamenki) s `endDate` nekoliko minuta; alias = ID člana ili sesije. Istekli PIN-ovi brišu se sami.
- Dolazak se bilježi iz zapisnika aktivnosti (nema webhooka za PIN). Dizajn: BE provjerava članarinu i anti-passback pri **izdavanju** PIN-a, a zapisnik potvrđuje stvarno korištenje.
- Nema QR-a i nema odluke u trenutku unosa: brava odlučuje lokalno. Detalji: [ugovor Tedee](ugovori/tedee.md).

## Tok C: MultiSport i PassSport (O-026)

1. Isti čitač (Akuvox) šalje sirovi sadržaj. BE prepozna vrstu: naš token (20 znamenki) ili kod provajdera (format nepoznat).
2. Za provajdera BE zove adapter (`validate`); poziv s vremenskim ograničenjem oko 2 s zbog roka od 3 s.
3. BE stvara gost-profil (broj kartice ili ID provajdera); član ne radi ništa u našoj aplikaciji.
4. Ako se vrata ne otvore, adapter poništava posjetu kod provajdera (`cancel`).
5. Ništa se ne programira dok teretana ne dobije od provajdera pristupne podatke i specifikaciju. Tedee paket ovo ne podržava (keypad ne zove BE).

## Što u kodu postoji i što treba

| Postoji | Napomena |
|---|---|
| `POST /entry/scan` (`apps/api/src/routes/entry.ts`, `services/entry.ts`) | ključ uređaja vrste `SCANNER`, 60 zahtjeva u minuti po uređaju, `entryScanSchema` (kod 1-200 znakova), prefiks `gibigib:` se skida |
| `Device` (`SCANNER`, `DOOR`), `DoorCommand`, `GET /device/commands` | polling vrata (demo i ESP32); za Akuvox most se ne koristi |
| `EntryEvent` | nema `gymId` ni izvora ulaza; `getOccupancy` uzima prvu teretanu i filtrira kroz `device.gymId` |
| `apps/bridge` | samo Hikvision (ISAPI, alertStream); zamjenjuje se |

| Treba (dizajn, nije odlučeno detaljno) | Zašto |
|---|---|
| Akuvox most (callback, poziv BE-a, `OpenDoor`, povratni `isvalid`, Action URL i tamper, daljinsko otvaranje iz admina) | O-022 |
| `EntryEvent.gymId` i izvor ulaza (naš član, MultiSport, PassSport, Tedee PIN) | PIN tok i gosti nemaju `Device`; popunjenost mora biti po teretani (`getOccupancy(gymId)`) |
| PIN kao vrsta tokena (8 znamenki, rotirajući, jedinstven među aktivnim po teretani) | PIN na A08S i Tedee; BE/most mora sam ograničavati pokušaje jer A08S nema dokumentirano zaključavanje |
| Konfiguracija po teretani (vrsta hardvera, ID uređaja, Tedee ključ i `lockId`, pristupni podaci provajdera, šifrirano) | više teretana s različitim stackovima i ugovorima |
| `TedeePinProvider` (red po bravi, ponavljanje kod 409, polling zapisnika uz 700 zahtjeva/h) | O-023 |
| Gost-profil i adapteri provajdera (`validate`, `cancel`) | O-026, čeka provajdere |

## Vremenski proračun (čitač čeka 3 s)

Callback prema mostu i natrag, `POST /entry/scan` (nekoliko upita i transakcija s advisory lockom po članu) i odgovor čitaču moraju stati u 3 s. Dizajn: prvo naš token (baza), provajdera zvati samo ako format odgovara i s ograničenjem oko 2 s. Izmjeriti stvarnim kašnjenjem (test na uređaju).

## Sigurnost i kvarovi

- Zapor samo iza SR01; skidanje čitača sa zida ne otvara vrata.
- HTTP API čitača ograničiti allowlistom na IP mosta; promijeniti zadani `admin`/`admin`.
- Most prema BE-u koristi HTTPS i ključ uređaja (`Authorization: Device`); callback čitača ostaje u LAN-u.
- Nema offline puta: kad BE, most ili internet ne rade, čitač odbija (rok 3 s). Osoblje treba mehanički ključ ili ručno otključavanje; izlaz iznutra uvijek mehanički.
- Tamper čitača javlja se mostu (Action URL) i BE-u.
- Tedee: kad Bridge ili internet ne rade, novi PIN se ne može izdati (428); osoblje ima ručni PIN u keypadu. Tedee navodi da uređaj nije protuprovalna zaštita.

## Otvoreno za odluku prije koda

1. Format callbacka (jedan `codeKey` s kosim crtama ili zasebni parametri) i raspored varijabli: ovisi o testu na uređaju.
2. PIN za naše članove: duljina, rotacija, jedinstvenost, ograničenje pokušaja i je li PIN dio `EntryToken` ili zasebna tablica.
3. Izvor ulaza i `gymId` u `EntryEvent`, te kako se računa popunjenost kad dio ulazaka dolazi s Tedeea i provajdera.
4. Anti-passback za goste provajdera (provajder već provodi jednu posjetu dnevno).
5. Ostaje li `DoorCommand` i polling za Akuvox (vjerojatno ne).
