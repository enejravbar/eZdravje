
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
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
function generirajPodatke(stPacienta) {
  ehrId = "";

  // TODO: Potrebno implementirati

  return ehrId;
}

function kreirajUporabnika(){

   $("#gumb-registriraj").click(function(){
      var ime=$("#registracija-ime").val();
      var priimek=$("#registracija-priimek").val();
      var datum=$("#registracija-datum").val();
      var ura=$("#registracija-ura").val();
      //console.log("preveriVeljavnostDatuma: " +datum+ " preveriVeljavnostUre: " + ura);
      if(!preveriVeljavnostDatuma(datum)){ 
        $("#registracija-datum").parent().attr({"class" : "input-group col-sm-10 has-error"});
        return;
      }else{
        $("#registracija-datum").parent().attr({"class" : "input-group col-sm-10"});
      }
      if(!preveriVeljavnostUre(ura)){
        $("#registracija-ura").parent().attr({"class" : "input-group col-sm-10 has-error"});
        return;
      }else{
        $("#registracija-ura").parent().attr({"class" : "input-group col-sm-10"});
      }

      var datumRojstva= zapisiDatumRojstvaVFormatu(datum, ura);
      console.log("datum rojstva: " + datumRojstva);
    
     /*$.ajaxSetup({
            headers: {"Ehr-Session": sessionId}
        });
        $.ajax({
            url: baseUrl + "/ehr",
            type: 'POST',
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
                            console.log("Uspešno kreiran zapis " +ehrId);
                        }
                    },
                    error: function(err) {
                      
                    }
                });
            }
        });*/

    });  
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

  if(tabela.length=3 && tabela[0]>=1 && tabela[0]<=31 && tabela[1]>=1 && tabela[1]<=12 && tabela[2]>1950){  // format 12.4.2016

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
  

  if(tabela.length==2 && tabela[0]>=0 && tabela[0]<=23 && tabela[1]>=0 && tabela[1]<=59){  // format 12.4.2016

    return true;
  }
  return false;
}

function zapisiDatumRojstvaVFormatu(datum, ura){
  var tabelaDatum = datum.split("-");
  var format=tabelaDatum[2]+"-"+tabelaDatum[1]+"-"+tabelaDatum[0]+"T"+ura;
  return format;
}

$(document).ready(function(){

  kreirajUporabnika();

  $("#preberiPredlogoBolnika").change(function(){
    console.log("Izbran je bil: " + $("#preberiPredlogoBolnika option:selected" ).text());
  });
  

  $(".glyphicon").click(function(){

        if($(this).attr("class").indexOf("glyphicon-menu-down")>-1){
          $(this).parent().parent().find(".panel-body").slideToggle("slow");
          $(this).attr({
            "class" : "glyphicon glyphicon-menu-up"
          });
        }else{
          $(this).parent().parent().find(".panel-body").slideToggle("slow");
          $(this).attr({
            "class" : "glyphicon glyphicon-menu-down"
          });
        }
  });

  $("#gumbITM").click(function(){

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
      console.log("Test1");
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
    }
  });

});