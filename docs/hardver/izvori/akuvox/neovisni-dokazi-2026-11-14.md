# Akuvox A08/A08S treći server: potraga za neovisnim dokazima (14.11.2026.)

Izvor: pretraga 14.11.2026. Citati nisu provjereni bajt po bajt (Akuvox KB je iza Cloudflare izazova). Teme na Akuvox forumu traže prijavu.

## Zaključak

**Nije nađen nijedan neovisni dokaz** (poslužitelj, forum, video, snimka zahtjeva, imenovana instalacija) da tok A08/A08S treće-strani provjere radi u praksi. Sve što opisuje ugovor je Akuvoxova vlastita dokumentacija. Neovisni su samo susjedni materijali: Action URL webhookovi (jednosmjerna, druga značajka) i stranice dobavljača bez opisa mehanizma.

## Što dokumentacija potvrđuje (Akuvox, ne neovisno)

- Odgovor mora biti valjani JSON; uređaj otvara vrata na uspjeh. Prihvaćene vrijednosti: `isvalid` true/1, `validation_result` "1"; neuspjeh false/0, "0". Rok 3 s, zatim odbijanje ([how-to](https://knowledge.akuvox.com/docs/integration-with-third-party-access-control-server), ažurirano 13.11.2026.).
- Predložak: `http://192.168.31.123:8090/api/visitor/scan?codeKey={QRCode}&deviceId={DeviceID}`; "General" mod je samo QR.
- U Customize modu više vrijednosti dolazi odvojeno kosom crtom unutar `codeKey`; primjer s karticom: `...codeKey={QRCode}/123456/{UserID}/{Pin}&deviceId=1`, što znači da neprisutne vjerodajnice ostaju kao doslovni predložak ([vodič -12](https://knowledge.akuvox.com/docs/integration-with-third-party-device-12)).
- "Using unsupported variables may result in failed requests": varijable nisu zamjenjive između modela.
- Značajka je prvi put u Becie 108.30.10.139 (20.12.2024.), a ove godine prerađena (108.30.11.228: "Optimized the integration with a third-party access control server"). Ispravak u Release 108.30.11.60: "Fixed an issue with QR code unlocking" (uzrok nije naveden).

## Činjenice koje smo tražili

| Pitanje | Nalaz |
|---|---|
| HTTP metoda | Nije navedena. Svi primjeri su URL s upitom, što upućuje na GET. Action URL-ovi su neovisno prijavljeni kao GET ([Home Assistant forum](https://community.home-assistant.io/t/akuvox-door-bell-open-door-via-homeassistant-and-the-actionurls/324816)) |
| Autentikacija | Basic ili Digest (A08 od 108.30.11.228); raspored zaglavlja nije naveden |
| Kodiranje QR sadržaja u URL-u | Nije navedeno |
| Statusni kod i content-type odgovora | Nije navedeno |
| Stvarne snimke zahtjeva (curl, tcpdump, logovi) | Nijedna nađena |
| Je li vrata otvorila nakon `isvalid` | Nijedno neovisno izvješće. Koji relej: nije navedeno |
| Problemi čitanja QR-a | Nema izvješća. Jedino ograničenje je za Wiegand put: "Only support identifying QR codes generated based on hexadecimal characters" |
| PIN u udaljenoj provjeri | `#`: nije navedeno; lokalne duljine 3-8 i 2-8, vrijede li i za udaljene: nije navedeno |
| HTTPS | Nije navedeno; nema ni pritužbe da ne radi. Neovisna HA integracija savjetuje HTTPS za webhookove, bez dokaza da uređaj to dovršava ([tykeal](https://github.com/tykeal/homeassistant-local-akuvox)) |
| Odgovori Akuvoxove podrške | Nijedan o ovoj temi |
| Teretane, coworking, uredi s A08/A08S i vlastitim BE-om | Nijedna nađena |

## Susjedni nalazi

- KEYVOX oglašava Akuvox QR ulaz, mehanizam nije naveden ([keyvox.co](https://keyvox.co/en/integrations/akuvox)).
- Minut se povezuje preko korisničkog Akuvox računa, ne callbackom uređaja. Parsec koristi Wiegand ([parsec.ru](https://www.parsec.ru/products/skud/akuvox/)). Hobi poslužitelj prima Action URL događaje preko `http` na portu 8090 ([akuvox-telegram](https://github.com/hatnaa1/akuvox-telegram)).
- Akuvoxov popis integracija partnera (29.12.2025.) nema nijedan unos koji koristi treće-strani server za provjeru ([popis](https://knowledge.akuvox.com/docs/supported-brands-and-integration-features)).

## Nije nađeno

GitHub (0 pogodaka za `akuvox validation_result`, `"api/visitor/scan" codeKey`), Reddit, YouTube (pet pretraga, samo recenzije i HTTP otključavanje), Stack Overflow, Node-RED, openHAB, integracije s teretanskim softverom (GymMaster, Virtuagym, PerfectGym, Glofox, PushPress, Gymdesk, Mindbody, Wodify), coworking alati i platforme za najam.

## Teme na Akuvox forumu koje bi mogle pomoći (traže prijavu, besplatna registracija)

Poveznica oblika `https://community.akuvox.com/forum.php?mod=viewthread&tid=<broj>`:
- **648: "Akuvox Smart Access: Smarter 24/7 Unattended Gym Operations"** (Akuvoxova vlastita objava, izravno relevantna).
- 529: "A08S as Wiegand QR Code"
- 383: "Action URL with Headers"
- 391: "Akuvox API documentation"
- 450: "RFID card ID via API"
- 432: "I want to know the situation of using security relay."

Ni jedan od 539 naslova ne spominje provjeru preko trećeg servera.

## Posljedica

Preostale nepoznanice (metoda, HTTPS, kodiranje URL-a, `#` za PIN, ponašanje releja i SR01) može riješiti samo ispitivanje stvarnog A08S-a s logom zahtjeva ili pisani odgovor Akuvoxa.
