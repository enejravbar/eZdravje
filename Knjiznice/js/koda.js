
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

var trenutniUporabnik="";
var trenutniEhrUporabnika=-1;
var prijavljen = false;
var timer1,timer2,timer3,timer4; 
var timerGenerator;

var tabelaObstojecihUporabnikov=[
    "c5df5629-94ab-443f-97ad-0fdc8d915aa8",   // c5df5629-94ab-443f-97ad-0fdc8d915aa8 pravilno
    "38825892-b31c-4045-a4ca-f357240773ef",
    "47605219-2b6e-49bc-a0a3-54f9cb60283e"
  ];
/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti


 */

google.load("visualization", "1", {
  packages: ["corechart"]
});

$(document).ready(function(){
  //console.log("trenutni uporabnik je "+ trenutniUporabnik);
  /*google.load("visualization", "1", {
  packages: ["corechart"]
  });*/
  
  nadzorujDropdownObstojecihUporabnikovNaZačetku();
  nadzorujDropdownObstojecihUporabnikovObSpremembi();
  razsirjanjeInKrcenjeOken();
  
  
  izberiUporabnika();
  gumbGenerirajPodatke();
  registracijaUporabnika();
  vnosPodatkovVEHR();
  gumbOsvezi();

  ITMKalkulator();

  mainMetodaZaPripravoObroka();

});

function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */

function gumbGenerirajPodatke(){
  

  $("#gumbGenerirajPodatke").click(function(){

    clearTimeout(timerGenerator);
    odstraniElement("statusGeneriranja");

    $("#vrteciStatus").css({
     "display" : ""
    });


    for(var i=1; i<=3; i++){
      tabelaObstojecihUporabnikov[i-1]=generirajPodatke(i);
      console.log("Uporabnik "+i+ " EhrID = " + tabelaObstojecihUporabnikov[i-1]);
    }
    $("#vrteciStatus").css({
     "display" : "none"
    });
    $("#statusGeneriranja").css({
     "display" : ""
    });

    timerGenerator = setTimeout(function(){ $("#statusGeneriranja").hide('slow');}, 3500);

    trenutniUporabnik = $("#preberiPredlogoBolnika option:selected" ).text();
    
    if(trenutniUporabnik=="Calvin Harris"){
      $("#prijava-vpisEHR").val(tabelaObstojecihUporabnikov[0]);
    }
    if(trenutniUporabnik=="Ana Klašnja"){
      $("#prijava-vpisEHR").val(tabelaObstojecihUporabnikov[1]);
    }
    if(trenutniUporabnik=="Julija Tavčar"){
      $("#prijava-vpisEHR").val(tabelaObstojecihUporabnikov[2]);
    }
    

  });
}

function generirajPodatke(stPacienta) {
  var ehrIdUstvarjeni="";

  var podatkiCalvin = [ // slabi vitalni znaki - povečana telesna masa
    {datumInUra: "2013-05-23T12:23", telesnaVisina: 180, telesnaTeza: 90, telesnaTemperatura: 36.6},
    {datumInUra: "2013-07-23T12:23", telesnaVisina: 181, telesnaTeza: 95, telesnaTemperatura: 37.3},
    {datumInUra: "2014-06-23T12:23", telesnaVisina: 184, telesnaTeza: 87, telesnaTemperatura: 36.6},
    {datumInUra: "2014-11-23T12:23", telesnaVisina: 186, telesnaTeza: 90, telesnaTemperatura: 36.5},
    {datumInUra: "2015-05-21T12:23", telesnaVisina: 188, telesnaTeza: 95, telesnaTemperatura: 38.6},
    {datumInUra: "2016-05-23T12:23", telesnaVisina: 190, telesnaTeza: 98, telesnaTemperatura: 36.6}
  ];
  var podatkiAna = [ // srednje dobri vitalni znaki
    {datumInUra: "2013-05-23T12:23", telesnaVisina: 160, telesnaTeza: 72, telesnaTemperatura: 36.6},
    {datumInUra: "2013-07-23T12:23", telesnaVisina: 162, telesnaTeza: 71, telesnaTemperatura: 37.3},
    {datumInUra: "2014-06-23T12:23", telesnaVisina: 165, telesnaTeza: 70, telesnaTemperatura: 36.6},
    {datumInUra: "2014-11-23T12:23", telesnaVisina: 166, telesnaTeza: 77, telesnaTemperatura: 36.5},
    {datumInUra: "2015-05-21T12:23", telesnaVisina: 169, telesnaTeza: 80, telesnaTemperatura: 38.6},
    {datumInUra: "2016-05-23T12:23", telesnaVisina: 172, telesnaTeza: 73, telesnaTemperatura: 36.6}
  ];
  var podatkiJulija = [ // dobri vitalni znaki
    {datumInUra: "2013-05-23T12:23", telesnaVisina: 170, telesnaTeza: 62, telesnaTemperatura: 36.6},
    {datumInUra: "2013-07-23T12:23", telesnaVisina: 172, telesnaTeza: 61, telesnaTemperatura: 37.3},
    {datumInUra: "2014-06-23T12:23", telesnaVisina: 175, telesnaTeza: 60, telesnaTemperatura: 36.6},
    {datumInUra: "2014-11-23T12:23", telesnaVisina: 176, telesnaTeza: 67, telesnaTemperatura: 36.5},
    {datumInUra: "2015-05-21T12:23", telesnaVisina: 180, telesnaTeza: 70, telesnaTemperatura: 38.6},
    {datumInUra: "2016-05-23T12:23", telesnaVisina: 182, telesnaTeza: 63, telesnaTemperatura: 36.6}
  ];

  switch(stPacienta){

    case 1: // Calvin Harris
      var ehrIdCalvin = kreirajEhrId("Calvin", "Harris", "1984-01-17T16:34");
      ehrIdUstvarjeni = ehrIdCalvin;
          for(var i=0; i<6; i++){
            dodajMeritve(ehrIdCalvin,podatkiCalvin[i].datumInUra,podatkiCalvin[i].telesnaVisina,podatkiCalvin[i].telesnaTeza,podatkiCalvin[i].telesnaTemperatura );
          }
      break;
      
    case 2: // Ana Klašnja
      var ehrIdAna = kreirajEhrId("Ana", "Klašnja", "1978-12-18T16:00");
      ehrIdUstvarjeni = ehrIdAna;
          for(var i=0; i<6; i++){
            dodajMeritve(ehrIdAna,podatkiAna[i].datumInUra,podatkiAna[i].telesnaVisina,podatkiAna[i].telesnaTeza,podatkiAna[i].telesnaTemperatura );
          }
      break;

    case 3: // Julija Tavčar
      var ehrIdJulija = kreirajEhrId("Julija", "Tavčar", "1996-09-12T12:00");
      ehrIdUstvarjeni = ehrIdJulija;
          for(var i=0; i<6; i++){
            dodajMeritve(ehrIdJulija,podatkiJulija[i].datumInUra,podatkiJulija[i].telesnaVisina,podatkiJulija[i].telesnaTeza,podatkiJulija[i].telesnaTemperatura );
          }
      break;
  }

  return ehrIdUstvarjeni;
}


 
function odstraniElement(elementZaIzginjanje){
  $("#"+elementZaIzginjanje).hide();
}

function onemogociPrijavoZEhr(){
   $("#prijava-vpisEHR").attr("disabled","true");
}

function omogociPrijavoZEhr(){
   $("#prijava-vpisEHR").removeAttr("disabled"
    );
}

function vpisiEhrVPrijavnoOkno(ehrId){
  $("#prijava-vpisEHR").val(ehrId);
}

function gumbOsvezi(){
  $("#gumb-osvezi").click(function(){
    if(trenutniEhrUporabnika!=-1){
      izpisPodatkovEHR(trenutniEhrUporabnika);
    }else{
      console.log("Osveževanje je onemogočeno!");
    }
    
  });
}


function nadzorujDropdownObstojecihUporabnikovNaZačetku(){
    var kontrola=0;
    $("#prijava-vpisEHR").val("");
    trenutniUporabnik = $("#preberiPredlogoBolnika option:selected" ).text();
    console.log("Prijavljen je uporabnik "+ trenutniUporabnik);

    if(trenutniUporabnik=="Calvin Harris"){
      kontrola=1;
      onemogociPrijavoZEhr();
      vpisiEhrVPrijavnoOkno(tabelaObstojecihUporabnikov[0]);
    }
    if(trenutniUporabnik=="Ana Klašnja"){
      kontrola=1;
      onemogociPrijavoZEhr();
      vpisiEhrVPrijavnoOkno(tabelaObstojecihUporabnikov[1]);
    }
    if(trenutniUporabnik=="Julija Tavčar"){
      kontrola=1;
      onemogociPrijavoZEhr();
      vpisiEhrVPrijavnoOkno(tabelaObstojecihUporabnikov[2]);
    }
    if(kontrola==0){
      $("#prijava-vpisEHR").val("");
      console.log("izvajam dovoljenje za pisanje");
      omogociPrijavoZEhr();
    }
}

function nadzorujDropdownObstojecihUporabnikovObSpremembi(){

  $("#preberiPredlogoBolnika").change(function(){
    //console.log("Izbran je bil: " + $("#preberiPredlogoBolnika option:selected" ).text());
    var kontrola=0;
    trenutniUporabnik = $("#preberiPredlogoBolnika option:selected" ).text();

    if(trenutniUporabnik=="Calvin Harris"){
      kontrola=1;
      onemogociPrijavoZEhr();
      vpisiEhrVPrijavnoOkno(tabelaObstojecihUporabnikov[0]);
    }
    if(trenutniUporabnik=="Ana Klašnja"){
      kontrola=1;
      onemogociPrijavoZEhr();
      vpisiEhrVPrijavnoOkno(tabelaObstojecihUporabnikov[1]);
    }
    if(trenutniUporabnik=="Julija Tavčar"){
      kontrola=1;
      onemogociPrijavoZEhr();
      vpisiEhrVPrijavnoOkno(tabelaObstojecihUporabnikov[2]);
    }
    if(kontrola==0){
      $("#prijava-vpisEHR").val("");

      omogociPrijavoZEhr();
    }
  });
}

function izberiUporabnika(){

  $("#gumb-prijava").click(function() {

      clearTimeout(timer1);
      odstraniElement("prijava-obvestilo-okvir");
      
      if(trenutniUporabnik=="Calvin Harris"){

        if(preveriVeljavnostEHR( tabelaObstojecihUporabnikov[0] )){
          trenutniEhrUporabnika=tabelaObstojecihUporabnikov[0];
          prijavljen=true;
          $("#vnosVEHR-ehrId").val(trenutniEhrUporabnika);
          odpriIzpisPodatkovEHR();

          $("#prijava-obvestilo-okvir").css({"display" : "inline-block"});
          $("#prijava-obvestilo-okvir").attr({"class" : "alert alert-success fade-in"});
          $("#prijava-obvestilo").html("Uporabnik \""+trenutniUporabnik+"\" je bil uspešno prijavljen.");
          timer1 = setTimeout(function(){ $("#prijava-obvestilo-okvir").hide('slow');}, 3500);

          izpisPodatkovEHR( tabelaObstojecihUporabnikov[0] );
        }else{

          trenutniEhrUporabnika=-1;
          prijavljen=false;
          zapriIzpisPodatkovEHR();

          $("#prijava-vpisEHR").attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
          $("#prijava-obvestilo-okvir").css({"display" : "inline-block"});
          $("#prijava-obvestilo-okvir").attr({"class" : "alert alert-danger fade-in"});
          $("#prijava-obvestilo").html("<b>NAPAKA!</b> Uporabnik ne obstaja.");

          timer1 = setTimeout(function(){ $("#prijava-obvestilo-okvir").hide('slow');}, 3500);
          
          return;
        }
      }

      if(trenutniUporabnik=="Ana Klašnja"){

        if(preveriVeljavnostEHR( tabelaObstojecihUporabnikov[1] )){

          trenutniEhrUporabnika=tabelaObstojecihUporabnikov[1];
          prijavljen=true;
          $("#vnosVEHR-ehrId").val(trenutniEhrUporabnika);
          odpriIzpisPodatkovEHR();

          $("#prijava-obvestilo-okvir").css({"display" : "inline-block"});
          $("#prijava-obvestilo-okvir").attr({"class" : "alert alert-success fade-in"});
          $("#prijava-obvestilo").html("Uporabnik \""+trenutniUporabnik+"\" je bil uspešno prijavljen.");

          timer1 = setTimeout(function(){ $("#prijava-obvestilo-okvir").hide('slow');}, 3500);

          izpisPodatkovEHR( tabelaObstojecihUporabnikov[1] );
        }else{

          trenutniEhrUporabnika=-1;
          prijavljen=false;
          zapriIzpisPodatkovEHR();

          $("#prijava-vpisEHR").attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
          $("#prijava-obvestilo-okvir").css({"display" : "inline-block"});
          $("#prijava-obvestilo-okvir").attr({"class" : "alert alert-danger fade-in"});
          $("#prijava-obvestilo").html("<b>NAPAKA!</b> Uporabnik ne obstaja.");

          timer1 = setTimeout(function(){ $("#prijava-obvestilo-okvir").hide('slow');}, 3500);

          return;
        }
      }

      if(trenutniUporabnik=="Julija Tavčar"){
        
        if(preveriVeljavnostEHR( tabelaObstojecihUporabnikov[2] )){
          
          trenutniEhrUporabnika=tabelaObstojecihUporabnikov[2];
          prijavljen=true; 
          $("#vnosVEHR-ehrId").val(trenutniEhrUporabnika);
          odpriIzpisPodatkovEHR();

          $("#prijava-obvestilo-okvir").css({"display" : "inline-block"});
          $("#prijava-obvestilo-okvir").attr({"class" : "alert alert-success fade-in"});
          $("#prijava-obvestilo").html("Uporabnik \""+trenutniUporabnik+"\" je bil uspešno prijavljen.");
          
          timer1 = setTimeout(function(){ $("#prijava-obvestilo-okvir").hide('slow');}, 3500);

          izpisPodatkovEHR( tabelaObstojecihUporabnikov[2] );
        }else{
          
          trenutniEhrUporabnika=-1;
          prijavljen=false;
          zapriIzpisPodatkovEHR();

          $("#prijava-vpisEHR").attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
          $("#prijava-obvestilo-okvir").css({"display" : "inline-block"});
          $("#prijava-obvestilo-okvir").attr({"class" : "alert alert-danger fade-in"});
          $("#prijava-obvestilo").html("<b>NAPAKA!</b> Uporabnik ne obstaja.");
          
          timer1 = setTimeout(function(){ $("#prijava-obvestilo-okvir").hide('slow');}, 3500);

          return;
        }
      }

      if(trenutniUporabnik==""){
        var prebraniEhr = $("#prijava-vpisEHR").val();
        console.log("Prebrani EHRId je " +prebraniEhr);
        if(preveriVeljavnostEHR( prebraniEhr )){
          
          trenutniEhrUporabnika=prebraniEhr;
          prijavljen=true;
          $("#vnosVEHR-ehrId").val(trenutniEhrUporabnika);
          odpriIzpisPodatkovEHR();

          $("#prijava-obvestilo-okvir").css({"display" : "inline-block"});
          $("#prijava-obvestilo-okvir").attr({"class" : "alert alert-success fade-in"});
          $("#prijava-obvestilo").html("Uporabnik je bil uspešno prijavljen.");

          timer1 = setTimeout(function(){ $("#prijava-obvestilo-okvir").hide('slow');}, 3500);

          izpisPodatkovEHR( prebraniEhr );
        }else{
          
          trenutniEhrUporabnika=-1;
          prijavljen=false;
          zapriIzpisPodatkovEHR();

          $("#prijava-vpisEHR").attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
          $("#prijava-obvestilo-okvir").css({"display" : "inline-block"});
          $("#prijava-obvestilo-okvir").attr({"class" : "alert alert-danger fade-in"});
          $("#prijava-obvestilo").html("<b>NAPAKA!</b> Uporabnik ne obstaja.");
          
          timer1 = setTimeout(function(){ $("#prijava-obvestilo-okvir").hide('slow');}, 3500);

          return;
        }
      }
      //izpisPodatkovEHR( "071f61ac-1e15-4a69-8cdb-4d1b7efa3b9d" );
  });
  
}
function odpriIzpisPodatkovEHR(){
  
  $("#izpisEHR-body").attr({
    "display" : ""
  });

  $("#izpisEHR-body").slideDown("slow");
  $(".posebnoOkno").attr({
    "class" : "posebnoOkno glyphicon glyphicon-menu-up"
  });

}

function zapriIzpisPodatkovEHR(){
  $("#izpisEHR-body").attr({
    "display" : ""
  });

  $("#izpisEHR-body").slideUp("slow");
  $(".posebnoOkno").attr({
    "class" : "posebnoOkno glyphicon glyphicon-menu-down"
  });
}

function izpisPodatkovEHR(ehrId){

  /*var uporabnik={
            ime: "",
            priimek: "",
            datumRojstva: "",
            telesnaTeza: [],
            telesnaTemperatura: [],
            telesnaVisina:[]
          }*/

  var uporabnik = preberiMeritve(ehrId);
  if(jeObstojeciUporabnik(ehrId)){
    if(ehrId==tabelaObstojecihUporabnikov[0]){  // Calvin Harris
      $("#prostorZaGrafe").css({"display" : ""});
      $("#osebna-slika").attr({
        "src" : "Slike/Calvin-Harris.jpg"
      });
    }
    if(ehrId==tabelaObstojecihUporabnikov[1]){  // Ana Klašnja
      $("#prostorZaGrafe").css({"display" : ""});
      $("#osebna-slika").attr({
        "src" : "Slike/Ana-Klasnja.jpg"
      });
    }
    if(ehrId==tabelaObstojecihUporabnikov[2]){  // Julija Tavčar
      $("#prostorZaGrafe").css({"display" : ""});
      $("#osebna-slika").attr({
        "src" : "Slike/Julija-Tavcar.jpg"
      });
    }

  }else{
      $("#osebna-slika").attr({
        "src" : "Slike/No-Image.jpg"
      });
  }
  //-------------- OSEBNA IZKAZNICA --------------//
  $("#izpis-ime").text(uporabnik.ime);
  $("#izpis-priimek").text(uporabnik.priimek);
  $("#izpis-datum").text(izpisDatumaVLepiObliki(uporabnik.datumRojstva));
  $("#izpis-starost").text( izracunajStarost(uporabnik.datumRojstva) );
  //console.log("Dolzina tabele je: " +uporabnik.telesnaTeza.length);
  var element = document.getElementById("nosilec-zapisov");

  if(uporabnik.telesnaTeza.length==0){
    $("#niZapisov").css({"display" : ""});
    $("#prostorZaGrafe").css({"display" : "none"});  // skrij prostor za grafe, če ni podatkov
    element.innerHTML="";
  }else{
    $("#niZapisov").css({"display" : "none"});
    $("#prostorZaGrafe").css({"display" : ""});
    
    var zac="<tr class=\"vrsticeEHR\">";
    var kon = "</tr>";
    var vrsticeHTML="";
      
    for(var i=(uporabnik.telesnaTeza.length-1); i>=0; i--){
      vrsticeHTML+= zac+"<td>"+ izpisDatumaInUreVLepiObliki(uporabnik.telesnaTeza[i].time)+"</td>";
      vrsticeHTML+= "<td>"+ uporabnik.telesnaVisina[i].height+"</td>";
      vrsticeHTML+= "<td>"+ uporabnik.telesnaTeza[i].weight+"</td>";
      vrsticeHTML+= "<td>"+ uporabnik.telesnaTemperatura[i].temperature+"</td>" + kon;
    }
    element.innerHTML=vrsticeHTML;

    console.log("sem pred izrisom grafov");
    console.log(posredujPodatkeZaGraf1(ehrId));

    // poskrbimo, da se poizvedovanje po podatkih izvede samo enkrat
    var tabela1=posredujPodatkeZaGraf1(ehrId);
    var tabela2=posredujPodatkeZaGraf2(ehrId);
    var tabela3=posredujPodatkeZaGraf3(ehrId);
    var tabela4=posredujPodatkeZaGraf4(ehrId);

    drawChart1(tabela1);
    drawChart2(tabela2);
    drawChart3(tabela3);
    drawChart4(tabela4);

    $(window).resize(function() {
      drawChart1(tabela1);
      drawChart2(tabela2);
      drawChart3(tabela3);
      drawChart4(tabela4);
    });

  }

}

function posredujPodatkeZaGraf1(ehrId){  // graf telesne višine
  var uporabnik = preberiMeritve(ehrId);
  var tabela=[];
  tabela.push(["Datum","Telesna višina"]);
  for(var i=0; i<(uporabnik.telesnaVisina.length); i++){
    tabela.push([izpisDatumaVLepiObliki(uporabnik.telesnaVisina[i].time),uporabnik.telesnaVisina[i].height]);

  }
  //console.log(tabela);
  return tabela;
}

function posredujPodatkeZaGraf2(ehrId){  // graf telesne mase
  var uporabnik = preberiMeritve(ehrId);
  var tabela=[];
  tabela.push(["Datum","Telesna masa"]);
  for(var i=0; i<(uporabnik.telesnaTeza.length); i++){
    tabela.push([izpisDatumaVLepiObliki(uporabnik.telesnaTeza[i].time),uporabnik.telesnaTeza[i].weight]);

  }
  //console.log(tabela);
  return tabela;
}

function posredujPodatkeZaGraf3(ehrId){  // graf telesne temperature
  var uporabnik = preberiMeritve(ehrId);
  var tabela=[];
  tabela.push(["Datum","Telesna temperatura"]);
  for(var i=0; i<(uporabnik.telesnaTemperatura.length); i++){
    tabela.push([izpisDatumaVLepiObliki(uporabnik.telesnaTemperatura[i].time),uporabnik.telesnaTemperatura[i].temperature]);

  }
  //console.log(tabela);
  return tabela;
}

function posredujPodatkeZaGraf4(ehrId){  // graf ITM
  var uporabnik = preberiMeritve(ehrId);
  var tabela=[];
  var masa=0;
  var visina=0;

  tabela.push(["Datum","ITM"]);
  for(var i=0; i<(uporabnik.telesnaVisina.length); i++){
    masa = uporabnik.telesnaTeza[i].weight;
    visina = uporabnik.telesnaVisina[i].height/100;
    tabela.push([izpisDatumaVLepiObliki(uporabnik.telesnaVisina[i].time), parseFloat((masa/(visina*visina)).toFixed(2)) ]);

  }
  //console.log(tabela);
  return tabela;
}

function preberiEHR(ehrId) {
  sessionId = getSessionId();
  var uporabnik;
    $.ajax({
      url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
      type: 'GET',
      async: false,
      headers: {"Ehr-Session": sessionId},
        success: function (data) {
        var party = data.party;
          uporabnik={
            ime: party.firstNames,
            priimek: party.lastNames,
            datumRojstva: party.dateOfBirth
          }
      },
      error: function(err) {
        uporabnik={};
      } 
    });

    return uporabnik;    
}

function preveriVeljavnostEHR(ehrId) {
  sessionId = getSessionId();
  var uporabnik;
    $.ajax({
      url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
      type: 'GET',
      async: false,
      headers: {"Ehr-Session": sessionId},
        success: function (data) {
        var party = data.party;
          uporabnik=true;
      },
      error: function(err) {
        uporabnik=false;
      } 
    });

    return uporabnik;    
}

function jeObstojeciUporabnik(ehrId){
  if(ehrId==tabelaObstojecihUporabnikov[0] || ehrId==tabelaObstojecihUporabnikov[1] || ehrId==tabelaObstojecihUporabnikov[2]){
    return true;
  }
  return false;
}

function izpisDatumaVLepiObliki(datumRojstva){
  //console.log("DAtum rojstva" + datumRojstva);
  var datum= datumRojstva.split("-");
  return datum[2].substring(0,2)+"."+datum[1]+"."+datum[0];
}

function izpisDatumaInUreVLepiObliki(datumRojstva){
  //console.log("Datum rojstva" + datumRojstva);
  var datum= datumRojstva.split("-");
  return datum[2].substring(0,2)+"."+datum[1]+"."+datum[0]+ "  " + datum[2].substring(3,8);
}

function izracunajStarost(datumRojstva){
  var datum= datumRojstva.split("-");
  var starost=0;
  var leto,mesec,dan;
  leto=datum[0];
  mesec=datum[1];
  dan=datum[2].substring(0,2);
  var d = new Date();
  var trenutnoLeto = d.getFullYear();
  var trenutniDan = d.getDate();
  var trenutniMesec = d.getMonth()+1;

  if(mesec==trenutniMesec){
    if(dan<=trenutniDan){
      starost=trenutnoLeto-leto;
    }else{
      starost=trenutnoLeto-leto-1;
    }
  }
  if(mesec<trenutniMesec){
    starost=trenutnoLeto-leto;
  }
  if(mesec>trenutniMesec){
    starost=trenutnoLeto-leto-1;
  }
  return starost;

}

function vnosPodatkovVEHR(){
    
    $("#gumb-vnosVEHR").click(function(){

      clearTimeout(timer2);
      odstraniElement("vnosVEHR-obvestilo-okvir");

      var ehrId = $("#vnosVEHR-ehrId").val();
      var datum = $("#vnosVEHR-datum").val();
      var ura = $("#vnosVEHR-ura").val();
      var telesnaVisina = $("#vnosVEHR-telesnaVisina").val();
      var telesnaMasa = $("#vnosVEHR-masa").val();
      var telesnaTemperatura = $("#vnosVEHR-temperatura").val();


      var napaka=false;
      var napaka1=false;
      var napaka2=false;
      var napaka3=false;

      if(!preveriVeljavnostDatuma(datum)){ 
        $("#vnosVEHR-datum").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
        napaka=true;
      }else{
        $("#vnosVEHR-datum").parent().attr({"class" : "input-group col-xs-12 col-sm-12 "});
      }

      if(!preveriVeljavnostUre(ura)){
        $("#vnosVEHR-ura").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
        napaka1=true;
      }else{
        $("#vnosVEHR-ura").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
        
      }

      if(!(telesnaTemperatura >0)){ 
        $("#vnosVEHR-temperatura").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
        napaka2=true;
      }else{
        $("#vnosVEHR-temperatura").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
      }

      if(!(telesnaMasa >0)){ 
        $("#vnosVEHR-masa").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
        napaka3=true;
      }else{
        $("#vnosVEHR-masa").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
      }

      if(!(telesnaVisina >0)){
        $("#vnosVEHR-telesnaVisina").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
        $("#vnosVEHR-obvestilo-okvir").css({"display" : "inline-block"});
        $("#vnosVEHR-obvestilo-okvir").attr({"class" : "alert alert-danger fade-in"});
        $("#vnosVEHR-obvestilo").html("<b>NAPAKA!</b> Prosim izpolnite polja pravilno.");
        timer2 = setTimeout(function(){ $("#vnosVEHR-obvestilo-okvir").hide('slow');}, 3500);
        return;
      }else{
        $("#vnosVEHR-telesnaVisina").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
        if(napaka||napaka1 || napaka2){
          $("#vnosVEHR-obvestilo-okvir").css({"display" : "inline-block"});
          $("#vnosVEHR-obvestilo-okvir").attr({"class" : "alert alert-danger fade-in"});
          $("#vnosVEHR-obvestilo").html("<b>NAPAKA</b> Prosim izpolnite polja pravilno.");
          timer2 = setTimeout(function(){ $("#vnosVEHR-obvestilo-okvir").hide('slow');}, 3500);
          return;
        }
      }
            var datumInUra = zapisiDatumRojstvaVFormatu(datum, ura)
            var statusProcesaDodajMeritve = dodajMeritve(ehrId,datumInUra,telesnaVisina,telesnaMasa,telesnaTemperatura);
            //console.log("statusProcesaDodajMeritve "+statusProcesaDodajMeritve);
            if(statusProcesaDodajMeritve==1){
              $("#vnosVEHR-obvestilo-okvir").css({"display" : "inline-block"});
              $("#vnosVEHR-obvestilo-okvir").attr({"class" : "alert alert-success fade-in"});
              $("#vnosVEHR-obvestilo").html("Podatki so bili uspešno vnešeni v EHR.");
              timer2 = setTimeout(function(){ $("#vnosVEHR-obvestilo-okvir").hide('slow');}, 3500);
            }else{
              $("#vnosVEHR-obvestilo-okvir").css({"display" : "inline-block"});
              $("#vnosVEHR-obvestilo-okvir").attr({"class" : "alert alert-danger fade-in"});
              $("#vnosVEHR-obvestilo").html("<b>NAPAKA!</b> Preverite pravilnost EhrID.");
              timer2 = setTimeout(function(){ $("#vnosVEHR-obvestilo-okvir").hide('slow');}, 3500);
            }
            
      
    });
}

function registracijaUporabnika(){

   $("#gumb-registriraj").click(function(){

      clearTimeout(timer3);
      odstraniElement("registracija-obvestilo-okvir");

      var sessionId=getSessionId();
      var ime=$("#registracija-ime").val();
      var priimek=$("#registracija-priimek").val();
      var datum=$("#registracija-datum").val();
      var ura=$("#registracija-ura").val();
      //console.log("preveriVeljavnostDatuma: " +datum+ " preveriVeljavnostUre: " + ura);
      var napaka=false;
      if(!preveriVeljavnostDatuma(datum)){ 
        $("#registracija-datum").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
        napaka=true;
      }else{
        $("#registracija-datum").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
      }
      if(!preveriVeljavnostUre(ura)){
        $("#registracija-ura").parent().attr({"class" : "input-group col-xs-12 col-sm-12 has-error"});
        $("#registracija-obvestilo-okvir").css({"display" : "inline-block"});
        $("#registracija-obvestilo-okvir").attr({"class" : "alert alert-danger fade-in"});
        $("#registracija-obvestilo").html("<strong>NAPAKA!</strong> Prosim izpolnite polja pravilno.");
        timer3 = setTimeout(function(){ $("#registracija-obvestilo-okvir").hide('slow');}, 3500);
        return;
      }else{
        $("#registracija-ura").parent().attr({"class" : "input-group col-xs-12 col-sm-12"});
        if(napaka){
          $("#registracija-obvestilo-okvir").css({"display" : "inline-block"});
          $("#registracija-obvestilo-okvir").attr({"class" : "alert alert-danger fade-in"});
          $("#registracija-obvestilo").html("<strong>NAPAKA!</strong> Prosim izpolnite polja pravilno.");
          timer3 = setTimeout(function(){ $("#registracija-obvestilo-okvir").hide('slow');}, 3500);
          return;
        }
      }

      var datumRojstva= zapisiDatumRojstvaVFormatu(datum, ura);
      //console.log("datum rojstva: " + datumRojstva);
      

     $.ajaxSetup({
            headers: {"Ehr-Session": sessionId}
        });
        $.ajax({
            url: baseUrl + "/ehr",
            type: 'POST',
            async: false,
            success: function (data) {
                var ehrId = data.ehrId;
                var partyData = {
                    firstNames: ime,
                    lastNames: priimek,
                    dateOfBirth: datumRojstva,
                    partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
                };
                $.ajax({
                    url: baseUrl + "/demographics/party",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(partyData),
                    success: function (party) {
                        if (party.action == 'CREATE') {
                            //console.log("Uspešno kreiran zapis " +ehrId);

                            
                            $("#vnosVEHR-ehrId").val(ehrId);
                            $("#preberiPredlogoBolnika").val("");
                            nadzorujDropdownObstojecihUporabnikovNaZačetku();
                            $("#prijava-vpisEHR").val(ehrId);

                            $("#registracija-obvestilo-okvir").css({"display" : "inline-block"});
                            $("#registracija-obvestilo-okvir").attr({"class" : "alert alert-success fade-in"});
                            $("#registracija-obvestilo").html("Uporabnik je bil uspešno registriran!" + " <br><strong>EhrID = "+ehrId+"</strong>");
                            timer3 = setTimeout(function(){ $("#registracija-obvestilo-okvir").hide('slow');}, 3500);
                            return ehrId;
                        }
                    },
                    error: function(err) {
                        $("#registracija-obvestilo-okvir").css({"display" : "inline-block"});
                        $("#registracija-obvestilo-okvir").attr({"class" : "alert alert-danger fade-in"});
                        $("#registracija-obvestilo").html("<strong>NAPAKA!</strong> Uporabnik ni bil uspešno registriran.");
                        timer3 = setTimeout(function(){ $("#registracija-obvestilo-okvir").hide('slow');}, 3500);

                        return -1;
                    }
                });
            }
        });

    });  
}


function dodajMeritve(ehrId,datumInUra,telesnaVisina,telesnaTeza,telesnaTemperatura ) {
  var sessionId = getSessionId();
  var kontrola = 1;

    $.ajaxSetup({
        headers: {"Ehr-Session": sessionId}
    });
    var podatki = {
      // Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
        "ctx/language": "en",
        "ctx/territory": "SI",
        "ctx/time": datumInUra,
        "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
        "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
        "vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
        "vital_signs/body_temperature/any_event/temperature|unit": "°C",
    };
    var parametriZahteve = {
        ehrId: ehrId,
        templateId: 'Vital Signs',
        format: 'FLAT',
    };
    $.ajax({
        url: baseUrl + "/composition?" + $.param(parametriZahteve),
        type: 'POST',
        contentType: 'application/json',
        async: false,
        data: JSON.stringify(podatki),
        success: function (res) {
          //console.log("Podatki uspešno vnešeni! "+ "datumInUra " + datumInUra + " telesnaVisina " + telesnaVisina +" telesnaTeza " +telesnaTeza + " telesnaTemperatura "+telesnaTemperatura);
          //console.log("Podatki uspešno vnešeni! ");
          kontrola=1;
        },
        error: function(err) {
          kontrola = -1;
        }
    });
    return kontrola;

}




function kreirajEhrId(ime,priimek,datumRojstva){
  var sessionId=getSessionId();
  var ehrId;
  $.ajaxSetup({
            headers: {"Ehr-Session": sessionId}
        });
        $.ajax({
            url: baseUrl + "/ehr",
            type: 'POST',
            async: false,
            success: function (data) {
                ehrId = data.ehrId;
                var partyData = {
                    firstNames: ime,
                    lastNames: priimek,
                    dateOfBirth: datumRojstva,
                    partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
                };
                $.ajax({
                    url: baseUrl + "/demographics/party",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(partyData),
                    success: function (party) {
                        if (party.action == 'CREATE') {
                            //console.log("Uporabnik "+ ime+" "+ priimek+" je bil uspešno kreiran. ErhID = " +ehrId);
                          
                        }
                    },
                    error: function(err) {
                    
                        ehrId=-1; // napaka
                    }
                });
            }
        }); 
        return ehrId; 
}

function preveriVeljavnostDatuma(datum){
  var stVezajev=0;
  for(var i=0; i<datum.length; i++){
    //console.log("Trenutni znak "+ datum.charAt(i));
    if(datum.charAt(i)=="-"){
      stVezajev++;
    }
  }

  var tabela =datum.split("-");
  if(stVezajev==2){
    for(var i=0; i<tabela.length; i++){
      if(tabela[i]<10){
        //console.log(tabela[i]);
        if(tabela[i].charAt(0)!="0"){
          //console.log("Tabela datumov ia na poziciji " +i +"nima ničle");
          return false;
        }
      }
    }
  }

  if(tabela.length=3 && tabela[0]>=1 && tabela[0]<=31 && tabela[1]>=1 && tabela[1]<=12 && tabela[2]>1000 && tabela[0].length==2 && tabela[1].length==2){  // format 12.04.2016

    return true;
  }
  return false;
}

function preveriVeljavnostUre(ura){
  var stDvopicij=0;
  for(var i=0; i<ura.length; i++){
    if(ura.charAt(i)==":"){
      stDvopicij++;
    }
  }
  var tabela =ura.split(":");
  if(stDvopicij==1){
    for(var i=0; i<tabela.length; i++){
      if(tabela[i]<10){
        if(tabela[i].charAt(0)!="0"){
          return false;
        }
      }
    }
  }
  

  if(tabela.length==2 && tabela[0]>=0 && tabela[0]<=23 && tabela[1]>=0 && tabela[1]<=59 && tabela[0].length==2 && tabela[1].length==2){ 

    return true;
  }
  return false;
}

function zapisiDatumRojstvaVFormatu(datum, ura){
  var tabelaDatum = datum.split("-");
  var format=tabelaDatum[2]+"-"+tabelaDatum[1]+"-"+tabelaDatum[0]+"T"+ura;
  return format;
}

function razsirjanjeInKrcenjeOken(){
  $(".okno").click(function(){

        if($(this).attr("class").indexOf("glyphicon-menu-down")>-1){
          $(this).parent().parent().find(".panel-body").slideToggle("slow");
          $(this).attr({
            "class" : " okno glyphicon glyphicon-menu-up"
          });
        }else{
          $(this).parent().parent().find(".panel-body").slideToggle("slow");
          $(this).attr({
            "class" : "okno glyphicon glyphicon-menu-down"
          });
        }
  });
}

function ITMKalkulator(){

  $("#gumbITM").click(function(){

    clearTimeout(timer4);
    odstraniElement("ITM-okvir");

    var teza = $("#teza").val();
    var visina = ($("#visina").val())/100;
    var ITM;
    var napaka1,napaka2;
    var kategorija="";
    var barva="";
    napaka1=true;
    napaka2=true;

    if(teza>0){
      napaka1=false;
      $("#teza").parent().attr({"class" : "input-group"});
    }else{
      $("#teza").parent().attr({"class" : "input-group has-error"});
    }
    if(visina>0){
      napaka2=false;
      $("#visina").parent().attr({"class" : "input-group"});
    }else{
       $("#visina").parent().attr({"class" : "input-group has-error"});
    }
    if(!napaka1 && !napaka2){
      //console.log("Test1");
      ITM=teza/(visina*visina);
      switch(true){
        case (ITM<=16): 
          kategorija="HUDA PODHRANJENOST"; 
          barva="alert alert-info";
          break;
        case (ITM>=16 && ITM<17): 
          kategorija="ZMERNA PODHRANJENOST"; 
          barva="alert alert-info";
          break;
        case (ITM>=17 && ITM<18.5):
          kategorija="BLAGA PODHRANJENOST"; 
          barva="alert alert-info";
          break;
        case (ITM>=18.5 && ITM<25):
          kategorija="NORMALNA TELESNA MASA";
          barva="alert alert-success"; 
          break;
        case (ITM>=25 && ITM<30):
          kategorija="ZVEČANA TELESNA MASA";
          barva="alert alert-warning";
          break;
        case (ITM>=30 && ITM<35):
          kategorija="DEBELOST STOPNJE I"; 
          barva="alert alert-danger";
          break;
        case (ITM>=35 && ITM<40):
          kategorija="DEBELOST STOPNJE II";
          barva="alert alert-danger"; 
          break;
        case (ITM>=40):
          kategorija="DEBELOST STOPNJE III";
          barva="alert alert-danger"; 
          break;
      }
      //console.log(kategorija + "  "+ barva);
      $("#ITM-okvir").css({"display" : "block"});
      $("#ITM-okvir").attr({"class" : barva});
      $("#ITM-podatek").text(ITM.toFixed(1));
      $("#ITM-kategorija").text(kategorija);
      timer4 = setTimeout(function(){ $("#ITM-okvir").hide('slow');}, 3500);
    }
  });

}


function preberiMeritve(ehrId) {
  
  var sessionId = getSessionId();

  var uporabnik={
            ime: "",
            priimek: "",
            datumRojstva: "",
            cas: "",
            telesnaTeza: [],
            telesnaTemperatura: [],
            telesnaVisina:[]
          }

    $.ajax({
      url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
      type: 'GET',
      async: false,
      headers: {"Ehr-Session": sessionId},
        success: function (data) {
        var party = data.party;

          uporabnik.ime=party.firstNames;
          uporabnik.priimek=party.lastNames;
          uporabnik.datumRojstva=party.dateOfBirth;
          //console.log("Ime je " + uporabnik.ime+ "Priimek je " + uporabnik.priimek +" datum rojstva " + uporabnik.datumRojstva);
      },
      error: function(err) {
        uporabnik={};
      } 
    });

 // TELESNA TEŽA ----------------------------------         
          $.ajax({
              url: baseUrl + "/view/" + ehrId + "/" + "weight",
              type: 'GET',
              async: false,
              headers: {"Ehr-Session": sessionId},
              success: function (res) {
                if (res.length > 0) {
                    // res[i].time  res[i].weight res[i].unit
                    // console.log(res[0].time + " " + res[0].weight +" "+res[0].unit +"\n" +res[1].time + " " + res[1].weight +" "+res[1].unit);
                    uporabnik.telesnaTeza=res;
                }else{ 
                  uporabnik.telesnaTeza=[];
                }
              },
              error: function() {
                
              }
          });


// TELESNA TEMPERATURA ----------------------------------
          
          $.ajax({
              url: baseUrl + "/view/" + ehrId + "/" + "body_temperature",
              type: 'GET',
              async: false,
              headers: {"Ehr-Session": sessionId},
              success: function (res) {
                if (res.length > 0) {
                    // res[i].time  res[i].weight res[i].unit
                    uporabnik.telesnaTemperatura=res;
                    //console.log(res);
                    //console.log(res[0].time + " " + res[0].temperature +" "+res[0].unit +"\n" +res[1].time + " " + res[1].temperature +" "+res[1].unit); 
                }else{ 
                  uporabnik.telesnaTemperatura=[];
                }
              },
              error: function() {
                
              }
          });

// TELESNA VIŠINA ----------------------------------------
          $.ajax({
              url: baseUrl + "/view/" + ehrId + "/" + "height",
              type: 'GET',
              async: false,
              headers: {"Ehr-Session": sessionId},
              success: function (res) {
                if (res.length > 0) {
                    // res[i].time  res[i].weight res[i].unit
                    uporabnik.telesnaVisina=res;
                    //console.log(res);
                    //console.log(res[0].time + " " + res[0].temperature +" "+res[0].unit +"\n" +res[1].time + " " + res[1].temperature +" "+res[1].unit); 
                }else{ 
                  uporabnik.telesnaTemperatura=[];
                }
              },
              error: function() {
                
              }
          });

          return uporabnik;
}



//------------------ RISANJE GRAFOV ------------------//

//----------------------------- GRAF TELESNE VIŠINE -----------------------------//

function drawChart1(podatki) {
  console.log(podatki);
  var data = google.visualization.arrayToDataTable(podatki);

  var options = {
    title: 'Graf telesne višine',
    hAxis: {
      title: 'Datum',
      direction:-1,
      slantedText:true,
      slantedTextAngle:60, // here you can even use 180
      titleTextStyle: {
        color: '#333'
      }
    },
    vAxis: {
      minValue: 0
    },
    /*chartArea:{left:100,top:100, bottom:50}*/
    chartArea:{top:100, bottom:140}
  };

  var chart = new google.visualization.AreaChart(document.getElementById('graf1'));
  chart.draw(data, options);
}

//----------------------------- GRAF TELESNE MASE -----------------------------//

function drawChart2(podatki) {
  console.log(podatki);
  var data = google.visualization.arrayToDataTable(podatki);

  var options = {
    title: 'Graf telesne mase',
    hAxis: {
      title: 'Datum',
      direction:-1,
      slantedText:true,
      slantedTextAngle:60, // here you can even use 180
      titleTextStyle: {
        color: '#333'
      }
    },
    vAxis: {
      minValue: 0
    },
    chartArea:{top:100, bottom:140}
  }

  var chart = new google.visualization.AreaChart(document.getElementById('graf2'));
  chart.draw(data, options);
}

function drawChart3(podatki) {
  console.log(podatki);
  var data = google.visualization.arrayToDataTable(podatki);

  var options = {
    title: 'Graf telesne temperature',
    hAxis: {
      title: 'Datum',
      direction:-1,
      slantedText:true,
      slantedTextAngle:60, // here you can even use 180
      titleTextStyle: {
        color: '#333'
      }
    },
    vAxis: {
      minValue: 0
    },
    chartArea:{top:100, bottom:140}
  }

  var chart = new google.visualization.AreaChart(document.getElementById('graf3'));
  chart.draw(data, options);
}

//----------------------------- GRAF ITM -----------------------------//

function drawChart4(podatki) {
  console.log(podatki);
  
  var data = google.visualization.arrayToDataTable(podatki);

  var options = {
    title: 'Graf ITM',
    hAxis: {
      title: 'Datum',
      direction:-1,
      slantedText:true,
      slantedTextAngle:60, // here you can even use 180
      titleTextStyle: {
        color: '#333'
      }
    },
    vAxis: {
      minValue: 0
    },
    chartArea:{top:100, bottom:140}
  }

  var chart = new google.visualization.AreaChart(document.getElementById('graf4'));
  chart.draw(data, options);
}




