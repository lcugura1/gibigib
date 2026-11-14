# Pitanja i mailovi

Što smo poslali, što još treba poslati i što pitati na sastancima. Kad stigne odgovor, upisati ga u tablicu i prenijeti u odgovarajući [ugovor](../ugovori/akuvox-a08s.md), a odluku ažurirati ako se promijenila.

## Praćenje

| Kome | Što | Poslano | Odgovor |
|---|---|---|---|
| Akuvox (support@akuvox.com) | 4 tehnička pitanja o A08S | 14.11.2026. | čeka |
| Tedee (support@tedee.com) | 4 tehnička pitanja o API-ju i Keypad PRO | 14.11.2026. | čeka |
| MultiSport (Benefit Systems Hrvatska) | upit o samoposlužnom radu, šalje vlasnik teretane | nije poslano | |
| PassSport | upit o automatskom ulazu, šalje vlasnik teretane | nije poslano | |

Ako odgovora nema za tjedan dana: Akuvox preko distributera (možda demo uređaj), Tedee preko podrške telefonom, provajderi telefonom (MultiSport 0800 222 023, PassSport 0800 0012). Bez odgovora ostaje test na uređaju.

## Prvi kontakt: mailovi u ime vlasnika teretane

Šalje vlasnik teretane (ugovor s MultiSportom i PassSportom ima teretana, ne mi). Svrha je iznijeti ideju i problem i dogovoriti sastanak; tehnička pitanja niže idu razvijateljima za poziv ili sastanak. Zamijeniti sve `[...]`.

### MultiSport (kontakt@benefitsystems.hr ili kontakt osoba teretane)

**Predmet:** Upit o samoposlužnom radu (ulaz 0-24) i MultiSport članovima – [Naziv teretane]

Poštovani,

[Naziv teretane] [Grad] partner je MultiSport mreže. Uvodimo novu aplikaciju za članove u kojoj se ulazi skeniranjem QR koda ili unosom PIN-a na čitaču na ulazu, s mogućnošću rada 0-24 bez osoblja. Aplikaciju razvija [naziv tima].

Naši MultiSport članovi sada ulaze uz osoblje na recepciji. Željeli bismo da i oni mogu samostalno ući izvan radnog vremena recepcije, u skladu s vašim novim Uvjetima korištenja (samoposlužni rad, na snazi od 1. prosinca 2026.), skeniranjem QR koda iz aplikacije My MultiSport na istom čitaču, bez dodatne aplikacije.

Molimo Vas za kratki poziv ili sastanak s osobom zaduženom za partnersku mrežu i tehničku integraciju. Željeli bismo razumjeti je li takva integracija moguća, koji su uvjeti za naš sustav i što je potrebno od nas kao partnera.

Naši razvijatelji softvera dostupni su za poziv ili sastanak: [Ime i prezime], [telefon], [e-mail].

Lijep pozdrav,
[Ime i prezime vlasnika], [Naziv teretane], [telefon]

### PassSport (info@passsport.com ili obrazac passsport.com/hr/offer)

**Predmet:** Upit o automatskom ulazu PassSport korisnika (24/7) – [Naziv teretane]

Poštovani,

[Naziv teretane] [Grad] partner je PassSporta. Uvodimo novu aplikaciju za članove u kojoj se ulazi skeniranjem QR koda ili unosom PIN-a na čitaču na ulazu, s mogućnošću rada 0-24. Aplikaciju razvija [naziv tima].

Željeli bismo da se vrata otvaraju automatski i PassSport korisnicima: kad pokažu svoj QR kod ili unesu PIN iz PassSport aplikacije na istom čitaču, bez dodatne aplikacije i bez osoblja. Vidjeli smo da PassSport ima automatski ulaz kod nekih objekata, pa nas zanima je li to moguće i za nas.

Molimo Vas za kratki poziv ili sastanak s osobom koja je zadužena za tehničku suradnju s partnerima. Naši razvijatelji softvera dostupni su za poziv ili sastanak: [Ime i prezime], [telefon], [e-mail].

Lijep pozdrav,
[Ime i prezime vlasnika], [Naziv teretane], [telefon]

## Mailovi proizvođačima hardvera (poslani 14.11.2026.)

Pišu se u jednini jer ih šalje student koji radi diplomski rad; engleski.

### Akuvox (support@akuvox.com ili ticket.akuvox.com)

```
Subject: A08S third-party verification: a few technical questions for a pilot project

Hello Akuvox team,

I am a student working on my master's thesis in Croatia. As part of it, I am building a pilot project that automates entry into a gym: members open the door with a QR code or PIN from a mobile app, and my backend decides whether to let them in. I chose the Akuvox A08S as the entrance reader and plan to use the Third Party Integration feature (the device sends the QR/PIN to my HTTP server and I reply with isvalid).

Your documentation has been very helpful, but a few details are not covered, and I would be very grateful for your help:

1. When the server replies isvalid:true, does the device open only the local relay, or also a connected Security Relay (SR01)?
2. Can the Third Party Integration URL use https:// (and does the device validate the server certificate)?
3. Does the stable Release firmware (108.30.11.61) support PIN ({Pin}) and the Basic/Digest Authorization Mode, or do these require Beta 108.30.11.228 or newer?
4. For PIN entry on the keypad in remote-verification mode: is the PIN sent as soon as the last digit is typed or after a confirm key, and what is the maximum length?

If there is a technical contact or distributor in Europe who could help me test with a demo unit, I would be happy to be pointed in that direction. I am glad to share what I learn from the pilot.

Thank you very much for your time. Any answer, even a short one, would help me a lot.

Kind regards,
[Your name]
[University / faculty], [City], Croatia
[Phone] | [E-mail]
```

### Tedee (support@tedee.com)

```
Subject: Keypad PRO and cloud API PINs: a few technical questions for a pilot project

Hello Tedee team,

I am a student working on my master's thesis in Croatia. As part of it, I am building a pilot project that automates entry into a gym. Members receive a short-lived PIN in a mobile app, my backend creates it through the Tedee cloud API (Tedee lock + Keypad PRO + Bridge), and the PIN expires a few minutes later.

The API documentation is clear and well written, but a few details are not covered, and I would be very grateful for your help:

1. Are startDate and endDate honoured to the minute (for example a PIN valid for 3 minutes), and in which time zone are they interpreted?
2. When an expired PIN is removed, is its slot on the lock freed immediately? Does an expired PIN count toward the 100-PIN limit until it is removed?
3. What latency should I expect for creating and deleting a PIN through the cloud API, and how should I handle 20-40 creations within 15 minutes on one lock (409/408 responses, rate limit)?
4. What is the recommended way to detect, close to real time, that a PIN was used (polling interval for the activity log), and how many wrong PIN attempts does Keypad PRO allow before locking out?

I would also appreciate a pointer to a technical contact if these questions are better answered by your integrations team. I am happy to share my findings from the pilot.

Thank you very much for your time. Any answer, even a short one, would help me a lot.

Kind regards,
[Your name]
[University / faculty], [City], Croatia
[Phone] | [E-mail]
```

## Detaljna pitanja za sastanak (razvijatelji)

Svako pitanje ima razlog; ne postavljati ih u prvom mailu.

### MultiSport (Benefit Systems Hrvatska)

1. Smijemo li članove MultiSporta puštati unutra bez osoblja (vrata otvara sustav, 0-24) i pod kojim uvjetima (video nadzor, vremenski prozori)? *Uvjeti iz 1.12.2026. to dopuštaju, ali partnerski uvjeti nisu javni.*
2. Kako se obavlja prva provjera identiteta (fotografija i osobna iskaznica) u teretani bez recepcije? Postoji li daljinski način ili uparivanje (kao u slovačkom SmartGymu), ili prvi ulazak mora biti uz osoblje?
3. Imate li tehničku dokumentaciju integracije za sustave kontrole pristupa (API, testno okruženje)? Kako se autentificiramo (`ClientId` i što još)? Koji endpointi postoje za provjeru QR-a, provjeru offline koda, poništavanje posjete i izlaz?
4. Što točno sadrži QR kod (format, duljina, znakovi) i koliko vrijedi? Treba li čitač slati cijeli sadržaj ili ga parsirati? *Čitač (Akuvox) šalje sirovi sadržaj i ne objavljuje najveću duljinu.*
5. Offline kod ispod QR-a: koliko znamenki, koliko vrijedi, smije li se unositi na numpad čitača za automatski ulaz? Hrvatski FAQ ga ne spominje.
6. Kad se posjeta upisuje (pri provjeri ili pri otvaranju vrata)? Koliko se dugo može poništiti (HR uvjeti navode 10 minuta) i je li poziv idempotentan?
7. Tko provodi "jedna posjeta dnevno" i razliku Light/Plus, vi ili mi? Što vraća API kad je odbijeno?
8. Koje je očekivano vrijeme odgovora API-ja (p95) i SLA? *Čitač čeka naš odgovor najviše 3 s, uključujući vaš poziv.*
9. Što smijemo raditi kad je MultiSport nedostupan? *Poljski samoposlužni uvjeti: bez zamjene.*
10. Surađujete li s dobavljačima softvera (jedan integrator za više teretana)? Ugovor imaju teretane. Treba li vaše odobrenje integracije, čitača i obrade podataka?
11. Koji se osobni podaci vraćaju i koliko dugo ih smijemo čuvati (GDPR)?
12. Naknade i obračun: MultiSport navodi da pokriva troškove tehnologije; ima li naknade za integraciju? Kako se usklađuju posjete za fakturiranje?
13. Čitači koje instalirate partnerskim teretanama: koji su modeli, imaju li izlaz releja i mogu li otvoriti vrata? Zove li čitač vaš BE i sam odlučuje ili samo bilježi posjetu? Smije li teretana otvarati vrata našim čitačem umjesto vašeg?
14. Što znači "korištenje usluga izvan objavljenog radnog vremena objekta nije dopušteno" za klub koji radi 0-24?

### PassSport

Znamo iz aplikacije: QR vrijedi 1 minutu, ispod njega je 8-znamenkasti PIN koji se mijenja svakih 60 s, snimka zaslona nije moguća.

1. Je li PIN zamjena za QR pri ulazu? Smije li se unositi na numpad čitača i kako ga validiramo (API)? Je li jedinstven globalno ili samo po korisniku i objektu?
2. Imate li server-to-server API ili webhook za provjeru QR-a ili koda i registraciju posjete? Dokumentacija, testno okruženje, autentikacija, kodovi grešaka?
3. Kako radi "automatski ulaz" (1-click) u slovenskim teretanama gdje član skenira kod na kapiji? Zove li vaš BE sustav teretane (webhook) ili okida relej? Koji kontroleri i dobavljači su podržani i može li se certificirati vlastiti BE?
4. Kod modela u kojem član skenira fiksni QR na ulazu: možemo li u stvarnom vremenu primiti događaj (ID korisnika ili token, vrijeme, lokacija) da otvorimo vrata? Latencija i što kad nema veze?
5. Što se provjerava za GPS (prag udaljenosti, na kojoj strani) i što treba raditi vrata bez GPS-a na čitaču ili kad korisnik nema lokaciju?
6. Kako se provode jedna posjeta dnevno, otkazivanje u 15 minuta i pravilo od 60 minuta? Koji odgovori i kodovi grešaka (već iskorišten, neaktivna pretplata, pogrešna lokacija, samo premium)?
7. Tko izdaje pristupne podatke (po lokaciji ili po tvrtki) i koji su ugovorni i GDPR zahtjevi (ugovor o obradi podataka, koje podatke partner prima)?
8. Za rad bez osoblja: treba li prva posjeta na recepciji, očekuje li se provjera isprave, tko odgovara za zlouporabu, tražite li kameru ili zapise?
9. Je li Walletapova veza izgrađena na općem partnerskom API-ju koji i mi možemo koristiti ili je poseban dogovor? Uvjeti, provizija, naknada za integraciju?

### Wellhub (samo ako je prisutan u Hrvatskoj)

1. Je li Wellhub aktivan u Hrvatskoj i kako postajemo partner? API je javan ([dokumentacija](../ugovori/wellhub.md)).
2. Jesu li obje obavezne implementacije (Gate System Trigger ili Attendance Trigger plus Automated Trigger) moguće bez fizičke barijere?

### Fitpass (Hrvatska)

1. Jeste li prisutni u Hrvatskoj i s kojim partnerima?
2. Postoji li način da se članu Fitpassa otvore vrata automatski? Model je QR objekta na ulazu koji član skenira u aplikaciji.

### Walletap (kao izvor iz prakse)

1. Koji čitači i kontroleri rade s MultiSport i PassSport QR-om (partneri navode ACS, VTAP, ZKTeco, Metra)? Imate li probleme s duljinom QR-a?
2. Koje je tipično vrijeme provjere i što radite kad provajder kasni?
3. Kako rješavate prvu provjeru identiteta u teretani bez recepcije?
4. Je li vaša integracija s provajderima otvorena drugim softverima ili samo vaša?
