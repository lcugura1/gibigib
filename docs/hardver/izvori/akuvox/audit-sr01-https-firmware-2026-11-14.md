# Akuvox A08/A08S Third Party Integration: audit SR01, HTTPS i firmwarea (14.11.2026.)

Izvor: Akuvox KB čitan 14.11.2026. Pregledan je `llms.txt` (3366 stranica), preslikano je oko 2291 stranice (sve koje se odnose na treće strane, relej, firmware, otvaranje vrata, HTTP, sigurnost, QR, SR01, zapise), pregledani su screenshotovi sučelja i PDF-ovi (datasheet A08S, SR01 Quick Guide V1.3, A08 Quick Guide, A08 admin guide v2 s 81 stranicom). Oznake: dokumentirano = piše na stranici, nepotvrđeno = zaključak. Nema foruma, GitHub issuea ni transkripata videa o temi.

## Q1. Koji relej otvara `isvalid:true`? NIJE NAVEDENO

- Jedini opis ishoda: "The device opens the door if verification is successful." ([izvor](https://knowledge.akuvox.com/docs/integration-with-third-party-access-control-server)). Polja Customize moda: Authorization Mode, Remote Verification, Multi-factor Request Mode, HTTP URL, Device ID, Success Parameter, Failed Parameter. **Polja za odabir releja nema.** (Za Wiegand i OSDP "Open Relay" odabir postoji.)
- SR01 na A08 se dodjeljuje po **lokalnom korisniku** ("Security Relay: Select the security relay that you've configured"). A08 u sekciji Security Relay nema popis "Access Method". Vjerodajnica koju potvrđuje treći server nema lokalnog korisnika, pa dokumentacija ne daje put od odluke do SR01 (zaključak, nigdje ne piše).
- Na drugim modelima (R29, X912, S539...) popis "Access Method" postoji, ali ne sadrži QR ni treće-strani server.
- Nijedan changelog ne povezuje treći server s određenim relejem ili SR01.

**Dokumentirana deterministička alternativa:** sam server (ili lokalni most) može okinuti SR01 HTTP naredbom: `http://{deviceIP}/fcgi/OpenDoor?action=OpenDoor&DoorNum=SA` (ili `SB`) ([Open Door via HTTP Command](https://knowledge.akuvox.com/docs/open-door-via-http-command)). A08 ima izbornik *Access Control > Relay > Open Relay Via HTTP*.

## Q2. HTTPS za callback i provjera certifikata: NIJE NAVEDENO

- Polje se zove "HTTP URL" i svaki primjer na svakom modelu je `http://`. Nijedna stranica ne prikazuje `https://` URL za provjeru.
- Uređaj ima HTTPS klijent drugdje: udaljeni zapis vrata prihvaća `http://`, `https://` i `ftp://`; datasheet navodi HTTPS među protokolima. A08 vodič nema odjeljak o certifikatima. Nijedan changelog ne spominje HTTPS za treći server.
- Basic autentikacija šalje korisničko ime i lozinku sa svakim zahtjevom; preko običnog `http://` to je praktički otvoreni tekst (zaključak).

## Q3. Verzije firmwarea

| Dio | Prva dokumentirana verzija |
|---|---|
| Osnovni callback | 108.30.10.139 (Beta, 20.12.2024.): "Support sending access control information to a third-party server, which will respond with door opening success or failure." |
| Customize (QR + RF kartica) | Prisutan u vodiču napisanom prema 108.30.11.22; prva verzija nije navedena |
| PIN (`{Pin}`) | Nema unosa u changelogu; dokumentirani minimum 108.30.11.122 (njemački prijevod: "Alle weiteren... Funktionen sind ab 108.30.11.122 verfügbar") |
| Dvofaktorski | 108.30.11.122 (Beta, 1.4.2026.) |
| Authorization Mode, Multi-factor Request Mode | 108.30.11.228 (Beta, 17.7.2026.) |
| Barkod kao kartica | 108.30.12.9 (Beta, 31.8.2026.) |

**Grananje (iz polja "Supported SmartPlus Version"):** 108.30.10.x je V7.0 linija; 108.30.11.8 do .61 je V7.1.1 linija (LTS/Release .41, Release .58, .60, .61, samo ispravci); 108.30.11.110 do .122 je V7.3, .210 do .236 je V7.4, 108.30.12.x je V7.5, sve Beta.

**Sadrže li Release/LTS (.41-.61) značajku? Nepotvrđeno (zaključak):** vjerojatno imaju osnovni callback (QR i kartica), jer slijede 108.30.11.22. PIN, dvofaktorski mod, autentikacija i barkod nisu dokumentirani ni za jednu Release/LTS gradnju.

**Beta firmware je javno preuzimanje**, ne samo preko podrške: `https://maintenance.akuvox.com/firmware/release/beta?model_name=A08` (npr. `108.30.12.17.rom`). Stabilna stranica daje 108.30.11.61.rom, LTS 108.30.11.41.rom. Akuvox preporučuje Release i LTS.

## Q4. Pokriva li ista dokumentacija A08S?

- **Da:** isti vodič, isti firmware (jedan unos `model_name=A08`, verzije 108.30.x). Za `model_name=A08S` stranica vraća "No Data". Vodič kaže "Take A08 as an example", a screenshot zaglavlje glasi "Akuvox | A08S".
- **Zvjezdica** uz A08 u KB tablici je bilješka o firmwareu, ne oznaka varijante: Authorization Mode i Multi-factor Request Mode traže 108.30.11.228 ili noviji.
- QR postoji samo na A08S ([model specification](https://knowledge.akuvox.com/docs/model-specification-23)).
- Nije navedeno: izričita rečenica da A08S i A08K koriste identičnu .rom datoteku.

## Q5. Server nedostupan ili prekoračenje roka

- "Timeout: 3 seconds... Access will be denied automatically." Vjerodajnice koje provjerava server se prosljeđuju "as-is, with no local verification performed on the device."
- Vjerojatno (zaključak): vrste vjerodajnica koje nisu označene u "Remote Verification" ostaju lokalno provjeravane.
- Nije navedeno: ponašanje kod HTTP 4xx/5xx i neispravnog JSON-a, ponavljanje i offline predmemorija. **Fallback nema**, pa osoblje treba mehanički ključ ili ručno otključavanje.

## Q6. Električne vrijednosti

- Relej A08/A08S: **30 V 2 A** ([Relay Resistive Load](https://knowledge.akuvox.com/docs/relay-output-of-indoor-monitors); stranica označena kao zastarjela; AC/DC nije navedeno). Quick guide: "Door Lock (≤DC 30V)". 12 V izlaz: datasheet 600 mA, KB 500 mA.
- SR01: relej **30 V 2 A**; 12V-OUT najviše 12 V/0,5 A, samo uz RS-485; adapter najmanje 12 V/0,6 A; RS-485 do 300 m.

## Još nedokumentirano

1. Koji relej se okida pri odobrenju servera i okida li se SR01 uopće.
2. Prihvaća li URL `https://` i provjerava li certifikate.
3. Točna gradnja koja je dodala `{Pin}` i sadrže li Release/LTS Customize ili PIN (riješava se instalacijom .rom datoteka i pogledom na sučelje).
4. Ponašanje kod HTTP grešaka, metoda i zaglavlja.
5. Vraćaju li se neoznačene vrste vjerodajnica na lokalnu provjeru.
6. AC ili DC vrijednost releja i službeni datasheet SR01.
