# Odabir hardvera, cijene, pregled vrata i pilot

Što klijentu predložiti i što napraviti prije ponude. Odluke: O-021 do O-025 ([odluke](../odluke.html#hardver)). Cijene su orijentacijske (stanje 11.-14.11.2026.), bez PDV-a osim ako piše drukčije.

## Odabir

Klijent dobiva jedan od dva paketa za ista vrata; ne kupuju se zajedno.

| Klijent želi | Paket | Napomena |
|---|---|---|
| QR (uz PIN ili bez) | **Akuvox A08S + SR01 + električni zapor 12 V DC fail-secure + lokalni most** | jedini paket s QR-om i pozivom prema našem BE-u; jedini koji može provjeriti MultiSport/PassSport kod |
| Samo PIN | **Tedee Keypad PRO + Tedee PRO/GO + Bridge** | nema ožičenja; keypad ne zove BE; ne podržava MultiSport/PassSport |
| Staklena, protupožarna ili evakuacijska vrata | nijedan bez ovlaštenog projektanta | ne nuditi bez pregleda |
| Klizna vrata | Akuvox, SR01 daje suhi kontakt (impuls) pogonu | nepotvrđeno: tip ulaza pogona i struja kontakta |

Kombinacija A08S + Tedee Dry Contact modul nije potvrđena i ne nudi se. Što klijentu reći: "Tehnički izvedivo i dokumentirano; prvu instalaciju radimo kao pilot" (O-025), ne "sigurno radi".

## Akuvox paket: materijal po vratima

| Stavka | Cijena | Napomena |
|---|---|---|
| Akuvox A08S | 228-400 € | Didactum 228 €; Allnet 406 € neto (rasprodaja); Orbita 275 € s PDV-om (stranica "discontinued"); GibiGib planovi računaju 339,84 € (Megateh). Treba ponuda |
| Akuvox SR01 | ~76-100 € | Didactum 76 €; CIE 86,98 £ s PDV-om |
| Električni zapor 12 V DC fail-secure za drvo | 36-97 € | konkretan model nakon pregleda vrata. Raniji kandidati effeff 118 su 22-42 V i **ne odgovaraju** |
| Napajanje 12 V (SIB PS05 12 V/5 A s mjestom za bateriju) | ~51 € | ili 12 V/3 A za ~13 € (kao u planu za 4 ulaza); SR01 traži najmanje 12 V/0,6 A |
| Tipka izlaza, magnetski kontakt, nužna tipka | ~35-80 € | |
| PoE injektor ili switch i kabel | ~70-150 € | |
| Lokalni most (Raspberry Pi) | ~60-100 € | procjena |
| **Materijal** | **~520-980 €** | zbroj raspona |
| Montaža i puštanje u rad | ~300-800 € | procjena, nije ponuda |

Zaštita zasuna (latch guard) za vrata koja se otvaraju prema van: cijena nepoznata.

## Tedee paket

| Stavka | Cijena |
|---|---|
| Keypad PRO | 129 € s PDV-om ([tedee.com](https://tedee.com/product/tedee-keypad-pro-black/)) |
| Bridge | 79 € s PDV-om |
| Tedee GO | ~199 € (stariji izvor); cijena PRO nije nađena |
| **Ukupno** | ~400 € s PDV-om bez montaže (s GO) |

## Alternativa za partnerske kartice (privremena)

Drugi čitač paralelno na istu bravu preko dobavljača koji već ima integraciju (Walletap od 103 € mjesečno + 19 € po čitaču, bez PDV-a, hardver i ugradnja posebno; amidal amiFIT, cijena nepoznata). Odbačeno kao trajno rješenje (O-026): dva sustava, evidencija izvan našeg. SR01 uz paralelni relej gubi smisao (zaobilaženje).

## Pregled vrata (prije cijene)

Fotografije: rub krila s čeonom pločom, okvir na strani brave izbliza s mjerilom, unutarnja i vanjska kvaka, strana šarki, zid za čitač, naljepnica na krilu ili okviru.

**Brava i kvaka**
1. Ima li na boku krila čelnu ploču s rupom za zasun; ugradna brava? Što piše na ploči?
2. Je li ključanica europski profilni cilindar (vijak na boku) ili brava na običan ključ?
3. Što radi vanjska kvaka (okreće li se, povlači li zasun) i što radi ključ (povlači zasun ili baca dodatni)?
4. Ima li samozatvarač; hvata li zasun?
5. Naljepnica protupožarnih ili dimnih vrata?
6. **Tedee GO:** test hitne funkcije cilindra s dva ključa (ključ s jedne strane mora i dalje okretati cilindar s druge).

**Mjere i materijali**
7. Širina i debljina krila, širina okvira, dubina falca, razmak krila i okvira, razmak os ključanice do ruba krila, kvake i okvira. **Tedee: kod vrata koja se otvaraju prema van najmanje 40 mm (GO) ili 30 mm (PRO) od središta ključanice do okvira; uska vrata (<90 cm) 35 mm.**
8. Materijal okvira (drvo, MDF, zidni, metal) i debljina stijenke (zapor traži izrez koji ne smije oslabiti okvir).
9. Krilo: puno drvo ili šuplje (saće), debljina furnira.
10. Mjesto za čitač na zidu u visini kvake (najviše 1100 mm do dna panela), čvrst zid (opeka ili beton); najmanje 2 m od svjetla i 3 m od prozora i vrata za QR.

**Smjer i šarke**
11. Strana šarki i otvaraju li se vrata prema van; što je vani (stubište, hodnik, propuh, vlaga).

**Kabeli i napajanje**
12. Kabelski put do okvira i do čitača; najbliža utičnica 230 V i mreža (RJ45, PoE).
13. RS-485 upletena parica od čitača do SR01 (najviše 300 m); mjesto za napajanje s baterijom, SR01 i most (zaključano, unutra).

**Propisi i vlasništvo**
14. Je li ovo glavni ili jedini izlaz; koliko ljudi; evakuacijski put (stubište)?
15. Elaborat zaštite od požara; koga pitati (vlasnik zgrade, upravitelj)?
16. Tko je vlasnik vrata i okvira; treba li pristanak za bušenje i izrez?
17. Je li vrata pod kontrolom vatrodojave (oslobađanje po alarmu)?

**Pitanja instalateru (pisano)**
1. Je li zasun kompatibilan s prihvatnikom za vrata koja se otvaraju prema van; može li pokazati izjavu proizvođača? Treba li latch guard?
2. Najveća sila (preload, sideload) koju prihvatnik izdrži.
3. Je li krilo ili okvir protupožarno i smije li se mijenjati?
4. Fail-secure ili fail-safe; hoće li kvaka uvijek otvarati iznutra; treba li zeleni nužni taster i veza s vatrodojavom; potpis i dokumentacija.
5. Pisano jamstvo za ugradnju i odgovornost za evakuaciju.
6. Cijena po vratima (izrez u okviru, kabeliranje, napajanje, puštanje u rad).
7. Može li se proba napraviti na jednom komadu prije ugradnje?

## Evakuacija i propisi (iz ranijeg istraživanja, potvrditi s instalaterom)

- Vrata na putu evakuacije (osim stanova i prostora u kojem se okuplja manje od 50 ljudi) moraju imati protupaničnu opremu prema HRN EN 179 i/ili HRN EN 1125; EN 13637 za električki kontrolirane izlaze (Pravilnik o otpornosti na požar, NN 29/13 i 87/15).
- Na protupožarnim vratima zapor mora biti fail-secure (Von Duprin; za "life safety" izlaz zahtjev je suprotan u SAD-u, u Hrvatskoj pitanje ovlaštenom instalateru).
- Je li ova teretana izlaz za evakuaciju i koji propis točno vrijedi za električni zapor: **nepotvrđeno**. Potpisuje ovlašteni projektant ili instalater i vlasnik zgrade. Tedee ne podržava protupanične brave.

## Pilot na jednim vratima (O-025)

Prije prve instalacije test na stolu s jednim A08S, SR01 i testnim zaporom: popis testova je u [ugovoru Akuvox](ugovori/akuvox-a08s.md#6-testovi-na-uređaju-koji-zatvaraju-nepotvrđeno) (zapis zahtjeva, QR, PIN, `OpenDoor` SA/SB, firmware, HTTPS), a za Tedee u [ugovoru Tedee](ugovori/tedee.md#7-testovi-na-bravi). Upiti proizvođačima su poslani e-mailom ([pitanja i mailovi](partneri/pitanja-i-mailovi.md)). Ako odgovora nema, test na uređaju je jedini put do potvrde.
