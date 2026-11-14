# Akuvox A08S: audit čitača QR-a, numpada, tampera, događaja i ožičenja (14.11.2026.)

Izvor: Akuvoxove KB stranice (kao Markdown), službeni PDF-ovi, proizvodna stranica, Unified HTTP API dokument i Akuvoxova Google tablica s Action URL događajima, čitani 14.11.2026. Oznake: potvrđeno = pročitano na stranici, nepotvrđeno = zaključak. Ništa nije testirano na uređaju.

## Najvažniji nalazi

1. **Firmware:** treće-strani server na A08 naveden je od 108.30.11.122, Basic/Digest autentikacija i način zahtjeva od 108.30.11.228. Sve gradnje 108.30.11.1xx/2xx i 108.30.12.x označene su "(Beta)". Aktualni Release je 108.30.11.61, LTS 108.30.11.41. Da Release nema značajku je zaključak iz brojeva verzija (nepotvrđeno).
2. **Tvrdi rok od 3 s**, nakon kojeg se pristup odbija.
3. **Barkodovi** se čitaju tek od 108.30.12.9 (Beta) i stižu kao `{Card}`, ne `{QRCode}`.
4. **Za PIN nije dokumentirano:** ograničenje pokušaja, zaključavanje, tipka za potvrdu, maksimalna duljina. **BE mora sam ograničavati pokušaje.**
5. **Koji relej otvara `isvalid:true` nije dokumentirano** (lokalni Relay A ili SR01).
6. SR01 ima vlastiti ulaz za tipku izlaza na dijagramu ožičenja.
7. **Proturječja:** PoE 802.3af (datasheet) naspram 802.3at (KB); izlaz 12 V 600 mA naspram 500 mA; IK07 (stariji datasheet) naspram IK09.

## Q1. QR skener

| Stavka | Pouzdanost | Dokaz |
|---|---|---|
| A08S ima QR, A08K nema | Potvrđeno | [model specification](https://knowledge.akuvox.com/docs/model-specification-23): "QR Code Unlock ✔ X" |
| Barkodovi | Potvrđeno, samo Beta | [integracija](https://knowledge.akuvox.com/docs/integration-with-third-party-access-control-server): "Barcode authentication is supported on A08 devices running firmware 108.30.12.9 or later... transmitted using the {Card} variable" |
| Popis simbologija (Code128 itd.) | Nije navedeno | |
| Maksimalna duljina QR-a, verzija, znakovi | Nije navedeno | Samo "{QRCode} is replaced with the actual QR content" |
| Primjer sadržaja | Potvrđeno (slika) | Slika "Received URL Example" prikazuje 44 znaka sa `/ + =` bez kodiranja, pa je naš 20-znamenkasti broj unutar onoga što Akuvox prikazuje |
| Kodiranje URL-a, najveća duljina URL-a, HTTPS za URL provjere | Nije navedeno | Svi primjeri su `http://` |
| Način rada Indoor/Outdoor | Potvrđeno | [Door-opening](https://knowledge.akuvox.com/docs/door-unlock-configuration-25): *Access Control > QR Code Setting* |
| Uključivanje QR-a | Potvrđeno | *Access Control > Relay > Open Relay via QR Code* |
| Čitanje s ekrana mobitela | Potvrđeno primjerom, bez specifikacije | Službena slika prikazuje QR na ekranu mobitela; [dinamički QR](https://knowledge.akuvox.com/docs/open-the-door-via-dynamic-qr-code) navodi A08, "refreshes automatically every 3 minutes" |
| Udaljenost čitanja, vidno polje, vrijeme čitanja, svjetlina | Nije navedeno | |
| Postavljanje | Potvrđeno | Quick guide: najmanje 2 m od svjetla i 3 m od prozora i vrata (za unutarnju ugradnju) |
| Hardver | Potvrđeno | Kamera i TOF senzor |
| Lokalni QR je 8-znamenkasti PIN | Potvrđeno | "QR code with an 8-digit PIN" |
| Ispravak QR otključavanja | Potvrđeno | 108.30.11.60 (Release): "Fixed an issue with QR code unlocking" |

## Q2. Numpad i PIN s udaljenom provjerom

| Stavka | Pouzdanost | Dokaz |
|---|---|---|
| Lokalni PIN | Potvrđeno | Javni PIN 3-8 znamenki, privatni 2-8 |
| PIN se prosljeđuje serveru | Potvrđeno | [integracija](https://knowledge.akuvox.com/docs/integration-with-third-party-device-17): "After a QR code scan, card swipe, or PIN entry, the device... sends the request to the server" |
| Kad se unos smatra završenim (potvrda, automatski, timeout) | Nije navedeno | |
| Najveća duljina u udaljenom modu (više od 8?) | Nije navedeno | Granice 2-8 i 3-8 vrijede za lokalne PIN-ove |
| Raspored tipki | Potvrđeno samo slikama | Znamenke 0-9 i dvije tipke s ikonama (X i još jedna), **nema `*` ni `#`**. Stranica o jačini zvuka navodi "Clear Button" |
| Tipka za potvrdu | Nepotvrđeno za A08 | Opći članak o Wiegandu: "press the PIN code and then the Confirm tab" |
| Timeout između znamenki | Nije navedeno za A08 | Za A13S: 5 s zadano |
| Zaključavanje/ograničenje pokušaja | **Nije navedeno** | |
| Povratna informacija pri neuspjehu | Potvrđeno | Plava LED treperi kratko |
| Ograničenje uspješnih otvaranja | Potvrđeno | "Restriction Time(Sec)": isti korisnik ne može otvoriti dvaput unutar vremena |
| PIN koji počinje s 9 | Potvrđeno za lokalne/cloud PIN-ove | "Avoid starting the PIN code with 9". Odnosi li se na udaljene: nije navedeno |

**Posljedica za nas:** naš 8-znamenkasti PIN ne smije počinjati s 9 dok se to ne ispita, a numpad nema `#`, pa treba provjeriti šalje li uređaj zahtjev nakon potvrdne tipke ili automatski.

## Q3. Javni PIN naspram udaljene provjere

- Potvrđeno: "In all cases, the specified credential is forwarded to the server as-is, with no local verification performed on the device." U modu "Any Method" opcije su QR, kartica i PIN kao zasebni potvrdni okviri. Javni PIN ima vlastiti "Enabled".
- Nije navedeno: izričita rečenica o javnom PIN-u kad je PIN udaljeno provjeravan, što se događa s neoznačenom vrstom vjerodajnice i bilo kakav lokalni povratak kad server nije dostupan.

## Q4. Tamper

- Gravitacijski senzor ([Security](https://knowledge.akuvox.com/docs/security-34)): konfigurira se uključivanje, prag (zadano 32, raspon 0-127), glasnoća i Disarm.
- HTTP prema serveru preko Action URL "Tamper Alarm Triggered": `Http://server ip/tampertrigger=$alarm status` (u Akuvoxovoj tablici varijabla je napisana `$alarmstatus`: provjeriti na uređaju).
- Ostalo: LED trepće, zvuk, zapis događaja. Nije navedeno: relej ili lockdown pri tamperu, e-mail specifičan za tamper, događaj "tamper cleared".
- Nakon ponovnog pokretanja uređaj se razoružava.

## Q5. Događaji i evidencija

- **Real-time upload zapisa** na udaljeni server (108.30.11.223, Beta): "When enabled, the device can send access records in real time to the designated remote server." URL počinje s `http://`, `https://` ili `ftp://`; autentikacija None, Basic (zadano) ili Digest. Format poruke, metoda i ponavljanje nisu navedeni.
- **Action URL događaji za A08:** relej aktiviran/zatvoren, ulaz aktiviran/zatvoren, valid/invalid code (`$code`), valid/invalid card (`$card_sn`), tamper, valid/invalid QR (`$unlocktype`, sadržaj QR-a se ne šalje). Samo Digest autentikacija; vjerojatno samo GET. Nije navedeno pale li se valid/invalid događaji kad odluku donosi treće-strani server.
- **Relej "Action to Execute: HTTP"** šalje HTTP poruku pri aktivaciji releja.
- **Povlačenje (pull):** Unified HTTP API (`/new_api/doorlog/get`, `/new_api/eventlog/get`) navodi A08 i ima `RelayID` ("A, B, C, SA, SB") i `Type` koji uključuje "PIN, Public PIN, QRCode, HTTP, Input, Server". Minimalna verzija prema stranici je 108.30.10.236 (moguće tipfeler za 108.30.11.236).
- Kapacitet zapisa na uređaju: 100.000.

## Q6. Ulazi, senzor vrata, tipka izlaza, SR01

- Jedan relej, dva ulaza (IN1/GND i IN2/GND). Na dijagramu oba prikazana kao "Exit Button". Kontakt vrata nije nacrtan.
- Tipka izlaza: ulaz se postavlja u *Access Control > Input* (razina okidanja, "Execute Relay", odgoda).
- Senzor vrata: *Door Sensor* u postavkama releja, uz opciju **"Relock When Door Closed"** (108.30.11.218, Beta, zadano isključeno).
- Alarm "Door Opened" i definicija neovlaštenog otvaranja (ulaz aktiviran prije releja).
- Nepotvrđeno za A08: isti ulaz ne može služiti i kao senzor vrata i kao tipka izlaza (navedeno za A13/A15), pa planirati jedan ulaz za svaki.
- **SR01:** A08 ga podržava od 108.30.1.17. SR01 ima vlastiti ulaz za tipku izlaza. Nije navedeno: sadrži li lista "Execute Relay" na A08 Security Relay, pali li tipka izlaza s A08 ulaza SR01, i koji relej pali `isvalid:true`. KB naziva RS-485 način nekonzistentno ("Others" naspram "Security Relay").

## Q7. Tehnički podaci

| Stavka | Vrijednost |
|---|---|
| IP / IK | IP65; IK09 (stariji datasheet IK07) |
| Temperatura / vlažnost | -20 do +55 °C; 10-90 % bez kondenzacije |
| PoE | Datasheet 802.3af; KB 802.3at. Za PoE hardverska verzija treba biti 108.2.0.0.0 ili viša |
| Izlaz 12 V | Datasheet 600 mA, KB 500 mA; uređaj treba napajati s najmanje 12 V/1 A |
| Potrošnja (W) | Nigdje nije navedena |
| Dimenzije | 140 × 50 × 26,7 mm |
| Zidna kutija | otvor 50 × 29 × 23 mm; ugradna kutija 135 × 42 × 38 mm |
| Visina ugradnje | najviše 1100 mm do dna panela |
| Kabel 12 V DC | AWG 20 do 50 m, 22 do 40 m, 24 do 30 m, 26 do 15 m |
| RS-485 | 300 m upletena parica (SR01) |
| Kapacitet | 20.000 korisnika, 100.000 kartica i zapisa, 20.000 PIN-ova |

## Nedokumentirano (samo test na uređaju)

1. Potvrdna tipka i automatsko slanje PIN-a, timeout između znamenki, najveća duljina PIN-a u udaljenom modu.
2. Ograničenje pogrešnih PIN-ova.
3. Optika QR skenera, simbologije, ponašanje s različitom svjetlinom ekrana.
4. Kodiranje i duljina `{QRCode}`/`{Pin}`; HTTPS.
5. Koji relej se okida pri `isvalid:true`; SR01 i tipka izlaza.
6. Pale li se valid/invalid Action URL događaji pri udaljenoj provjeri.
7. Format real-time uploada zapisa.
8. Potrošnja i PoE klasa.

Neovisni izvori (forumi, GitHub, Reddit) nisu dali ništa osim Akuvoxovih stranica i preprodavača. Akuvoxov demonstracijski video "[Quick Demo] Use PIN and QR Code to Unlock on A08" ([YouTube](https://www.youtube.com/watch?v=GdBSi_whF-I)) nema titlove i jedini je vizualni zapis stvarnog unosa.
