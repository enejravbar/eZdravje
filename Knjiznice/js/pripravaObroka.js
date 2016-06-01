
var tabelaZivil= new Array();
var buffer;


function mainMetodaZaPripravoObroka(){
	pripravaTabele();
	gumbIskanje();
	//var iskanje=iskanjeZivil("","sir",["",""],["",""],["",""]);
}


function iskanjeZivil(tip,ime,beljakovine,mascobe,oglHidrati){
	var iskanaZivila = new Array();

	for(var i=0; i<tabelaZivil.length; i++){
		if( (tabelaZivil[i].tip == tip || tip == "") && 
			(((tabelaZivil[i].ime).toLowerCase()).indexOf(ime.toLowerCase()) != -1  || ime == "") &&
			((tabelaZivil[i].beljakovine >=beljakovine[0] && tabelaZivil[i].beljakovine <=beljakovine[1]) || (beljakovine[0] =="" && beljakovine[1] =="")) && 
			((tabelaZivil[i].mascobe >=mascobe[0] && tabelaZivil[i].mascobe <=mascobe[1]) || (mascobe[0] =="" && mascobe[1] =="")) && 
			((tabelaZivil[i].oglHidrati >=oglHidrati[0] && tabelaZivil[i].oglHidrati <=oglHidrati[1]) || (oglHidrati[0] =="" && oglHidrati[1] =="")) 
		){
			iskanaZivila.push(tabelaZivil[i]);
			console.log("Zadetek!");
		}
	}
	console.log(iskanaZivila);
	return iskanaZivila;
}

function gumbIskanje(){
	$("#gumb-iskanje").click(function() {

		var tip = $("#tipZivila").val();
		var ime = $("#imeZivila").val();

		var beljakovine1 = $("#beljakovine1").val();
		var beljakovine2 = $("#beljakovine2").val();
		var mascobe1 = $("#mascobe1").val();
		var mascobe2 = $("#mascobe2").val();
		var oglHidrati1 = $("#oglHidrati1").val();
		var oglHidrati2 = $("#oglHidrati2").val();

		var napaka1=true;
		var napaka2=true;
		var napaka3=true;

		if( ($.isNumeric(beljakovine1)) && ($.isNumeric(beljakovine2)) || (beljakovine1=="" && beljakovine2=="")){
			napaka1=false;
			$("#beljakovine1").parent().attr({
				"class" : "input-group"
			});
		}else{
			napaka1=true;
			$("#beljakovine1").parent().attr({
				"class" : "input-group has-error"
			});
		}
		if(($.isNumeric(mascobe1)) && ($.isNumeric(mascobe2)) || (mascobe1=="" && mascobe2=="")){
			napaka2=false;
			$("#mascobe1").parent().attr({
				"class" : "input-group"
			});
		}else{
			napaka2=true;
			$("#mascobe1").parent().attr({
				"class" : "input-group has-error"
			});
		}
		if(($.isNumeric(oglHidrati1)) && ($.isNumeric(oglHidrati2)) || (oglHidrati1=="" && oglHidrati2=="")){
			napaka3=false;
			$("#oglHidrati1").parent().attr({
				"class" : "input-group"
			});
		}else{
			napaka3=true;
			$("#oglHidrati1").parent().attr({
				"class" : "input-group has-error"
			});
		}
		if(napaka1 || napaka2 || napaka3){
			return;
		}
		var najdenaZivila = iskanjeZivil(tip,ime,[beljakovine1,beljakovine2],[mascobe1,mascobe2],[oglHidrati1,oglHidrati2]);

		/* 
<td style="position:relative;">
			<span style="position:absolute; left:5px; top:15px;">Izdelek 1</span>
								<button type="submit" class="btn btn-primary btn-sm" style="float:right;margin-right:15px;">Dodaj</button> 
						        <span style="float:right;margin-right:15px;margin-top:5px;">g</span>
																              <input class="input-small" style="float:right; width:80px;margin-right:5px;" name="beljak_max" value="" type="text">
															              </td>
		*/
		var htmlTabela="";
		for(var i=0; i<najdenaZivila.length; i++){
			htmlTabela+="<tr><td style=\"position:relative;\"> <span style=\"position:absolute; left:5px; top:15px;\">";
			htmlTabela+=najdenaZivila[i].ime+"</span> <button type=\"submit\" class=\"btn btn-primary btn-sm\" style=\"float:right;margin-right:15px;\">Dodaj</button> <span style=\"float:right;margin-right:15px;margin-top:5px;\">g</span><input class=\"input-small\" style=\"float:right; width:80px;margin-right:5px;\" name=\"beljak_max\" type=\"text\"></td></tr>";
		}
		$("#vrsticeTabeleIskanihZivil").html(htmlTabela);
	});
		
}



//  {TIP ŽIVILA  IME ŽIVILA  ENERGIJA (kcal)  MAŠČOBE SKUPAJ  HORESTEROL  OGL. HIDRATI  BELJAKOVINE}

function pripravaTabele(){
	buffer=baza.split("\t");
	var zivilo;
	var stevec=0;

	for(var i=0; i<665; i++){
		
		zivilo={
			id:"",
			tip:"",
			ime:"",
			energija:"",
			mascobe:"",
			horesterol:"",
			oglHidrati:"",
			beljakovine:""
		};
		
		for(var j=0; j<7; j++){


			switch(j){
				case 0:
					zivilo.tip=buffer[i*7+j];
					zivilo.id=stevec;
					stevec++;
					break;
				case 1:
					zivilo.ime=buffer[i*7+j];
					break;
				case 2:
					zivilo.energija=buffer[i*7+j].replace(/[^0-9.]/g, '');
					break;
				case 3:
					zivilo.mascobe=buffer[i*7+j].replace(/[^0-9.]/g, '');
					break;
				case 4:
					zivilo.horesterol=buffer[i*7+j].replace(/[^0-9.]/g, '');
					break;
				case 5:
					zivilo.oglHidrati=buffer[i*7+j].replace(/[^0-9.]/g, '');
					break;
				case 6:
					zivilo.beljakovine=buffer[i*7+j].replace(/[^0-9.]/g, '');
					break;
			}
			
		}
		tabelaZivil.push(zivilo);
	}
	console.log(tabelaZivil);

}

function izpisi2DTabelo(){
	
	for(var i=0; i<665; i++){
		var vrstica="";
		for(var j=0; j<7; j++){
			vrstica+="\""+buffer[i*7+j]+"\""+"   " ;
		}
		console.log(vrstica);
	}
}