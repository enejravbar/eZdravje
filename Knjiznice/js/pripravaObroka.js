var tabelaZivil = new Array();
var buffer;
var stevecZivilNaListi = 0;

function mainMetodaZaPripravoObroka() {
    pripravaTabele();
    gumbIskanje();
    prikaziPodrobnostiZivila();
    dodajZiviloNaSeznam();
    odstraniZiviloIzSeznama();

    //var iskanje=iskanjeZivil("","sir",["",""],["",""],["",""]);
}

function iskanjeZivil(tip, ime, beljakovine, mascobe, oglHidrati) {
    var iskanaZivila = new Array();

    if (tip == "Katerakoli skupina") {
        tip = "";
    }
    console.log("Tip je: " + tip + " ime: " + ime + " beljakovine " + beljakovine + " mascobe " + mascobe + " oglHidrati " + oglHidrati);

    for (var i = 0; i < tabelaZivil.length; i++) {

        if ((tabelaZivil[i].tip == tip || tip == "") &&
            (((tabelaZivil[i].ime).toLowerCase()).indexOf(ime.toLowerCase()) != -1 || ime == "") &&
            ((tabelaZivil[i].beljakovine >= beljakovine[0] && tabelaZivil[i].beljakovine <= beljakovine[1]) || (beljakovine[0] == "" && beljakovine[1] == "")) &&
            ((tabelaZivil[i].mascobe >= mascobe[0] && tabelaZivil[i].mascobe <= mascobe[1]) || (mascobe[0] == "" && mascobe[1] == "")) &&
            ((tabelaZivil[i].oglHidrati >= oglHidrati[0] && tabelaZivil[i].oglHidrati <= oglHidrati[1]) || (oglHidrati[0] == "" && oglHidrati[1] == ""))
        ) {
            iskanaZivila.push(tabelaZivil[i]);
            console.log("Zadetek!");
        }
    }
    console.log(iskanaZivila);
    return iskanaZivila;
}

function prikaziPodrobnostiZivila() {

    $(document).on('click', '.info', function() {
        //console.log("Zaznan klik!");
        var imeZivila = $(this).parent().text();

        //console.log("imeZivila: "+imeZivila);
        $(this).parent().parent().parent().parent().find(".podrobnosti").slideToggle("slow");
        $(this).parent().parent().parent().parent().find(".podrobnosti").html(pripraviHTMLPodrobnosti(imeZivila));
        var divZaGraf = $(this).parent().parent().parent().parent().find(".podrobnosti").find("#glavno").find("#glavno-graf").find("#grafHranilnihVrednosti");
        console.log("Posreduj podatke vrne: " + posredujPodatkeZaGraf5(imeZivila));
        var tabelaPodatkovZaIzrisGrafov = posredujPodatkeZaGraf5(imeZivila);
        drawChart5(divZaGraf[0], tabelaPodatkovZaIzrisGrafov);
        $(window).resize(function() {
            drawChart5(divZaGraf[0], tabelaPodatkovZaIzrisGrafov);
        });

    });

}

function pripraviHTMLPodrobnosti(imeZivila) {
    console.log("imeZivila: '" + imeZivila + "'");
    var zivilo = pridobiObjektZivila(imeZivila);
    var html =
        "<div id=\"glavno\" class=\" col-xs-12 col-sm-12 col-md-12 col-lg-12\">" +
        "<div class=\"row\">" +
        "	<div class=\"col-xs-12 col-sm-12 col-md-6 col-lg-6\"> " +
        "		<table class=\"table\"> " +
        "	 	<thead> " +
        "	     	<tr style=\"background-color: rgba(148, 152, 152,0.5);\"><th>Hranilne vrednosti (na 100g)</th></tr> " +
        "		</thead> " +
        "		<tbody> " +
        "	    <tr> " +
        "	    	<td> " +
        "		    	<span style=\"float:left;\">Energija</span> " +
        "		    	<span style=\"float:right;\">" + zivilo.energija + "  kcal</span> " +
        "		    </td> " +
        "		 </tr> " +
        "		 <tr> " +
        "	    	<td> " +
        "		    	<span style=\"float:left;\">Maščobe skupaj " +
        "		    	</span> " +
        "		    	<span style=\"float:right;\">" + zivilo.mascobe +
        " g</span> " +
        "	    	</td> " +
        "	    </tr> " +
        "	    <tr> " +
        "	    	<td> " +
        "		    	<span style=\"float:left;\">Holesterol " +
        "		    	</span> " +
        "		    	<span style=\"float:right;\">" + zivilo.horesterol +
        "		    	 mg</span> " +
        "	    	</td> " +
        "	    </tr> " +
        "	    <tr> " +
        "	    	<td> " +
        "		    	<span style=\"float:left;\">Ogljikovi hidrati skupaj " +
        "		    	</span> " +
        "		    	<span style=\"float:right;\">" + zivilo.oglHidrati +
        "		    	g</span> " +
        "	    	</td> " +
        "	    </tr> " +
        "	    <tr> " +
        "	    	<td> " +
        "		    	<span style=\"float:left;\">Beljakovine " +
        "		    	</span> " +
        "		    	<span style=\"float:right;\">" + zivilo.beljakovine +
        "		    	g</span> " +
        "	    	</td> " +
        "	    </tr> " +
        "	    </tbody> " +
        "	  </table> " +
        "</div> " +
        "	<div  id=\"glavno-graf\"class=\"col-xs-12 col-sm-12 col-md-6 col-lg-6\"> " +
        "		<div id=\"grafHranilnihVrednosti\" style=\"height: 400px;\"> " +
        "		</div> " +
        "	</div> " +
        "</div> " +
        "</div>	";
    return html;
}

function pridobiObjektZivila(imeZivila) {
    var objekt;
    for (var i = 0; i < tabelaZivil.length; i++) {
        if (tabelaZivil[i].ime == imeZivila.substring(0, imeZivila.length - 1)) {
            objekt = tabelaZivil[i];
        }
    }
    return objekt;
}

//  {TIP ŽIVILA  IME ŽIVILA  ENERGIJA (kcal)  MAŠČOBE SKUPAJ  HORESTEROL  OGL. HIDRATI  BELJAKOVINE}

function pripravaTabele() {
    buffer = baza.split("\t");
    var zivilo;
    var stevec = 0;

    for (var i = 0; i < 665; i++) {

        zivilo = {
            id: "",
            tip: "",
            ime: "",
            energija: "",
            mascobe: "",
            horesterol: "",
            oglHidrati: "",
            beljakovine: ""
        };

        for (var j = 0; j < 7; j++) {


            switch (j) {
                case 0:
                    zivilo.tip = buffer[i * 7 + j];
                    zivilo.id = stevec;
                    stevec++;
                    break;
                case 1:
                    zivilo.ime = buffer[i * 7 + j];
                    break;
                case 2:
                    zivilo.energija = buffer[i * 7 + j].replace(/[^0-9.]/g, '');
                    break;
                case 3:
                    zivilo.mascobe = buffer[i * 7 + j].replace(/[^0-9.]/g, '');
                    break;
                case 4:
                    zivilo.horesterol = buffer[i * 7 + j].replace(/[^0-9.]/g, '');
                    break;
                case 5:
                    zivilo.oglHidrati = buffer[i * 7 + j].replace(/[^0-9.]/g, '');
                    break;
                case 6:
                    zivilo.beljakovine = buffer[i * 7 + j].replace(/[^0-9.]/g, '');
                    break;
            }

        }
        tabelaZivil.push(zivilo);
    }
    console.log(tabelaZivil);

}

function izpisi2DTabelo() {

    for (var i = 0; i < 665; i++) {
        var vrstica = "";
        for (var j = 0; j < 7; j++) {
            vrstica += "\"" + buffer[i * 7 + j] + "\"" + "   ";
        }
        console.log(vrstica);
    }
}

function drawChart5(divZaGraf, podatki) {

    var data = google.visualization.arrayToDataTable(podatki);

    var options = {
        'title': 'Hranilne vrednosti',

        'height': 400,
        'chartArea': {
            'width': '100%',
            'height': '80%'
        },
        'legend': {
            'position': 'bottom'
        }
    };
    options.chartArea = {
        'padding': '0px',
        'margin': '0px',
        'width': '80%',
        'height': '80%'
    };

    var chart = new google.visualization.PieChart(divZaGraf);

    chart.draw(data, options);
}

function posredujPodatkeZaGraf5(imeZivila) {
    var zivilo = pridobiObjektZivila(imeZivila);
    console.log("Objekt zivila je: " + zivilo);
    var podatki = [
        ["Hranilna snov", 'Delež'],
        ["Maščobe", parseFloat(zivilo.mascobe) * 1000],
        ["Holesterol", parseFloat(zivilo.horesterol)],
        ["Ogl. hidrati", parseFloat(zivilo.oglHidrati) * 1000],
        ["Beljakovine", parseFloat(zivilo.beljakovine) * 1000]
    ];

    console.log('Energija ' + zivilo.energija + ' Maščobe skupaj ' + zivilo.mascobe + ' Holesterol ' + zivilo.horesterol + ' Ogljikovi hidrati skupaj ' + zivilo.oglHidrati + ' Beljakovine ' + zivilo.beljakovine);
    console.log("Podatki: " + podatki);

    return podatki;
}

function gumbIskanje() {
    $("#gumb-iskanje").click(function() {

        var tip = $("#tipZivila").val();
        var ime = $("#imeZivila").val();

        console.log("tip je: " + tip);

        var beljakovine1 = $("#beljakovine1").val();
        var beljakovine2 = $("#beljakovine2").val();
        var mascobe1 = $("#mascobe1").val();
        var mascobe2 = $("#mascobe2").val();
        var oglHidrati1 = $("#oglHidrati1").val();
        var oglHidrati2 = $("#oglHidrati2").val();

        var napaka1 = true;
        var napaka2 = true;
        var napaka3 = true;

        if (($.isNumeric(beljakovine1)) && ($.isNumeric(beljakovine2) && beljakovine1 <= beljakovine2) || (beljakovine1 == "" && beljakovine2 == "")) {
            napaka1 = false;
            $("#beljakovine1").parent().attr({
                "class": "input-group"
            });
        } else {
            napaka1 = true;
            $("#beljakovine1").parent().attr({
                "class": "input-group has-error"
            });
        }
        if (($.isNumeric(mascobe1)) && ($.isNumeric(mascobe2) && mascobe1 <= mascobe2) || (mascobe1 == "" && mascobe2 == "")) {
            napaka2 = false;
            $("#mascobe1").parent().attr({
                "class": "input-group"
            });
        } else {
            napaka2 = true;
            $("#mascobe1").parent().attr({
                "class": "input-group has-error"
            });
        }
        if (($.isNumeric(oglHidrati1)) && ($.isNumeric(oglHidrati2) && oglHidrati1 <= oglHidrati2) || (oglHidrati1 == "" && oglHidrati2 == "")) {
            napaka3 = false;
            $("#oglHidrati1").parent().attr({
                "class": "input-group"
            });
        } else {
            napaka3 = true;
            $("#oglHidrati1").parent().attr({
                "class": "input-group has-error"
            });
        }
        if (napaka1 || napaka2 || napaka3) {
            return;
        }
        var najdenaZivila = iskanjeZivil(tip, ime, [beljakovine1, beljakovine2], [mascobe1, mascobe2], [oglHidrati1, oglHidrati2]);

        var htmlTabela = "";

        if (najdenaZivila.length == 0) {
            htmlTabela += "<tr><td style=\"position:relative; text-align:center;\">" + "Ni zadetkov!" + "</td></tr>";
        } else {
            for (var i = 0; i < najdenaZivila.length; i++) {
                htmlTabela +=

                    "<tr><td style=\"position:relative;\">" +
                    "<div class=\"row\">" +
                    "<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">" +
                    "<span class=\"imeZivila\"style=\"position:absolute; left:15px; top:8px;\">" + najdenaZivila[i].ime + "<span style=\"position:absolute; margin-left:5px; \" class=\"info glyphicon glyphicon-info-sign\"> </span></span>" +
                    "<button type=\"submit\" class=\"gumb-dodaj-zivilo btn btn-primary btn-sm\" style=\"float:right;margin-right:15px;\">Dodaj</button>" +
                    "<span style=\"float:right;margin-right:15px;margin-top:5px;\">g</span>" +
                    "<input class=\"input-small\" style=\"float:right; width:80px;margin-right:5px;\" name=\"beljak_max\" type=\"text\">" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"row podrobnosti\" style=\"margin-top:15px;display:none;\">" +

                    "</div>" +
                    "</td></tr>"
            }
        }

        $("#vrsticeTabeleIskanihZivil").html(htmlTabela);
    });

}

function dodajZiviloNaSeznam() {
    $(document).on('click', '.gumb-dodaj-zivilo', function() {
        var imeZivila = $(this).parent().find(".imeZivila").text();
        //imeZivila=imeZivila.substring(0,imeZivila.length-1);
        var kolicina = $(this).parent().find("input").val();
        /*console.log("Dodaj Zivilo na Seznam - ime zivila: '"+imeZivila+"'");
        var zivilo = pridobiObjektZivila(imeZivila.substring(0,imeZivila.length-1));*/
        if (kolicina > 0) {
            var vrstica =
                "<tr><td style=\"position:relative;\">" +
                "<span class='ziviloIme'>" + imeZivila + "</span>" +
                " (" +
                "<span class='ziviloKolicina'>" + kolicina + "</span>" +
                "g)" +
                "<span style=\"position:absolute; right:10px; top:25%;display:block;\" class=\"minus-odstrani-zivilo glyphicon glyphicon-minus\"></span>" +
                "</td></tr>";

            $("#seznamIzbranihZivil").append(vrstica);
            izracunajNovoStanje(pridobiObjektZivila(imeZivila), kolicina, "dodaj");

            var energija = parseFloat($("#kolicinaEnergije-vrednost").text());
            var dnevniVnos = $("#priporocenVnos").text();
            var barva = "";
            switch (true) {
                case (energija <= dnevniVnos):
                    barva = "success";
                    break;
                case (energija > dnevniVnos):
                    barva = "danger";
                    break;
            }
            $("#dnevni-vnos-status").attr({
                "class": barva
            });

        }

    });
}

function odstraniZiviloIzSeznama() {
    $(document).on('click', '.minus-odstrani-zivilo', function() {

        $(this).parent().parent().css({
            "display": "none"
        });
        var imeZivila = $(this).parent().find(".ziviloIme").text();

        var kolicina = $(this).parent().find(".ziviloKolicina").text();

        console.log("imeZivila: '" + imeZivila + "'" + " kolicina '" + kolicina + "'");
        izracunajNovoStanje(pridobiObjektZivila(imeZivila), kolicina, "odstrani");

        var energija = parseFloat($("#kolicinaEnergije-vrednost").text());
        var dnevniVnos = $("#priporocenVnos").text();
        var barva = "";
        switch (true) {
            case (energija <= dnevniVnos):
                barva = "success";
                break;
            case (energija > dnevniVnos):
                barva = "danger";
                break;
        }
        $("#dnevni-vnos-status").attr({
            "class": barva
        });
    });
}

function izracunajNovoStanje(zivilo, kolicina, akcija) {
    var stevilo = 23.439;

    console.log("Stevilo je: " + izpisNaDolocenoSteviloDecimalnihMest(stevilo, 2) + "    " + izpisNaDolocenoSteviloDecimalnihMest(stevilo, 3));
    var energija = parseFloat($("#kolicinaEnergije-vrednost").text());
    var mascobe = parseFloat($("#kolicinaMascob-vrednost").text());
    var holesterol = parseFloat($("#kolicinaHolesterola-vrednost").text());
    var oglHidrati = parseFloat($("#kolicinaOglHidratov-vrednost").text());
    var beljakovine = parseFloat($("#kolicinaBeljakovin-vrednost").text());
    var stEnot = kolicina / 100;

    if (akcija == "odstrani") {
        $("#kolicinaEnergije-vrednost").text(Math.abs((energija - zivilo.energija * stEnot).toFixed(0)));
        $("#kolicinaMascob-vrednost").text(Math.abs((mascobe - zivilo.mascobe * stEnot).toFixed(2)));
        $("#kolicinaHolesterola-vrednost").text(Math.abs((holesterol - zivilo.horesterol * stEnot).toFixed(2)));
        $("#kolicinaOglHidratov-vrednost").text(Math.abs((oglHidrati - zivilo.oglHidrati * stEnot).toFixed(2)));
        $("#kolicinaBeljakovin-vrednost").text(Math.abs((beljakovine - zivilo.beljakovine * stEnot).toFixed(2)));
    }
    if (akcija == "dodaj") {
        $("#kolicinaEnergije-vrednost").text(Math.abs((energija + zivilo.energija * stEnot).toFixed(0)));
        $("#kolicinaMascob-vrednost").text(Math.abs((mascobe + zivilo.mascobe * stEnot).toFixed(2)));
        $("#kolicinaHolesterola-vrednost").text(Math.abs((holesterol + zivilo.horesterol * stEnot).toFixed(2)));
        $("#kolicinaOglHidratov-vrednost").text(Math.abs((oglHidrati + zivilo.oglHidrati * stEnot).toFixed(2)));
        $("#kolicinaBeljakovin-vrednost").text(Math.abs((beljakovine + zivilo.beljakovine * stEnot).toFixed(2)));
    }

}

function izpisNaDolocenoSteviloDecimalnihMest(num, stMest) {

    num = num.toString();
    num = num.slice(0, (num.indexOf(".")) + (stMest + 1));
    Number(num);
    return num;
}

// Mifflinova enačba

function izracunDnevnegaVnosa(teza, visina, starost) {
    var dnevniVnos = teza * 10 + visina * 6.25 - starost * 5 + 5;
    return dnevniVnos;
}