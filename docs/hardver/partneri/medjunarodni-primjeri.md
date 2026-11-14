# Agregatori i teretane bez osoblja: međunarodni primjeri (14.11.2026.)

Izvor: javne stranice čitane 14.11.2026. Oznake: potvrđeno = pročitan tekst stranice, nepotvrđeno = isječak ili zaključak. Stranice koje su vratile 403 nisu pročitane (Wellhub help centar, ClassPass, G2, Trustpilot, Glofox/PerfectGym/Mindbody help, fitpass.rs).

## Zaključak

Ulaz članova agregatora bez osoblja je ustaljena praksa za Wellhub, Urban Sports Club, EGYM Wellpass i Hansefit, a MultiSport Poljska ga je formalizirao uvjetima od 1.12.2025. ClassPass i Fitpass nemaju dokumentiran mehanizam za vrata.

## Pregled

| Agregator | Službeni mehanizam | Bez osoblja? | Izvor |
|---|---|---|---|
| MultiSport (PL) | Jednokratni QR/token iz aplikacije; skeniranje na uređaju samoposlužnog objekta; samo mobilna kartica s potvrđenim identitetom; bez zamjene kad sustav ne radi | Da, izričito, kao posebna kategorija partnera | [uvjeti](https://regulaminy.kartamultisport.pl/Terms_and_conditions_for_card_use_under_the_MultiSport_Program_of_December_1__2025_154_KB_PDF.pdf) |
| Wellhub | Check-in u aplikaciji, zatim `POST /access/v1/validate` u 20 minuta; vlastiti kodovi (QR/PIN do 13 znakova); webhook | Nije navedeno; u praksi da (EVO) | [Access Control API](https://developers.gympass.com/product/access-control-api/1.0/getting-started) |
| Urban Sports Club | Član skenira statični QR studija (geofence 100 m); validacija preko softvera teretane | Nije navedeno; u praksi da (FITOMAT, fit+, EVO) | [primjer](https://urbansportsclub.com/en/venues/fitomat-siegen-niederschelden) |
| EGYM Wellpass | App/GPS check-in ili TAN + RFID + admissions API; potreban dodatak ugovora | Nije navedeno; u praksi da (EVO) | [dokumentacija](https://developer.egym.com/wellpass/admission/get-started) |
| Hansefit | QR iz aplikacije svaki put na skeneru; screenshot ne radi | Da, "staff-free gym" navedeno u njihovom pretraživaču | [primjer](https://hansefit.de/en/studio-finden/wettbergen/fitness/easyfitness-hannover-wettbergen) |
| ClassPass | Rezervacije; dolazak se povlači iz softvera partnera | Nije obrađeno | [anny.co](https://docs.anny.co/en/class-pass.md) |
| Fitpass | QR u aplikaciji, jedna sesija dnevno | Nepoznato | [App Store](https://apps.apple.com/hr/app/fitpass-sport-and-recreation/id1444181297) |

## Wellhub (najbolje dokumentiran)

- Član se uvijek prvo prijavi u Wellhub aplikaciji, sustav teretane zatim zove validate (Bearer token, `X-Gym-Id`, `gympass_id` od 13 znamenki). Bez check-ina: odbijeno.
- Tri metode implementacije; obavezna je "Automated Trigger" (check-in webhook, odgovor unutar 1 s, 3 pokušaja, potpis HMAC-SHA1). Webhook nosi ID, ime, e-mail, telefon i lokaciju; "Profile Automation" stvara profil pri prvoj posjeti bez osoblja.
- **Vlastiti kodovi:** teretana može poslati Wellhubu svoj interni QR ili PIN (najviše 13 znakova) kojim član ulazi (`/access/v1/code/:wellhub_id`).
- Ponavljanje poziva nakon timeouta je sigurno ("No more than one validation will be recorded").
- Povratni put: ručna stranica u partnerskom portalu, bez offline načina.

## Primjeri teretana bez osoblja

| Teretana | Agregator | Kako članovi ulaze |
|---|---|---|
| EVO Fitness (DE) | USC / Wellhub | Skeniraju QR na posteru ili prijava u aplikaciji agregatora, dobiju 7-znamenkasti kod, unose ga na turniketu pri svakoj posjeti |
| EVO Fitness | Wellpass | Prvi put registracija, osobni kod za turniket (14 dana), zatim stalni čip |
| FITOMAT (DE) | USC | Skeniraju QR na prozoru studija, drže generirani kod na skeneru vrata; digitalni check-in obavezan |
| fit+ Hagenow | USC | Predregistracija, pristup preko vlastite aplikacije teretane, plus USC QR na licu mjesta |
| McFIT Berlin-Adlershof (24/7) | USC | Prvi posjet dok je osoblje prisutno (dobiju člansku karticu); nakon toga USC QR check-in automatski otključava karticu |
| Fitness First (DE) | Wellpass | Jednokratna online registracija s Wellpass ID-jem, stalna kartica; check-in u aplikaciji se ne traži |
| CityFit (PL) | MultiSport | Nije bez osoblja: osoblje skenira karticu i traži ID, ulaz samo u radno vrijeme |
| CityFit (PL) | Medicover/PZU Sport | Povežu karticu u CityFit aplikaciji, generiraju QR i skeniraju ga na ulazu |

## Uzorci

| Uzorak | Wellhub | USC | Wellpass | Hansefit | MultiSport |
|---|---|---|---|---|---|
| (a) Validacija u stvarnom vremenu na vratima | Da, javni API | Da, preko softvera ili koda iz aplikacije | Da, admissions endpoint | Da (sučelje nije javno) | Da (API nije javan) |
| (b) Jednom poveži, zatim koristi vlastiti medij teretane | Da, uz check-in u aplikaciji svaki put | Da (McFIT, fit+) | Da; check-in u aplikaciji ne treba ako nije uključeno po teretani | Da, uz QR check-in svaki put | Ne za bez osoblja |
| (c) Provjera identiteta bez osoblja | Nije dokumentirano; vezanje uz uređaj i geolokacija | Profilna fotografija i geofence 100 m | TAN povezivanje i GPS | Nije dokumentirano | Jednokratna potvrda identiteta uživo, vezana uz uređaj |

Nijedan agregator ne dokumentira video ili daljinsku provjeru ID-a. Operateri zamjenjuju osoblje video nadzorom i zaštitom od ulaska u paru (tailgating).

## Standardna praksa

1. Check-in u aplikaciji agregatora na licu mjesta (geofence) je događaj koji se naplaćuje. Vrata se otvaraju tek nakon što sustav teretane potvrdi to: API-jem, kodom iz aplikacije ili otključavanjem unaprijed dodijeljenog medija.
2. Uključivanje je jednokratno: samoregistracija s ID-jem agregatora ili TAN-om, ili prva posjeta dok je osoblje prisutno.
3. Jedna plaćena posjeta dnevno, provodi ju agregator.
4. Kodovi su kratkotrajni ili jednokratni.
5. Identitet se utvrđuje jednom, zatim vezuje uz uređaj, fotografiju ili medij.
6. **Nema offline puta:** pri kvaru vrata ostaju zatvorena (MultiSport izričito) ili se koristi ručni portal.

## Dobavljači softvera

- **Magicline:** moduli za USC (validacija check-ina za turnikete), Hansefit i Wellpass.
- **PerfectGym:** Wellpass check-in automatizacija i Gympass ("access control software is simply appended to recognize Gympass QR codes").
- **Trainingym:** Wellhub QR vrijedi 30 minuta.
- **Box Planner:** pohranjuje Wellhub ID, zove validate i daje pristup pri HTTP 200; webhook stvara korisnike.
- **Gantner:** 24/7 bez osoblja, "reverse QR code application", bez spomena agregatora.
- Kisi: nepotvrđeno da nema integraciju s Wellhubom.

## Pravno

- MultiSport: kriterij stalne recepcije ne vrijedi samo za kategoriju samoposlužnih objekata s vlastitim tehničkim kriterijima; pravila bilježenja posjeta su u "Annex 4" ugovora (nije javno).
- Wellhub: osoblje na recepciji nikad ne smije raditi check-in umjesto člana; webhook nosi osobne podatke (ime, e-mail, telefon), a FAQ tvrdi usklađenost s GDPR-om.
- Wellpass: sučelje traži dodatak ugovora i ugovor o obradi podataka.
- Javni ugovori s klauzulama o prisutnosti osoblja ili odgovornosti za Wellhub, USC, Wellpass i Hansefit nisu nađeni.

## Nepoznato

Sadržaj ugovora s agregatorima, MultiSportovo tehničko sučelje za samoposlužne uređaje (i postoji li ta kategorija izvan Poljske), točan USC mehanizam koji izdaje kod za vrata, može li Wellpass TAN povezivanje bez ikakvog osoblja, te ClassPass i Fitpass na razini vrata.
