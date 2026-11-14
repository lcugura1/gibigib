# Partneri: MultiSport, PassSport, Wellhub

Istraživanje kako članovi agregatora mogu ući u teretanu bez osoblja i što je za to potrebno. Odluka: [O-026](../../odluke.html#o-026). Ugovori: [multisport](../ugovori/multisport.md), [passsport](../ugovori/passsport.md), [wellhub](../ugovori/wellhub.md). Oznake u istraživanjima su oznake agenata koji su čitali stranice; nisu sve ponovno provjerene.

## Zaključak

- Automatski ulaz članova agregatora bez osoblja je ustaljena praksa (MultiSport od 1.12.2026. u Hrvatskoj, Wellhub, USC, Wellpass, Hansefit u Njemačkoj; u Hrvatskoj Walletap i amidal amiFIT).
- **Ni MultiSport ni PassSport nemaju javni API.** Kodovi su dinamički (MultiSport QR oko 10 s; PassSport QR 1 minuta uz PIN koji se mijenja svakih 60 s), pa ih može provjeriti samo provajder. Potrebna je suradnja koju traži teretana (ugovor s provajderom ima teretana).
- Član ne radi ništa u našoj aplikaciji; BE sam stvara gost-profil. MultiSport traži da profil postoji u sustavu partnera i prvu provjeru identiteta uživo uz osoblje.
- Tedee paket ovo ne podržava (keypad ne zove BE). Radi preko Akuvoxa.
- Gyms4you nije partner ni MultiSporta ni PassSporta (nije u popisima); ulaze vlastitom karticom s otiskom prsta.

## Datoteke

| Datoteka | Sadržaj |
|---|---|
| [pitanja-i-mailovi.md](pitanja-i-mailovi.md) | mailovi u ime vlasnika teretane, pitanja za sastanak, mailovi proizvođačima hardvera |
| [multisport/istrazivanje.md](multisport/istrazivanje.md) | službeni put do partnerstva, uvjeti, integracije, nepoznato |
| [passsport/istrazivanje.md](passsport/istrazivanje.md) | operater, način rada partnera, fiksni QR, slovenski automatski ulaz |
| [medjunarodni-primjeri.md](medjunarodni-primjeri.md) | Wellhub, Urban Sports Club, Wellpass, Hansefit, ClassPass, Fitpass, teretane bez osoblja |
| [hrvatsko-trziste.md](hrvatsko-trziste.md) | dobavljači softvera i teretane u Hrvatskoj, Gyms4you |
| `multisport/`, `passsport/`, `wellhub/`, `walletap/`, `gyms4you/` | spremljeni PDF-ovi stranica |

Kontakti: Benefit Systems Hrvatska kontakt@benefitsystems.hr, 0800 222 023, obrazac [benefitsystems.hr/ponuda](https://www.benefitsystems.hr/ponuda/?o=2) (opcija "Ja sam vlasnik objekta", nema opcije za dobavljače softvera); PassSport info@passsport.com, 0800 0012, obrazac [passsport.com/hr/offer](https://passsport.com/hr/offer); Walletap support@walletap.com, +385 99 3518 286 (vodi integraciju u produkciji, može reći kako radi u praksi).
