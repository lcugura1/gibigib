# Ugovor: Akuvox A08S (čitač) i SR01 (sigurnosni relej)

Što uređaj šalje, što očekuje i što prima. Ovo je kontekst za pisanje koda (lokalni most i BE). Izvori: [izvori/akuvox](../izvori/akuvox/README.md). Oznake: **dokumentirano** = piše kod Akuvoxa; **nepotvrđeno** = zaključak ili nigdje ne piše; **test** = mora se potvrditi na uređaju (popis na dnu).

Nijedan dio ovog toka nema neovisnu potvrdu iz prakse (potraga: [neovisni dokazi](../izvori/akuvox/neovisni-dokazi-2026-11-14.md)). Ugovor je zato dokumentiran samo prema Akuvoxu.

## 1. Čitač šalje provjeru našem serveru (Third Party Integration)

Postavka: *Access Control > Relay > Third Party Integration*.

| Stavka | Vrijednost |
|---|---|
| Način "General" | samo QR: `http://{host}:{port}/{putanja}?codeKey={QRCode}&deviceId={DeviceID}` |
| Način "Customize" | QR, kartica i PIN. Primjer predloška: `http://{host}:{port}/{putanja}?codeKey={QRCode}/{Card}/{Pin}&deviceId={DeviceID}` |
| Kad nešto nije predočeno | predložak ostaje doslovno u URL-u. Primjer iz vodiča: `codeKey={QRCode}/123456/{UserID}/{Pin}` kad se pređe kartica. Test: radi li zasebni upitni parametar (`&pin={Pin}`) umjesto jednog `codeKey`-a |
| Varijable na A08 | `{QRCode}`, `{Card}` (i barkod, vidi niže), `{Pin}`, `{DeviceID}`, `{Token}`, `{Type}`, `{Time}`. Varijable nisu zamjenjive između modela |
| Remote Verification | kućice QR, kartica, PIN. Označena vrsta se prosljeđuje "as-is, with no local verification performed on the device" |
| Device ID | zadaje treći server (mi); dodaje se u URL |
| HTTP metoda | **nije navedena**; svi primjeri su upit u URL-u (vjerojatno GET). Test |
| Autentikacija | Basic ili Digest (Authorization Mode). Raspored zaglavlja nije naveden. Samo Digest MD5 |
| Protokol | svi primjeri su `http://`. **HTTPS nije dokumentiran** |
| Kodiranje QR-a u URL-u | nije navedeno. Akuvoxov primjer šalje 44 znaka s `/ + =` bez kodiranja. Naš QR je 20 znamenki |
| Rok odgovora | **3 s**, nakon čega se pristup odbija |
| Odgovor uspjeh | JSON: `{"isvalid": true}`, `{"isvalid": 1}` ili `{"validation_result": "1"}` |
| Odgovor neuspjeh | `{"isvalid": false}`, `0` ili `{"validation_result": "0"}` |
| Status i content-type odgovora | nisu navedeni (slati 200 i `application/json`) |
| Server nedostupan, istek, neispravan JSON | pristup se odbija. Offline predmemorije i povratka na lokalno nema. HTTP 4xx/5xx i ponavljanje: nije navedeno |
| Što uređaj radi na uspjeh | "opens the door": **koji relej, nije navedeno** (nema polja za odabir releja). Zato O-022: zapor je na SR01, a okida ga most |

### Firmware

| Mogućnost | Prva verzija |
|---|---|
| Osnovni callback | 108.30.10.139 (Beta, 20.12.2024.) |
| Customize (QR + kartica) | prisutan u vodiču za 108.30.11.22 |
| PIN (`{Pin}`), dvofaktorski | 108.30.11.122 (Beta, 1.4.2026.) |
| Authorization Mode (Basic/Digest), Multi-factor Request Mode | 108.30.11.228 (Beta, 17.7.2026.) |
| Barkod kao `{Card}` | 108.30.12.9 (Beta, 31.8.2026.) |

- Stabilni **Release 108.30.11.61** i **LTS 108.30.11.41** su ispod .122. Vjerojatno imaju osnovni callback za QR, bez PIN-a i autentikacije (nepotvrđeno: provjera instalacijom `.rom` datoteke).
- Beta je javno preuzimanje: `https://maintenance.akuvox.com/firmware/release/beta?model_name=A08` (npr. `108.30.12.17.rom`). Za A08S ne postoji zaseban unos, firmware je isti ("A08", 108.30.x). `.rom` datoteke ne idu u repozitorij.
- Akuvox preporučuje Release/LTS.

## 2. Naš lokalni most otvara vrata (server prema čitaču)

Zapor je spojen na SR01, pa most okida SR01 HTTP naredbom čitača.

| Stavka | Vrijednost |
|---|---|
| Uključenje | *Access Control > Relay > Open Relay Via HTTP* (korisničko ime i lozinka) |
| SR01 A / B | `http://{IP čitača}/fcgi/OpenDoor?action=OpenDoor&DoorNum=SA` ili `SB` |
| Lokalni relej | `DoorNum=1` (Relay A) ili `2` |
| High Security Mode uključen | prihvaća se samo `http://korisnik:lozinka@IP/fcgi/OpenDoor?action=OpenDoor&DoorNum=1` ili isti bez vjerodajnica. Stari oblik `fcgi/do?action=OpenDoor&UserName=..&Password=..&DoorNum=1` radi samo uz isključen mod |
| SR01 i `SA`/`SB` | `SA` = Security Relay A (napajanje preko releja čitača), `SB` = Security Relay B (RS-485). Za naš spoj RS-485 vrijedi `SB`. **Test:** koji od `SA`/`SB` aktivira naš SR01 |

HTTP API čitača (*Setting > HTTP API*): ako je isključen, zahtjevi dobivaju 403. Autentikacija: None (samo test), Allowlist (do 5 IP adresa, preporučeno za LAN), Basic, Digest (MD5). Zadano `admin`/`admin` mijenjamo. Priručnik serije R29 (2022., ne vrijedi nužno za A08S) navodi i `GET /api/relay/trig?mode=1&num=1&level=1&delay=5` s `num` 1-3 (nema SR01). Objedinjeni API ima `/new_api/doorlog/get` i `/new_api/eventlog/get` (A08 od 108.30.10.236, moguće tipfeler).

## 3. Što čitač javlja serveru (događaji i zapisi)

- **Action URL** (postavka *Action URL* u sigurnosnim postavkama; točan izbornik na A08S provjeriti na uređaju): događaji relej aktiviran/zatvoren (`$relay1status`), ulaz aktiviran/zatvoren (`$input1status`), valid/invalid code (`$code`), valid/invalid card (`$card_sn`), valid/invalid QR (`$unlocktype`: "QR Code" odnosno "Null", sadržaj QR-a se ne šalje), tamper (`$alarm status` ili `$alarmstatus`, spelling nepotvrđen). Samo Digest, vjerojatno samo GET. Nije navedeno pale li se valid/invalid događaji kad odlučuje treći server.
- **Real-time upload zapisa** (od 108.30.11.223, Beta): *Remote Door Log Enabled*, URL `http://`, `https://` ili `ftp://`, Basic (zadano) ili Digest, odabir vrsta događaja. Format poruke, metoda i ponavljanje nisu navedeni. Zabranjeni znakovi u URL-u: `% ' = ! $ ?`.
- **Relej "Action to Execute: HTTP"** šalje poruku pri aktivaciji releja.
- **Kapacitet:** 100.000 zapisa na uređaju; 20.000 korisnika i PIN-ova.

## 4. Hardver i ožičenje

| Stavka | Vrijednost |
|---|---|
| Čitač | A08S 140 × 50 × 26,7 mm, IP65, IK09 (stariji datasheet IK07), -20 do +55 °C |
| Priključci | relej NO/COM/NC ("Door Lock, ≤DC 30V", dioda uz brave), 2 ulaza (IN1/GND, IN2/GND), Wiegand, RS-485 (A/B/GND), napajanje |
| Napajanje | PoE (datasheet 802.3af, KB 802.3at; PoE traži hardversku verziju 108.2.0.0.0 ili višu) ili 12 V DC 1 A. Potrošnja nije objavljena |
| Kabel 12 V | AWG 20 do 50 m, 22 do 40 m, 24 do 30 m, 26 do 15 m |
| Ugradnja | zidna kutija: otvor 50 × 29 × 23 mm; ugradna: 135 × 42 × 38 mm; bušenje 6 mm; najviše 1100 mm do dna panela |
| SR01 | unutra, na sigurnoj strani; adapter najmanje 12 V/0,6 A; izlaz 12 V najviše 0,5 A samo uz RS-485; RS-485 upletena parica do 300 m; vlastiti ulaz za tipku izlaza; dioda 1 A/200 V uz induktivno opterećenje |
| Relej A08S i SR01 | 30 V, 2 A (AC/DC nije navedeno). Zapor mora biti 12 V DC |
| Postavke SR01 | *Access Control > Relay > Security Relay*: Relay ID, Connect Type, Trigger Delay, Hold Delay, Relay Name, Enabled; *Device > RS485 > Apply RS485 Setting To* = Others; uparivanje: tipka više od 5 s (crvena LED), zelena LED treperi sporo = normalno, brzo = relej otvoren. Veza preko 12 V izlaza (Security Relay A) se ne preporučuje iz sigurnosnih razloga |
| Tipka izlaza | ulaz u *Access Control > Input* (razina okidanja, Execute Relay, odgoda 0-300 s); isti ulaz ne može biti i senzor vrata i tipka izlaza |
| Senzor vrata | *Door Sensor* u postavkama releja; opcija *Relock When Door Closed* (od 108.30.11.218, Beta, zadano isključeno) |
| Tamper | gravitacijski senzor, prag 0-127 (zadano 32), *Disarm* u web sučelju, razoružava se ponovnim pokretanjem |

## 5. Čitanje QR-a i PIN-a na uređaju

- **QR skener** samo na A08S (A08K ga nema). *Access Control > QR Code Setting*: Indoor/Outdoor mode. Nije objavljeno: udaljenost, vidno polje, vrijeme čitanja, svjetlina, najveća duljina, simbologije. Barkod stiže kao `{Card}` tek od 108.30.12.9. Ugradnja: najmanje 2 m od svjetla i 3 m od prozora i vrata (za unutarnju ugradnju).
- **Numpad:** znamenke 0-9 i dvije tipke s ikonama (jedna je "Clear", druga nije opisana); **nema `*` ni `#`**. Lokalni PIN 2-8 (privatni) i 3-8 (javni) znamenki, ne počinjati s 9. Nije navedeno: kad se unos smatra završenim, najveća duljina u udaljenom modu, zaključavanje pri pogrešnim PIN-ovima, timeout između znamenki. **BE/most mora sam ograničavati pokušaje.** Povratna informacija pri neuspjehu: plava LED treperi kratko.

## 6. Testovi na uređaju koji zatvaraju nepotvrđeno

| # | Test | Zašto |
|---|---|---|
| 1 | Zapis svakog zahtjeva callbacka (metoda, zaglavlja, URL, kodiranje) | metoda i raspored nisu dokumentirani |
| 2 | Zasebni upitni parametri umjesto `codeKey` s kosim crtama | lakše prepoznavanje QR/PIN/kartica |
| 3 | Naš 20-znamenkasti QR s mobitela, različita svjetlina i kut | optika nije objavljena |
| 4 | 8-znamenkasti PIN na numpadu: potvrdna tipka, automatsko slanje, najveća duljina, PIN koji počinje s 9 | nije dokumentirano |
| 5 | `DoorNum=SA` i `DoorNum=SB` prema SR01, uz lokalni relej odspojen | koji aktivira SR01 |
| 6 | Što se događa pri `isvalid:true` s lokalnim relejem: otvara li se išta | koji relej odgovara na odluku servera |
| 7 | Stabilni 108.30.11.61 naspram Beta 108.30.12.17: PIN, autentikacija, QR | što je u Release/LTS |
| 8 | Odgovor sporiji od 3 s i neispravan JSON | ponašanje kod grešaka |
| 9 | `https://` URL za callback i zapis uploada | HTTPS |
| 10 | Pale li se Action URL valid/invalid događaji pri udaljenoj provjeri; format uploada zapisa | evidencija |
| 11 | Zaključavanje pri pogrešnim PIN-ovima | nije dokumentirano |
