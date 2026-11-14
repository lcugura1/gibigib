# Ugovor: Wellhub (Gympass), javni Access Control API

Jedini agregator s javno dokumentiranim API-jem za kontrolu pristupa. Prisutnost Wellhuba u Hrvatskoj nije potvrđena, pa je ovo referentni model i rezerva. PDF-ovi: [partneri/wellhub](../partneri/wellhub). Izvor: [developers.wellhub.com](https://developers.wellhub.com/product/access-control-api/1.0/getting-started).

## Tok

1. Član se prijavi (check-in) u Wellhub aplikaciji. Bez check-ina provjera se odbija.
2. Sustav teretane zove `POST https://api.partners.gympass.com/access/v1/validate` unutar 20 minuta.
3. Uspjeh: vrata se otvaraju, posjeta se bilježi za isplatu. Greške: nije nađen, već validiran, istekao, otkazan.

## Zahtjev

| Stavka | Vrijednost |
|---|---|
| Autentikacija | `Authorization: Bearer <Wellhub token>`, zaglavlje `X-Gym-Id` (starije integracije s `X-Api-Key` još vrijede) |
| Tijelo | `{"gympass_id": "<13 znamenki>", "custom_code": "<najviše 13 znakova, opcionalno>"}` |
| Testno okruženje | `https://apitesting.partners.gympass.com/access/v1` |
| Ponavljanje nakon timeouta | sigurno: "No more than one validation will be recorded" |
| Ručni povrat | stranica u partnerskom portalu, bez offline načina |

## Vlastiti kodovi i webhook

- **Vlastiti kod teretane** (QR ili PIN, najviše 13 znakova) šalje se Wellhubu: `POST/PUT/DELETE /access/v1/code/:wellhub_id`, pa član njime ulazi.
- **Check-in webhook:** potpis `X-Gympass-Signature` (HMAC-SHA1), odgovor unutar 1 s, 3 pokušaja, zaglavlje `Idempotency-Key`. Tijelo nosi Wellhub ID, ime, e-mail, telefon, koordinate, teretanu i proizvod. "Profile Automation" stvara profil pri prvoj posjeti bez osoblja.
- Obavezna je implementacija "Automated Trigger" (check-in webhook plus sinkroni poziv `validate`), uz još jednu od metoda Gate System Trigger ili Attendance Trigger.
- Jedna posjeta dnevno; lokacijske usluge obavezne u aplikaciji; član se prvi put registrira u sustavu teretane (Wellhub ID).
