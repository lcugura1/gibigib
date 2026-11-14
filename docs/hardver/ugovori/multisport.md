# Ugovor: MultiSport (Benefit Systems)

Što je poznato o provjeri MultiSport članova na vratima i što NIJE. **Javni API ni specifikacija integracije ne postoje**; sve što se programski traži (autentikacija, endpointi, format QR-a) dolazi od Benefit Systems nakon što teretana zatraži suradnju ([mail](../partneri/pitanja-i-mailovi.md)). Do tada se adapter ne programira. Izvori: [partneri/multisport](../partneri/multisport/istrazivanje.md), [međunarodni primjeri](../partneri/medjunarodni-primjeri.md).

## Poznato (dokumentirano)

| Stavka | Vrijednost |
|---|---|
| Kod | član generira QR u aplikaciji My MultiSport (virtualna kartica). Vrijedi kratko: slovački FAQ navodi 10 s. Pod QR-om je "Offline code" (poljski: token) koji osoblje upisuje na terminalu kad čitač ne radi; broj znamenki nije naveden, a hrvatski FAQ ga ne spominje |
| Provjera identiteta | prvi put uživo: osoblje usporedi fotografiju iz aplikacije s osobnom iskaznicom. Nakon toga ne treba ID. Potvrda vrijedi samo na uređaju na kojem je dobivena |
| Posjet | jedna usluga dnevno u jednom objektu (virtualna i plastična kartica zajedno). Light jednom dnevno, Plus više puta |
| Samoposlužni rad (HR, od 1.12.2026.) | samo virtualna kartica s potvrđenim identitetom; plastične kartice ne omogućuju pristup. Korisnik samostalno generira QR i skenira ga na čitaču QR kodova u objektu. **Preduvjet je korisnički profil u sustavu partnera.** Prva registracija uživo kad je osoblje prisutno. Korištenje izvan objavljenog radnog vremena može dovesti do blokade |
| Terminal (HR) | posjeta se registrira skeniranjem; druga posjeta istog dana odbijena ("broj dozvoljenih posjeta za ovu karticu je premašen"); neprovjerena fotografija traži potvrdu osoblja; otkazivanje posjete do 10 minuta nakon registracije |
| Poljska | klub dobiva `ClientId` od kontakta u Benefit Systems; vrata se otvaraju nakon pozitivne provjere sustava MultiSport; drugi sken istog QR-a bilježi izlaz; broj telefona je jedinstveni identifikator korisnika. Samoposlužni objekti ne mogu se koristiti kartom kad sustav ne radi (nema zamjene) |
| Ugovor | ima ga teretana, ne dobavljač softvera. Partner ne smije angažirati dodatnog obrađivača podataka bez pisanog odobrenja Benefit Systems (slovački standardni ugovor) |

## Nepoznato (pitati)

Autentikacija osim `ClientId`-a, endpointi (provjera po QR-u, po offline kodu, poništavanje, izlaz), format i duljina QR-a, valjanost, odgovori i kodovi grešaka, ograničenje zahtjeva, testno okruženje, certifikacija softvera, odobrenje obrade podataka, hrvatski uvjeti za samoposlužni rad za partnera, može li se prva provjera identiteta obaviti bez osoblja.

## Što to znači za kod (dizajn, ne dokumentirano)

- Čitač šalje sirovi sadržaj; BE prepoznaje vrstu koda i zove adapter. Sučelje adaptera: `validate(rawCode, kontekst)` vraća dopušteno ili odbijeno s razlogom i identifikatorom posjete; `cancel(identifikatorPosjete)` za slučaj da se vrata ne otvore (poništavanje je dokumentirano, 10 minuta u HR uvjetima).
- Odgovor čitaču mora stići u 3 s, uključujući poziv MultiSportu. Poziv provajdera s vremenskim ograničenjem oko 2 s.
- Gost-profil (broj kartice ili ID provajdera) stvara BE sam; član ne radi ništa u našoj aplikaciji (odluka O-026).
- Nema offline puta: kad MultiSport ne radi, vrata ostaju zatvorena.
