|Päivämäärä|Työaika tunteina|Kuvaus|Push|
|:----|:----|:----|:----|
|Su 17.9.23|2|Backendin työstö aloitettu käyttäen GraphQl:ää. Kaveripyyntölogiikan kehitys aloitettu.|Kyllä|
|Ma 18.9.23|1|Kaveripyynnön lähetys ja hyväksyminen toimii backend.|Kyllä|
|Ti 19.9.23|2|Backend, kaveripyynnön hylkääminen toimii, yksinkertainen viestin lähetys toimii|Kyllä|
|To 21.9.23|2|Frontendin kehitys aloitettu, kirjautumislomake ilman toimintoja|Kyllä|
|La 23.9.23|2|Kirjautuminen toimii, lisatty ApolloContext, asyncStorage, ekä apolloClient|Kyllä|
|Ma 2.10.23|2|Kirjautuneen käyttäjän access token tallennetaan. Uloskirjautuminen toimii|Kyllä|
|La 7.10.23|3|Alanavigointi luuranko luotu, käyttäjän kaverien kysely onnistuu, Conversation-malli luotu käyttäjien viestien tallentamiseen|Kyllä|
|Ti 5.12.23|2|Backend refaktoroitu käyttämään Node.js expressiä|Kyllä|
|Ke 6.12.23|1,5|Testien korjausta|Ei|
|To 7.12.23|3|Backendiin kirjoitettu lisää testejä|Kyllä|
|Pe 8.12.23|3|Frontend aloitettu alusta. Sisään- ja uloskirjaus toimii. Lisätty UserContext ja luotu custom hookeja.|Kyllä|
|Ma 11.12.23|3|Lisää frontendin kehitystä, otettu Tab ja Drawer navigaatio käyttöön. Sovellus toimii puhelimella Expo sovelluksen kautta.|Kyllä|
|Ma 11.12.23|2,5|Lisätty näkymät kirjautumiselle ja uuden käyttäjän rekisteröinnille.  Lisätty näkymä jossa käyttäjä voi etsiä toisia käyttäjiä käyttäjänimellä. Kyseiseen näkymään lisätty loputon scrollaus ja sivutus.|Kyllä|
|Ma 11.12.23|2|Kirjautumis näkymää personoitu. Jatkettu rekisteröimislomakkeen luomista, käyttäjän profiilikuvan lataamisessa ongelmia. Luotu CustomButton komponentti|Kyllä|
|Ti 12.12.23|3|Korjattu navigointivirhe. Käyttäjä voi valita kuvan puhelimensa galleriasta. Lisätty tekstikenttien validointia kirjautumiseen ja rekisteröintiin|Kyllä|
|Ke 13.12.23|1,5|Luodessa uutta käyttäjää, jos käyttäjä on lisännyt kuvan, kuva ladataan Cloudinary palvelimelle, jotta sitä voidaan käyttää myöhemmin sovelluksessa. Lisätty oletuskuva, jos käyttäjä ei ole lisännyt profiilikuvaa|Kyllä|
|Ke 13.12.23|1|Korjattu UserContext bugi, jossa kirjautuessa sisään, sovellus kirjautui edellisen kirjautuneen käyttäjän profiiliin.|Kyllä|
|Ke 13.12.23|1|Käyttäjien hausta suodatettu oma profiili sekä duplikaattikäyttäjät pois.|Kyllä|
|To 14.12.23|5|Lisätty validointi käyttäjänimelle fronttiin ja backendiin. Lisätty virheenhallintaa rekisteröintiin. Sovelluksessa voi luoda käyttäjän ilman lataamatta profiilikuvaa. Rekisteröinnin jälkeen, uusi käyttäjä kirjataan sisään ja uudelleenohjataan kotinäyttöön. Käyttäjän etsimistä refaktoroitu, jos kyselyä muutetaan, näytetään kokonaan uudet tulokset. Muutettu käyttäjien etsinnän backendin logiikkaa että etsiminen aloitetaan käyttäjänimen alusta. Lisätty kelluva nappi josta myöhemmin aloitetaan uusi keskustelu. Samanlainen kelluva nappi lisätty myös Feed näyttöön. Refaktorointia, kirjautumis ja rekisteröintinäkymät eivät enää vilahda näkyvissä kirjautumisen / rekisteröinnin jälkeen. Kaveripyynnön lähetys fronttiin toimii.|Kyllä|
|Pe 15.12.23|3,5|Etsi käyttäjiä näytössä, jos käyttäjä on jo kaveri, lisää kaveri näppäin on sumennettu, eikä duplikaattipyyntöä lähetetä. Kirjautunut käyttäjä näkee, ketkä hänelle ovat lähettäneet kaveripyynnön. Kaveripyynnön hyväksyminen toimii.|Kyllä|
|Ke 20.12.23|2,5|Kaveripyynnön hylkäys toimii. Korjattu bugi, jossa uudelleenohjattiin Home näkymään päivittäessä käyttäjän tilaa|Kyllä|
|Ke 20.12.23|1,5|Drawer navigaation muokkausta että se näyttäisi käyttäjän odottavat kaveripyynnöt|Kyllä|
|To 21.12.23|4|MyDrawer komponenttia muokattu että se näyttää odottavien kaveripyyntöjen määrän. Drawer myös sijoitettu sisäkkäin yhden komponentin alle. Uuden keskustelun aloitus toimii, viestien lähetys keskustelussa toimii käyttäjää vaihtaessa. Paljon debuggausta null erroreista. Tehty muutoksia backendiin, viestin lähetys ei enää aloita uutta keskustelua, vaan uusi keskustelu luodaan ja aletaan lähettämään tähän keskusteluun viestejä|Kyllä|
|Pe 22.12.23|6|Refaktoroitu kaverien haku, joiden kanssa käyttäjällä on avoimia keskusteluita omaan custom hookkin. Refaktoroitu Chatin logiikka custom hookkiin ja lisätty latausnäyttö. Korjattu bugi jossa viestit eivät näkyneet. Chat automaattisesti kelaa itsensä viimeisimpään viestiin avattaessa Chatin. Keskustelut näkymä näyttää viimeisimmän viestin keskustelussa. Viestien lähetys toimii. Aloitettu WebSockettien kokeilua|Kyllä|
|15.1.2024|2|Viestien lähetys onnistui websocketilla reaaliajassa|Kyllä|
|16.1.2024|2,5|Lisää websocketin konfigurointia. Keskustelu järjestää viestit viimeisimmän lähetetyn viestin mukaan|Kyllä|
|17.1.2024|4|Viestien lähetys toimii oikeaoppisesti websocketien avulla. Viestit eivät enää mene http endpointien kautta.|Ei|
|19.1.2024|2,5|Keskustelulistauksen viimeisin viesti päivittyy reaaliajassa. Yritetty työstää lukemattomien viestin indikaattoria|Kyllä|
|19.2.2024|2|Websocketin toiminta refaktoroitu pois index.js:stä. Backendiin lisätty endpointit ja skeemat Postauksen lisäämistä varten|Kyllä|
|20.2.2024|3|Lisätty toiminnallisuuksia uuden postauksen lisäämistä varten fronttiin ja kaverien postauksien näyttämistä varten|Kyllä|
|21.2.2024|4|Kuvan lisääminen uuteen postaukseen toimii. Postaukset päivittyvät kun uusi postaus on tehty. Latausruutu lisätty kun postaus on käynnissä. Postausten järjestäminen toimii. Korjattu bugi jossa sovellus kaatui uutta keskustelua aloittaessa. Korjattu bugi, jossa kaveripyynnön lähettäneellä käyttäjällä jumi ilmoitus jossa hänelläkin on yksi odottava kaveripyyntö|Kyllä|
|28.2.2024|3|Postauksen tykkääminen ja kommentointi toimii. Lisätty animaatio postausta tykättäessä. Korjailtu Git konflikteja.|Kyllä|
|29.2.2024|3,5|Muokattu uuden postauksen komponenttia hienommaksi, ja refaktoroitu yksi Postaus omaan tiedostoon. Lisätty pull to refresh Feediin. Korjattu bugi, jossa kirjautnut käyttäjä pystyi navigoimaan takaisin kirjautumis, tai rekisteröinnin latausruutuun painaessa laitteen omia takaisinpäin navigointi näppäimiä. Odottavien kaveripyyntöjen ilmoituksia ei enää näytetä sille käyttäjälle joka on lähettänyt pyynnöt|Kyllä|
|29.5.2024|3|Ei pystytä enää aloittamaan uutta keskustelua henkilön kanssa, jonka kanssa on jo aloitettu keskustelu (duplikaatti). Keskustelun poisto onnistuu, postaa kummaltakin käyttäjältä.|Kyllä|
|30.5.2024|3|Aloitettu kaveripyynnön lähettämistä ja vastaanottamista käyttäen websoketia. Palattu takaisin websocketista, käytetty scroll to refresh hetken aikaa.|Ei|
|31.5.2024|2|Kaveripyynnön lähetys toimii socket.io websocketin avulla. |Kyllä|
|3.6.2024|3|Kaveripyyntölista päivittyy reaaliajassa kun on muodostettu yhteys sockettiin. SocketContext?|Kyllä|
|6.6.2024|3,5|Kaveripyynnöt toimivat reaaliajassa! Socket.io käsittely siirretty frontissa ylemmälle komponentille, että ei tarvitse käydä ensin komponentissa ennen kuin yhteys sockettiin muodostetaan.|Kyllä|
|11.6.2024|7,5|Kaveripyynnön hyväksymisen jälkeen, kaverilista päivittyy reaaliajassa myös käyttäjälle joka lähetti kaveripyynnön. Refaktoroitu Chatin logiikka käyttämään myös Socket.io:ta, voidaan tehdä yhteyspyynnöt yhteen porttiin. Koodin refaktorointia ja kommentointia|Kyllä|
|12.6.2024|6,5|Postauksen kommenttikentän avaavan ikonin vieressä näytetään nyt postauksen kommenttien lukumäärä. Aloitettu ensimmäistä frontin julkaisua eas updatella. Lisätty testejä backendiin.  Palvelin deployattu fly.io:lla. Yritetään saada julkaisuversiota frontista toimimaan etäpalvelimen kanssa. Yritetty myös saada sovellusta toimimaan Google Consolella, että sen voisi julkaista google play storeen testaamista varten|Kyllä|
|13.6.2024|2|Sovellus saatu toimimaan expon sivuston kautta qr-koodin avulla. Yhteys etäpalvelimeen toimii myös. Sovellus ei tunnu toimivan play storessa, sovelluksen saa ladattua play storeen, mutta se ei aukea puhelimessa.|Kyllä|
|14.6.2024|6|Kirjoitettu testejä put reiteille backendiin. Täydennetty post reitin testejä ja luotu testit backendin get reiteille. Aloitettu pienen workflowin konfigurointi, ei saatu MongoDb:tä tarvitsevia testejä toimimaan Github actioneissa. Lisätty latausnäyttö kun käyttäjä kirjautuu sisään. Kaverit listasta tehty selattava, pieniä muutoksia kaveripyyntöihin. Kaverit joiden kanssa voi aloittaa keskustelun listauksesta tehty selattava. Pieniä korjauksia Chattiin, viesti näytetään heti kun lähetetään, eikä odoteta vastausta palvelimelta.|Kyllä|
|25.6.2024|5|Konfiguroitu github action pipeline, joka linttaa, testaa ja deployaa backendin. Frontend lintataan myös. Master branch suojattu. Muutettu lähetä viesti napin ulkomuotoa. Toteutettu näkymä, josta näkee yhden kaverin tiedot, sekä postaukset|Kyllä|
|26.6.2024|2|Lisätty yksinkertainen animaatio akverit listassa kaveri komponenttia klikattaessa. Lisätty latausruutu yksittäisen kaverin näkymään. Kaverien hakeminen ja päivitys refaktoroitu omaan custom hookiin pois kaverilistasta|Kyllä|
|3.7.2024|3|Alettu toteuttamaan salausta viesteille|Ei|
|4.7.2024|5|Toteutettu yksinkertainen salaus viesteille. Emojit menivät rikki salatessa, joten emojit otetaan irti ennen salaamista ja lisätään myöhemmin kun viesti decryptataan. TextInput kentät trimmaavat turhat välilyönnit kun inputista painetaan pois. Korjattu keskustelun poiston toiminta. Luotu näkymä josta käyttäjä näkee oman profiilinsa sekä pystyy muokkaamaan omia tietojansa. |Kyllä|
|5.7.2024|1,5|Käyttäjä voi vaihtaa oman profiilikuvansa Profiili sivulta|Kyllä|
|5.7.2024|1|Näppäimistö ei enää peitä text inputteja Profiili sivulla|Kyllä|
|5.7.2024|1|Sovelluksen tyylimuutoksia|Kyllä|
|5.7.2024|2|Tyylitelty Profiilisivua lisää ja lisätty valikko josta voi valita joko näkyviin käyttäjän tiedot tai käyttäjän julkaisemat postaukset.|Kyllä|
|5.7.2024|1,5|Jos käyttäjä postaa uuden postauksen Feedissä, Profiilin postaukset päivittyvät myös sinne navigoidessa. Lisätty navigointi Drawer menun profiilikuvasta käyttäjän profiiliin. Vaihdettu alaosan Tab navigointi toiseen navigointiin, jotta käyttäjä voi navigoida myös pyyhkäisyillä|Kyllä|
|6.7.2024|1|Sovelluksen tyylimuutoksia|Kyllä|
|6.7.2024|3|Korjattu rikkinäinen Chat. Reaaliaikainen viestintä ei enää toiminut salauksen toteuttamisen jälkeen|Kyllä|
|6.7.2024|3|Lisätty tällä hetkellä vielä huonosti toimiva sivutus Chattiin. Ladatessa lisää viestejä näkymä ei pysy paikallaan, vaan hyppää ylös vanhimpaan viestiin asti, joka välillä lataa lisää viestejä. Korjattu myös testit palvelimelta.|Kyllä|
|8.7.2024|6|Oikeaoppinen sivutus vihdoin toimii chatissa, kiitos react-query|Kyllä|
|9.7.2024|0,2|Pieniä tyylimuutoksia|Kyllä|
|15.7.2024|3,5|Viimeisimmän lähetetyn viestin aikaleima näytetään nyt myös Conversation näkymässä. Lisätty funktio joka muotoilee aikaleiman tarpeen mukaisesti. Refaktorointia sekä tyylimuutoksia. Refaktoroitu kaveripyynnön haku, hyväksyntä, sekä hylkäys pois FriendRequests komponentista omaksi custom hookiksi. Muokattu yhden kaverin tiedot ja postaukset näyttävä komponentti Friend näyttämään samalta kuin Profile komponentti.|Kyllä|
|15.7.2024|2,5|Kaverit lista ja kaverien listaus järjestyy aakkosjärjestyksessä. Conversation näkymässä korjattu viimeisimmän viestin mukaan järjestys. Lisää refaktorointia ja kommentointia.|Kyllä|
|16.7.2024|2|Lisää kommentointia ja refaktorointia. Yhden kaverin näkymässä navigointipalkissa näkyy nyt kaverin käyttäjänimi|Kyllä|
|16.7.2024|2|Lisää kommentointia ja refaktorointia.|Kyllä|
|16.7.2024|1,20|Turhien tiedostojen ja koodin siivousta. Lisätty autentikointi päätepisteille, korjattu palvelimen testit, ja frontendin logiikka autentikoimaan tarvittaessa.|Kyllä|
|16.7.2024|3|Lisää kommentointia. Socket.io:n logiikka refaktoroitu pois backendin index.js:stä. Frontendistä korjattu vika jossa vastaanottajalla emojien järjestys meni sekaisin. Socketin toimintalogiikkaa muutettu että palvelin ei anna virheilmoituksia jos toinen käyttäjä ei ole liittyneenä sockettiin lähettäessä viestejä / kaveripyyntöjä. Poistetty käyttämättömiä tyylejä. Muutettu frontendin kansiojärjestystä. Muutettu viesti objektien maksimi leveyttä.|Kyllä|
|17.7.2024|5|Muutettu backendin logiikkaa taas, jos soketti on kiinni, backendi vain log:aa asiasta. Vaihdettu fly.io palvelimen regioni olemaan sama MongoDB regionin kanssa, lisätty health checkit palvelimelle. Muutettu kirjautumisruudun latausikkunaa että se näytetään samantien kun kirjaudu nappia painetaan. Muutettu rekisteröinnin latausikkunoita että ensin näytetään rekisteröinnin latausikkuna, sen jälkeen kirjautumisen. Readme:n päivitystä ja ohjeiden kirjoitusta.|Kyllä|
|17.7.2024|2|Korjattu kirjautumissivun latausruutu. Ei enää jumi latausruutuun painettaessa sign in väärillä / riittämättömillä tiedoilla. Poistettu health checkit fly.io palvelimelta, koska ne aiheuttivat todella paljon websocket yhteyksien katkoja.|Kyllä|
| |179,4| | |