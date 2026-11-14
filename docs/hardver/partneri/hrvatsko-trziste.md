# Hrvatsko tržište: MultiSport i PassSport u teretanama bez osoblja (14.11.2026.)

Izvor: javne stranice čitane 14.11.2026., uz oba javna popisa partnera (691 MultiSport objekt i 1273 PassSport lokacije). Oznake: potvrđeno = pročitano na stranici, nepotvrđeno = zaključak. Forum.hr, Reddit i društvene mreže nisu bili dostupni.

## Zaključci

1. **Walletap nije prvi.** BodySolution Koprivnica (softver amidal amiFIT) opisuje isti MultiSport tok na stranici datiranoj 13.10.2026., tri tjedna prije Walletapove objave (4.11.2026.). Datum stranice je potvrđen, ali nije dokazano da je ta rečenica bila tamo od početka.
2. **MultiSport "Samoposlužni rad"** je opći način rada u uvjetima korištenja (objavljeni 1.11.2026., na snazi od 1.12.2026.).
3. **PassSport u Hrvatskoj:** nijedan hrvatski primjer otvaranja vrata preko PassSporta nije nađen. Hrvatske teretane koriste fiksni QR koji član sam skenira (samo evidencija dolaska), a vrata otvara teretanin vlastiti sustav. Automatski ulaz preko PassSporta vidi se u Sloveniji.
4. **Gyms4you ne prihvaća ni MultiSport ni PassSport:** nije u popisu MultiSporta (0 od 691 objekta) ni PassSporta (0 od 1273), a njihove stranice ne spominju benefite. Ulaze isključivo vlastitom karticom povezanom s otiskom prsta, neovisno o recepciji. Pitanje kako njihovi korisnici partnerskih kartica ulaze izvan recepcije se ne postavlja.

## Dobavljači

| Dobavljač | Što nudi | Dokaz |
|---|---|---|
| Walletap (Pula) | MultiSport QR na čitaču ulaza: provjera radnog vremena, provjera kod MultiSporta u stvarnom vremenu, otvaranje vrata, poništavanje posjete ako se vrata ne otvore. PassSport: samo jedna rečenica u FAQ-u | [vijest](https://www.walletap.com/news/walletap-multisport), [Membership](https://www.walletap.com/membership) |
| amidal amiFIT (Koprivnica) | Tablet na ulazu čita MultiSport QR kamerom i vrata se otvaraju. Vlastiti članovi otvaraju NFC-om. Na stranici proizvođača MultiSport se ne spominje | [BodySolution](https://bodysolution.hr/), [amifit](https://amidal.hr/amifit/) |
| 1Klik (SLO, eKlik/iPoint) | "Preko 200 centara u Sloveniji i Hrvatskoj", integrira Metra, Gantner, Ojmar. Teretane s iPointom imaju PassSport automatski ulaz (veza nepotvrđena) | [1klik.si](https://www.1klik.si/) |
| GYMIFY (CZ), GYMMANAGER (PL) | MultiSport API, "automatic entry verification" (za Hrvatsku nije spomenuto) | [GYMIFY](https://docs.gymify.app/en/connecting-with-multisport-card/), [GymManager](https://gymmanager.io/system-integrations-in-sports-facilities/) |
| GymAdmin, Fitko, FitKartica, teretana24, Andrea360, Fitness Manager | Nema MultiSport/PassSport integracije na pročitanim stranicama | stranice proizvođača |

Walletap cijene (bez PDV-a, mjesečno): Starter 103 €, Business 138 € (do 3 lokacije, +79 € svaka dodatna), Pro 278 € (do 10 lokacija), Enterprise od 499 €, čitač 19 € mjesečno uz hardver i ugradnju prema ponudi.

## Teretane

| Teretana | Program | Što stranica kaže |
|---|---|---|
| BodySolution Koprivnica | MultiSport | Tablet kod ulaza, QR kamerom, vrata se otvaraju; bez članarine i bez njihove aplikacije |
| Balance Gym Osijek (0-24) | PassSport | Prvo javljanje na recepciji, zatim pristup preko aplikacije teretane i izvan radnog vremena |
| KK Fitness Pula, Powerfit Kneževi Vinogradi (0-24) | PassSport | Samostalno skeniranje QR-a na pultu i vratima; Powerfit traži telefonski kontakt prije prve posjete |
| La Fit Dugo Selo, THE Gym Jastrebarsko, Tomik Gym | PassSport | Član skenira fiksni QR na ulazu kad nema osoblja |
| Victory Gym Sesvete | oba | Jednokratna registracija 7 € u radno vrijeme daje vlastitu karticu za vrata; MultiSport se verificira na POS-u na pultu |
| Legacy Kukuljanovo, Saiyan Gym Fit Dubrovnik | PassSport / MultiSport | Samo u radno vrijeme recepcije |
| BM Fitness, Victorious Gym Pregrada | PassSport | 0-24, mehanizam nije naveden; Victorious traži najavu |

Gyms4you se ne pojavljuje ni u jednom popisu.

## Standardna praksa u Hrvatskoj

1. **MultiSport zadano:** osoblje skenira QR na terminalu na recepciji. Teretane bez osoblja uglavnom ograničavaju korisnike benefita na radno vrijeme recepcije ili im nakon jednokratne registracije na recepciji daju vlastiti medij (kartica, aplikacija teretane).
2. **MultiSport novo (2026.):** samoposlužni rad preko QR čitača, formaliziran u uvjetima od 1.12.2026. Korisnik se jednom mora osobno identificirati kad je osoblje prisutno i imati profil u sustavu partnera.
3. **PassSport:** osoblje skenira aplikacijom PassSport Scanner, ili korisnik sam skenira fiksni QR na vratima ili pultu (evidencija dolaska). Vrata otvara posebni sustav teretane.

## Tko daje pristupne podatke

Prema Walletapu ([vijest](https://www.walletap.com/news/walletap-multisport)): "vlasnik MultiSport poveže u postavkama Walletapa podacima koje dobije od MultiSporta... veza važi za firmu, jer ugovor s MultiSportom ima firma." Pristupni podaci dolaze iz Benefit Systems teretani po partnerskom ugovoru, a ne dobavljaču softvera. Za PassSport izjave nema.

## Nije nađeno

- Hrvatski primjer PassSport integracije koja otvara vrata, PassSport API ili izjava o pristupnim podacima, tehnički detalji Walletapove PassSport veze.
- Modeli čitača i kontrolera kod Walletapa ili amidala, i cijena MultiSport modula.
- Benefit Systems tehnički i komercijalni uvjeti za samoposlužni rad (API dokumentacija, tko daje čitač QR-a, certifikacija softvera).
- Rade li 52 objekta označena kao "samo virtualna kartica" stvarno samoposluživanje.
- Kako MultiSport korisnici ulaze izvan recepcije u Balance Gymu, KK Fitnessu, BM Fitnessu, Boutique Monkey Gymu.
