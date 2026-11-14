# Ugovor: Tedee (Keypad PRO, PRO/GO, Bridge, cloud API)

Što API očekuje i vraća kad BE izdaje kratkotrajne PIN-ove za bravu. Kontekst za pisanje koda. Izvori: [izvori/tedee](../izvori/tedee/README.md) (audit 14.11.2026.). Ništa nije testirano na stvarnoj bravi. Oznake: **dokumentirano**, **nepotvrđeno**, **test**.

Osnova: `https://api.tedee.com/api/v37`. Ako je verzija API-ja drukčija u dokumentaciji, vrijedi Swagger (`https://api.tedee.com/swagger/v37/swagger.json`).

## 1. Autentikacija

| Način | Pojedinosti |
|---|---|
| Personal Access Key (PAK) | za privatne integracije, bez interakcije korisnika. Zaglavlje `Authorization: PersonalKey <ključ>`. Vrijedi najviše 5 godina, opsezi se biraju po ključu. Za naš tok: `Device.ReadWrite` (PIN-ovi) i `DeviceActivity.Read` (zapisnik); `Lock.Operate` samo za daljinsko otključavanje |
| OAuth | za javne servise. Traži client id koji izdaje Tedee (oko 2 tjedna). Token vrijedi 4 sata, refresh 14 dana |
| Webhookovi | **traže OAuth i registriranu aplikaciju**, a brava mora biti uparena s Bridgeom |

Uvjeti korištenja API-ja: prije komercijalizacije može biti potreban tehnički pregled integracije; nema SLA. Treba li pregled za PAK: nepotvrđeno.

## 2. Izdavanje i brisanje PIN-a

`POST /my/lock/{id}/pin` (zaglavlje `Content-Type: application/json-patch+json`)

```json
{
  "alias": "id-sesije-ili-člana",
  "pin": "918273",
  "startDate": "2026-11-14T18:00:00.000Z",
  "endDate": "2026-11-14T18:05:00.000Z",
  "dayStartTime": null,
  "dayEndTime": null,
  "weekDays": null
}
```

- **Pravila PIN-a:** 5-8 znamenki, samo brojevi, najmanje 3 različite znamenke, ne smije biti strogo rastući ni padajući niz (npr. `12345`).
- **Odgovor:** `201` s `{"result": {"id": 3}, "success": true, ...}`.
- **Kodovi grešaka:** `400` PIN ne zadovoljava pravila; `403` nema ovlasti za bravu; `406` PIN već postoji; `408` istek pri slanju uređaju; `409` druga PIN operacija za tu bravu je u tijeku; `412` (RTD) ili `422` (Swagger) "adding more pins is not available" (**obraditi oba**); `428` brava nije povezana ili postavka uređaja nije ispravna; `429` ograničenje zahtjeva uz zaglavlje `Retry-After`.
- Datumi su puni ISO datum-vremena. Brava ih čuva kao Unix sekunde i sekunde od ponoći (`dayStartTime`/`dayEndTime` 0-86399). Svi primjeri koriste cijele sate. **Nepotvrđeno:** minutna preciznost, vremenska zona za PIN polja, zaokruživanje i najmanje trajanje. **Test.**
- `alias`: najviše 32 bajta UTF-8 (ograničenje brave). Zapisnik aktivnosti vraća alias, ne ID PIN-a, pa u njega upisati ID člana ili sesije, ne osobne podatke.
- Istek: PIN-ovi s `endDate` brišu se sami ("automatically removed from the system once they expire"), pa brisanje treba samo za opoziv. **Nedokumentirano:** kad se oslobađa mjesto na bravi i broji li se istekli PIN do uklanjanja u limit od 100.
- Ostalo: `GET /my/lock/{id}/pin` (popis, `?listVersion=` vraća 304 ako se ništa nije promijenilo), `GET /my/lock/{id}/pin/{pinId}`, `PUT` (izmjena, prvo pročitati PIN), `DELETE /my/lock/{id}/pin/{pinId}`.
- **Upravljanje PIN-ovima preko API-ja traži Bridge** uparen s bravom i keypadom.

## 3. Ograničenja koja diktiraju dizajn

| Ograničenje | Posljedica za kod |
|---|---|
| 700 zahtjeva po satu po korisničkom računu | brojač zahtjeva po računu; planirati s manje. 40 izdavanja u 15 minuta je ~160 izdavanja i 160 brisanja na sat; polling zapisnika svakih 10 s sam troši 360 na sat |
| Jedna PIN operacija po bravi odjednom (409) | red po bravi, ponavljanje kod 409 s kratkom odgodom |
| Poziv je sinkron preko Bridgea i BLE-a (Bridge ~1 s po BLE poruci); latencija stvaranja nije objavljena | izdavanje PIN-a prije prikaza korisniku, s vremenskim ograničenjem; korisnička poruka dok traje. **Test** |
| 100 PIN-ova po bravi | kratki rokovi valjanosti; ne držati trajne PIN-ove za članove |
| Korisnici javljaju do 10 s za cloud otključavanje u gužvi (forum, stariji podatak) | ne računati na brz odgovor |
| Bridge ili internet nedostupan: novi PIN se ne može izdati (428) | porukom reći korisniku; osoblje ima ručni PIN u keypadu |

## 4. Evidencija ulaza (zapisnik aktivnosti)

Webhooka za korištenje PIN-a **nema**. Webhookovi su samo: razina baterije, promjena veze, promjena postavki, promjena stanja brave (bez izvora i korisnika) i zvonce. Dokumentirani put je polling zapisnika:

`GET /my/deviceactivity?deviceId={id}&elements=200&lastElemDate={ISO}` (opseg `DeviceActivity.Read`, najviše 200, straničenje po `lastElemDate`).

Polja zapisa: `id`, `deviceId`, `userId`, `username`, `event`, `source` (0 = Device, 1 = Mobile), `date` (UTC), `pinAlias`, `accessLinkId`, `accessLinkName`.

| Događaj | Šifra |
|---|---|
| UnlockedByPin | 61 |
| IncorrectPin | 62 |
| PulledByPin | 63 |
| LockedByPin | 65 |
| ForceUnlockedByPin | 68 |
| UnauthorizedPin (PIN izvan dopuštenog razdoblja) | 75 |
| PulledAutoByPin | 76 |
| WrongPinEntryLimitReached | 95 (samo Swagger) |

Dolazak se bilježi iz događaja 61 ili 76 s `pinAlias` (ID člana ili sesije). Brava drži oko 100 zapisa dok ih Bridge ne preuzme. Kašnjenje između otključavanja i zapisa u cloudu nije objavljeno. Polling interval dijeli ograničenje od 700 zahtjeva na sat.

## 5. Keypad PRO i brava

- Unos: PIN i tipka ✓; zeleno svjetlo = uspjeh, crveno = greška. Keypad ne pohranjuje PIN-ove, provjerava ih brava. Bridge nije potreban za otključavanje, samo za daljinsko upravljanje PIN-ovima.
- **Nepotvrđeno:** rade li već upisani PIN-ovi kad Bridge ili internet ne rade (nema izričite izjave) i provode li se vremenski ograničeni PIN-ovi ispravno kad je brava offline. Ograničenje pogrešnih PIN-ova postoji (događaj 95), ali broj pokušaja i trajanje blokade nisu navedeni.
- Napajanje: 4×AAA (12+ mjeseci) ili 5-24 V DC; preporuka je žično napajanje uz baterije kao rezervu. Preporučena udaljenost do brave i Bridgea 2 m (BLE do 10 m, ovisi o krilu vrata i zidu). Jedan keypad radi s jednom bravom.
- Keypad se može ukloniti bez alata, ali ne pohranjuje PIN-ove, pa uklanjanje ništa ne otvara.
- **Tedee navodi da uređaj nije protuprovalna zaštita** (nema atesta ni razreda).

## 6. Brava i vrata

| Stavka | GO | PRO |
|---|---|---|
| Cilindar | postojeći europski profilni cilindar s hitnom funkcijom (dva ključa, okretanje jednog okreće drugi) | Tedee modularni cilindar ili europski adapter (hitna funkcija, 2 mm izbočenja) |
| Vrata koja se otvaraju prema van | najmanje 40 mm od središta ključanice do okvira | najmanje 30 mm |
| Uska vrata (<90 cm) | 35 mm ili više | 35 mm ili više |
| Višetočkovne brave | samo ako se rade okretanjem ključa; kod podizanja kvake auto-zaključavanje ne radi | isto |

Nisu kompatibilne: rim brave, asinkroni cilindri i protupanične brave. Fiksna vanjska kvaka traži pull spring.

## 7. Testovi na bravi

1. Izdati PIN s trajanjem od 3 minute i provjeriti istek, vremensku zonu i radi li izvan prvog minuta.
2. Izmjeriti latenciju izdavanja i brisanja preko clouda.
3. Izdati 40 PIN-ova u 15 minuta: ponašanje 409/408, ograničenje zahtjeva, red po bravi.
4. Kad istekli PIN oslobađa mjesto i broji li se u limit od 100.
5. Kašnjenje zapisa `UnlockedByPin` u `deviceactivity` i sadržaj `pinAlias`.
6. Prag zaključavanja pri pogrešnim PIN-ovima.
7. Rad već izdanih PIN-ova kad Bridge ili internet ne rade.
