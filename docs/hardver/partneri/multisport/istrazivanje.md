# MultiSport (Benefit Systems): dubinsko istraživanje (14.11.2026.)

Izvor: javne stranice i PDF-ovi čitani 14.11.2026. Oznake: **potvrđeno** = pročitana stranica ili PDF, **nepotvrđeno** = isječak ili zaključak. Nisu svi izvori ponovno provjereni.

## Najvažnije

**MultiSport službeno podržava rad bez osoblja u Hrvatskoj.** Uvjeti korištenja objavljeni 1.11.2026., na snazi od 1.12.2026. ([benefitsystems.hr/multisport-uvjeti-koristenja](https://www.benefitsystems.hr/multisport-uvjeti-koristenja/)) definiraju "Samoposlužni rad" kao rad objekta "u cijelosti ili djelomično bez stalne prisutnosti osoblja", s ulazom: "Korisnik samostalno bilježi svoj posjet generiranjem QR koda u Aplikaciji i njegovim skeniranjem na čitaču QR kodova".

Uvjeti iz tih pravila (potvrđeno):
- Samo **virtualna kartica s potvrđenim identitetom**. Plastične kartice ne omogućuju pristup.
- **Preduvjet je da korisnik ima kreiran korisnički profil u sustavu partnera** (teretane). To znači da član MultiSporta mora imati profil i u našem sustavu.
- **Prva posjeta:** korisnik se osobno registrira u bilo kojem sportskom objektu tijekom sati kada je osoblje prisutno, radi potvrde identiteta i kreiranja profila u sustavu partnera. Daljinska ili video alternativa nije spomenuta.
- Korištenje usluga izvan objavljenog radnog vremena objekta nije dopušteno i može rezultirati blokadom. Što to znači za 24/7 klub: nejasno, treba pitati.
- Korisnik odgovara za ispravno bilježenje posjeta, uključujući omogućavanje pristupa neovlaštenim osobama.
- Jedna usluga dnevno u jednom objektu; potvrđeni identitet vrijedi samo na uređaju na kojem je dobiven.

## Postupak partnerstva u Hrvatskoj (potvrđeno)

[benefitsystems.hr/partneri](https://www.benefitsystems.hr/partneri/): 1. kontakt (obrazac), 2. sastanak, 3. ugovor, 4. instalacija čitača kartica, 5. obuka osoblja, 6. kontakt osoba, 7. fakturiranje MultiSport ulaza. Proces "može trajati dva tjedna ili manje", a MultiSport "pokriva troškove cjelokupne tehnologije". Uvjeti nisu navedeni. Partneri se prijavljuju na partnerzone.benefitsystems.hr.

Obrazac za zahtjev: [benefitsystems.hr/ponuda/?o=2](https://www.benefitsystems.hr/ponuda/?o=2), opcija "Ja sam vlasnik objekta", s poljem za poruku. **Opcije za dobavljače softvera nema.** Kontakt: kontakt@benefitsystems.hr, 0800 222 023, 01 5544 581.

## Što je javno o integraciji

- **Nema javne API dokumentacije, programa za dobavljače ni popisa certificiranih sustava** ni na jednoj otvorenoj stranici.
- Jedini dokumentirani put (Poljska): klub traži suglasnost svog kontakta u Benefit Systems i **ClientId** (identifikator kluba), koji predaje dobavljaču softvera ([eFitness](https://efitness.pl/baza-wiedzy/integracja-z-multisport-kompletny-przewodnik/)). Za Hrvatsku tehnički postupak nije potvrđen.
- Poljski kriteriji za samoposlužne objekte ([PDF](https://benefitsystems.pl/docs/Warunki-wspolpracy-dla-Partnerow_ENG.pdf)): sustav kontrole pristupa (turnstile, kapija), QR skener, video nadzor, "integration capabilities with Benefit Systems platforms", neograničen pristup po vremenu. Hrvatski ekvivalenti nepotvrđeni.
- Dobavljači s integracijom: eFitness (Poljska), GymManager (Poljska, od 14.5.2026.), GYM System i OOS Manager (Poljska, bez detalja). Perfect Gym, Magicline, Fitssey, Gantner: nije nađeno.
- Standardni ugovor (slovački javni registar): Benefit Systems daje čitač i pristupne podatke; partner ne smije angažirati dodatnog obrađivača podataka bez pisanog odobrenja Benefit Systems. Naš sustav bi mogao biti takav obrađivač (zaključak, nepotvrđeno).

## Slovački primjer bez osoblja

SmartGym Stupava (24/7, "Only Virtual Card"): jednokratna registracija: 1. registracija na web stranici, 2. u aplikaciji odabrati "Add MultiSport", 3. skenirati QR iz uputa, 4. skenirati MultiSport QR, 5. nakon uparivanja ulaz na standardni način ([multi-sport.sk](https://multi-sport.sk/en/facilities/smart-gym-stupava/)). To je izravan uzorak za naš tok: član u našoj aplikaciji uparuje MultiSport.

## Ponašanje terminala (Hrvatska, potvrđeno)

- Jedna usluga: posjeta se registrira skeniranjem; više usluga: osoblje bira.
- Druga posjeta istog dana: odbijeno, "broj dozvoljenih posjeta za ovu karticu je premašen".
- Neprovjerena fotografija: terminal traži od osoblja potvrdu fotografije.
- Otkazivanje posjete: do 10 minuta nakon registracije, preko POS uređaja.

## QR i offline kod

- QR vrijedi 10 s (slovački FAQ), dinamičan.
- Offline kod ispod QR-a: u SK/CZ aplikaciji postoji, a hrvatski FAQ, uvjeti i opis aplikacije ga **ne spominju**. Poljska aplikacija ima token ispod QR-a (šesteroznamenkasti ili sedmeroznamenkasti prema različitim izvorima). Je li statičan ili jednokratan: nepotvrđeno.

## Što ostaje nepoznato i koga pitati

Benefit Systems Hrvatska, partnerska mreža (kontakt osoba teretane ili kontakt@benefitsystems.hr):
1. Postoji li ClientId/API integracija na My MultiSport platformi u Hrvatskoj i smije li se spojiti vlastiti BE ili samo odobreni dobavljači.
2. API dokumentacija, autentikacija, sandbox, sadržaj QR-a, polja odgovora, kodovi grešaka, poništavanje i izlaz.
3. Treba li dobavljač vlastiti ugovor, NDA, certifikaciju ili odobrenje kao obrađivač podataka.
4. Hrvatski uvjeti za samoposlužni rad za partnera (ugovor, video nadzor, vrsta kapije, odgovornost).
5. Što znači klauzula o "objavljenom radnom vremenu" za klub koji radi 0-24.
6. Može li se prva provjera identiteta obaviti u partnerovoj aplikaciji ili uparivanjem (kao SmartGym) kad terminal inače traži osoblje.
7. Format offline koda i smije li ga prihvatiti sustav bez osoblja.

Dodatni izvori: eFitness Support i GymManager (sales@gymmanager.io) o tome pokriva li njihova integracija Hrvatsku; SmartGym Stupava o tome koji softver radi uparivanje.
