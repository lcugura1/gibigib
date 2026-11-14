# PassSport: dubinsko istraživanje (14.11.2026.)

Izvor: javne stranice čitane 14.11.2026. Oznake: **potvrđeno** = pročitana stranica ili izvorni odgovor, **nepotvrđeno** = isječak pretrage ili zaključak. Nisu svi izvori ponovno provjereni.

## Tko je PassSport

- PassSport d.o.o., Slavonska avenija 1C, Zagreb; osnovan 4.8.2023.; uprava: Dinko Magazin i Vesna Jurković; prihod 2025. oko 3,03 M€, 20 zaposlenih ([uvjeti korištenja](https://passsport.com/hr/terms-of-use), [CompanyWall](https://www.companywall.hr/tvrtka/passsport-doo/MMSDP5bq)).
- Aplikacije izdane 19.12.2023. (korisnička "PassSport!" i partnerska "PassSport Scanner"). Najraniji partnerski post: City Fitness Osijek, 8.2.2024.
- Mreža: 1273 lokacije (HR 588, SRB 331, SLO 214, Kosovo 71, Albanija 69), uključuje i partnere koji nisu teretane.
- Veza s MultiSportom ili Fitness Passportom nije nađena.

## Kako partneri danas provjeravaju

- Osoblje koristi **mobilnu aplikaciju PassSport Scanner** ("skeniraj korisnike prije ulaska", praćenje dolazaka u stvarnom vremenu). Namjenski hardver nigdje nije spomenut ([Google Play](https://play.google.com/store/apps/details?id=com.passsport.scanner)).
- Partnerski portal: app.passsport.com (postojanje potvrđeno, namjene ruta zaključene po nazivima).
- Uvjeti korištenja, čl. 3: korisnik se identificira "putem QR koda, jednokratne lozinke (OTP), NFC-a ili drugih" postupaka. Jedna posjeta dnevno, najviše 60 minuta, otkazivanje u roku od 15 minuta. Da je 8-znamenkasti PIN taj OTP: nepotvrđeno zaključak.
- **Javni API ili dokumentacija ne postoje** (api.passsport.com vraća 401, ostali poddomene ne postoje).

## Kako PassSport korisnici ulaze kad nema osoblja (potvrđeno, opisi lokacija na passsport.com)

- **Hrvatska, fiksni QR:** član u aplikaciji ("Tvoja kartica" → fotoaparat) sam skenira **fiksni QR kod na ulazu ili recepciji** i time registrira dolazak. Primjeri: La Fit Dugo Selo, THE Gym Jastrebarsko, KK Fitness Pula (0-24), Powerfit Kneževi Vinogradi (0-24), Winners Factory Zaprešić. Vrata tada otvara teretanin vlastiti sustav ili su otključana.
- **Hrvatska, teretanin vlastiti pristup:** Balance Gym Osijek (0-24): prvo javljanje na recepciji, zatim pristup preko aplikacije sportskog centra; Legacy Gym Kukuljanovo: PassSport samo u radno vrijeme recepcije.
- **Slovenija, automatski ulaz:** 15 teretana navodi "skenirajte kodu na omejilniku vstopa za avtomatski vstop in izstop". Aplikacija to zove "1-click" funkcija (verzija 2.0.0, studeni 2024.). Kako točno radi i koji su proizvođači kapija: nepotvrđeno.
- Athlete Gym (Škofja Loka, 24/7): PassSport skeniranje je obavezno uz vlastiti 24/7 pristup, a kazna za izostanak je 20 €. Vrata radi teretanin sustav, PassSport se bilježi zasebno.

## GPS

FAQ: QR je "povezan s vašom trenutnom GPS lokacijom". Bilješke izdanja: lokacija se dohvaća pri generiranju QR-a, a skener traži da osoblje provjeri lokaciju. Prag udaljenosti nije objavljen.

## Treće strane

- Walletap navodi da se PassSport povezuje s njim u Hrvatskoj (član skenira QR, Walletap provjeri i otvori vrata). Kako provjera radi i tko izdaje podatke: nije navedeno ([Walletap Membership](https://www.walletap.com/membership)).
- Pro-Gym (Istra) slučaj korištenja ne spominje PassSport.
- Nijedan drugi softver s PassSport integracijom nije nađen.

## Zahtjev za suradnju

Obrazac [passsport.com/hr/offer](https://passsport.com/hr/offer) ("Ja sam vlasnik objekta") ima polja za ime, objekt, web, e-mail, telefon, grad i poruku. Tehničkih polja nema, pa se tehnički zahtjev piše u poruku. Kontakti: info@passsport.com, support@passsport.com, 0800 0012.

## Zaključci za nas

1. Za PassSport postoji **fiksni QR na ulazu koji član skenira svojom aplikacijom**: to je obrnuti model od našeg (čitač skenira mobitel). Taj tok ne otvara vrata sam po sebi, nego samo bilježi dolazak. Vrata tada otključava naš sustav ili su otključana.
2. Slovenski "automatski ulaz" pokazuje da PassSport ima mehanizam koji otvara kapiju, ali nije dokumentiran.
3. Obrazac na webu je izvediv put za prvi kontakt.

Pitanja koja treba postaviti: vidi [../pitanja-i-mailovi.md](../pitanja-i-mailovi.md).
