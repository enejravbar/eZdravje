import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.*;
import java.io.*;

public class HTMLParser {

	static String tabela[][]= new String[1500][7];

 	
	public static void main(String[] args) {
		
		int tabelaStStrani[]={3,2,1,2,1,2,1,1,3,2,2,2,2,2,2,1,1,2};

		tabela[0][0]="TIP ŽIVILA"; 
		tabela[0][1]="IME ŽIVILA"; 
		tabela[0][2]="ENERGIJA (kcal)"; 
		tabela[0][3]="MAŠČOBE SKUPAJ"; 
		tabela[0][4]="HORESTEROL"; 
		tabela[0][5]="OGL. HIDRATI";
		tabela[0][6]="BELJAKOVINE";

		tabela[1][0]=""; 
		tabela[1][1]=""; 
		tabela[1][2]=""; 
		tabela[1][3]=""; 
		tabela[1][4]=""; 
		tabela[1][5]="";
		tabela[1][6]="";
		// 17 url-jev -----------------------------------

		String tabelaURL[]={
		"/filter.php?filter=&skupina=0100&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=0200&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=0400&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=0500&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=0600&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=0700&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=0900&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=1000&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=1100&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=1200&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=1300&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=1400&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=1500&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=1600&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=1700&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=1800&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=1900&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		"/filter.php?filter=&skupina=2000&zivilo=&beljak_min=&beljak_max=&masc_min=&masc_max=&oh_min=&oh_max=&start=",
		};

		String tabelaZvrstiHrane[]={
			"Mlečni in jajčni izdelki",
			"Začimbe in zelišča",
			"Maščobe in olja",
			"Perutnina in izdelki iz perutnine",
			"Juhe, omake",
			"Klobase in suhomesni izdelki",
			"Sadje in sadni sokovi",
			"Svinjina in izdelki iz svinjine",
			"Zelenjava in zelenjavni izdelki",
			"Oreščki in semena",
			"Govedina in izdelki iz govedine",
			"Pijače, napitki",
			"Ribe, školjke, raki",
			"Stročnice in izdelki iz stročnic",
			"Jagnjetina, teletina, divjačina",
			"Pecivo, kruh",
			"Sladkarije",
			"Žita in testenine"
		};
		System.out.println();
		System.out.println("Povezovanje na URL http://www.cenim.se/");
		for(int stKategorije=0; stKategorije<tabelaURL.length; stKategorije++ ){

			int STSTRANI = tabelaStStrani[stKategorije];
			String URL = tabelaURL[stKategorije];
			String ZVRSTHRANE=tabelaZvrstiHrane[stKategorije];
			for(int stStrani=1; stStrani<STSTRANI+1; stStrani++){
				try{
					Socket s = new Socket(InetAddress.getByName("cenim.se"), 80);
					PrintWriter pw = new PrintWriter(s.getOutputStream());
					pw.print("GET "+URL+""+stStrani +" HTTP/1.1\r\n");
					pw.print("Host: cenim.se\r\n\r\n");
					pw.flush();
					BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
					String t;
					String html="";
					while((t = br.readLine()) != null){
						if(t.indexOf("hranilne-vrednosti.php?id=")==-1){
							continue;
						}
						html+=t+"\n";
					} 
					br.close();
					
					String[] tabelaPovezav=parseHTMLDocumentLinks(html);
					String[] tabelaImenHrane=parseHTMLDocumentImeHrane(html);

					napolniTabeloZTipomInImenomZivila(tabelaImenHrane, ZVRSTHRANE);
					//--------------------------------------------------------------------------------------------------

					for(int i=0;i<dolzinaTabele(tabelaPovezav); i++){
					//for(int i=0;i<1; i++){
						String htmlDrugeStrani="";
						
						try{
							//System.out.println("Sem v try bloku!");
							Socket s1 = new Socket(InetAddress.getByName("cenim.se"), 80);
							PrintWriter pw1 = new PrintWriter(s1.getOutputStream());
							//System.out.println("TEST"+tabelaPovezav[i]+tabelaPovezav[i+1]);
							pw1.print("GET "+tabelaPovezav[i]+" HTTP/1.1\r\n");
							pw1.print("Host: cenim.se\r\n\r\n");
							pw1.flush();
							BufferedReader br1= new BufferedReader(new InputStreamReader(s1.getInputStream()));
							String t1;
							while((t1 = br1.readLine()) != null){
								htmlDrugeStrani+=t1+"\n";
							} 
							br1.close();
							
							//System.out.println(htmlDrugeStrani);

							String[] tabelaLastnosti=parseHTMLDocumentImeLastnosti(htmlDrugeStrani);
							napolniTabeloZLastnostmiZivila(tabelaLastnosti);
						}catch(Exception ex){

						}

					}

					

					
				}catch(Exception ex){
					System.out.println("Napaka");

				}
			}
			System.out.println("Uspešno zajeta kategorija " + tabelaZvrstiHrane[stKategorije]);
		}
		System.out.println();
		System.out.println("Zapisujem v datoteko foodDB.txt.");
		zapisiVDatoteko();
		System.out.println("Datoteka uspešno zapisana.");
	}

	public static String[] parseHTMLDocumentLinks(String input){
		String povezave[]=new String[150];
		int stevec=0;
		int zacetek=0;
		int konec=0;
		String povezava="";
		for(int i=0; i<input.length();i++){
			if(input.indexOf("hranilne-vrednosti.php",konec) != -1){
				zacetek=input.indexOf("hranilne-vrednosti.php",konec);
				konec=input.indexOf("\"",zacetek);
				povezave[stevec]="/"+input.substring(zacetek,konec);
				stevec++;
			}else{
				break;
			}
			
		}
		
		// izpisi tabelo povezav
		/*System.out.println("-----------------------TABELA POVEZAV---------------------------");
		for(int i=0; i<100;i++){
			if(povezave[i]!=null){
				System.out.println(povezave[i]);
			}
		}*/
		return povezave;
	}

	public static String[] parseHTMLDocumentImeHrane(String input){
		String hrana[]=new String[150];
		int stevec=0;
		int zacetek=0;
		int zacetek1=0;
		int konec=0;
		String povezava="";
		for(int i=0; i<input.length();i++){
			if(input.indexOf("hranilne-vrednosti.php",konec) != -1){
				zacetek=input.indexOf("hranilne-vrednosti.php",konec);
				zacetek1=input.indexOf("\"",zacetek)+2;
				konec=input.indexOf("</a></td>",zacetek1);
				hrana[stevec]=input.substring(zacetek1,konec);
				stevec++;
			}else{
				break;
			}
			
		}
		
		// izpisi tabelo povezav
		/*System.out.println("-----------------------TABELA HRANE---------------------------");
		for(int i=0; i<100;i++){
			if(hrana[i]!=null){
				System.out.println(hrana[i]);
			}
		}*/
		return hrana;
	}


	public static String[] parseHTMLDocumentImeLastnosti(String input){				// Energija (kcal), Maščobe, Holesterol, Ogljikovi hidrati skupaj, Beljakovine
		int zacetek=0; 
		int konec =0;
		String tabelaLastnosti[]= new String[5];
		int stevec=0;
			for(int j=0; j<input.length(); j++){
				if(input.indexOf("class=\"hrd1\">",konec)!=-1 && stevec==4){
					zacetek= input.indexOf("class=\"hrd1\">",konec)+13;
					konec = input.indexOf("</td>",zacetek);
					tabelaLastnosti[stevec]=input.substring(zacetek,konec);
					stevec++;
					continue;
				}else{
					if(input.indexOf("class=\"hrd\">",konec) !=-1){
						zacetek= input.indexOf("class=\"hrd\">",konec)+12;
						konec = input.indexOf("</td>",zacetek);
						tabelaLastnosti[stevec]=input.substring(zacetek,konec);
						stevec++;
					}else{
						break;
					}
				}
			}

		/*System.out.println("-----------------------TABELA LASTNOSTI---------------------------");
		for(int i=0; i<5;i++){
			if(tabelaLastnosti[i]!=null){
				System.out.print(tabelaLastnosti[i]+"\t");
			}if(i==4){
				System.out.println();
			}
			
		}*/
		return tabelaLastnosti;
	}	
	
	public static void napolniTabeloZTipomInImenomZivila(String[] tabelaImenHrane, String tipZivila){
		int pozicija=0;
		for(int i=0; i< dolzinaTabele(tabelaImenHrane); i++){
			while(tabela[pozicija][1]!=null){
				pozicija++;
			}
			tabela[pozicija][0]=tipZivila;
			tabela[pozicija][1]=tabelaImenHrane[i];
			pozicija++;
		}
	}

	public static void napolniTabeloZLastnostmiZivila(String[] tabelaLastnosti){
		int pozicija=0;
			while(tabela[pozicija][2]!=null){
				pozicija++;
			}
			tabela[pozicija][2]=tabelaLastnosti[0];
			tabela[pozicija][3]=tabelaLastnosti[1];
			tabela[pozicija][4]=tabelaLastnosti[2];
			tabela[pozicija][5]=tabelaLastnosti[3];
			tabela[pozicija][6]=tabelaLastnosti[4];
	}

	public static int dolzinaTabele(String[] t){
		int stevec=0;
		for(int i=0; i<t.length; i++){
			if(t[i]!=null){
				stevec++;
			}else{break;}

		}
		return stevec;
	}

	public static int dolzinaTabele2D(String[][] t){
		int stevec=0;
		for(int i=0; i<t.length; i++){
			if(t[i][0]!=null){
				stevec++;
			}else{break;}

		}
		return stevec;
	}

	public static void izpis1DTabele(int[] t){
		for(int i=0; i<t.length;i++){
				System.out.print(t[i]+" ");
		}
	}

	public static void izpis2DTabele(String t[][]){
		for(int i=0; i<t.length;i++){
			for(int j=0; j<t[0].length;j++){
				System.out.print(t[i][j]+"\t\t");
			}
			System.out.println();
		}
	}

	public static int[] izracunajSirinoPosamaznegaStolpca(){
		int sirina[]=new int[7];
		int max=-1;
		for(int i=0; i<7; i++){
			for(int j=0; j<dolzinaTabele2D(tabela); j++){
				if(tabela[j][i].length()>max){
					max=tabela[j][i].length();
				}
			}
			sirina[i]=max;
			max=-1;
		}
		
		return sirina;
	}
	public static void zapisiVDatoteko(){
		try{
		//PrintWriter writer = new PrintWriter("foodDB.txt", "UTF-8");

		PrintStream writer = new PrintStream(new File ("FoodDB.txt"));
		String vrstica="";
		int sirinaVrstic[]=izracunajSirinoPosamaznegaStolpca();
		//izpis1DTabele(sirinaVrstic);
		for(int i=0; i<dolzinaTabele2D(tabela);i++){
			vrstica="";
			for(int j=0; j<7;j++){
				if(j==6){
					writer.printf("%"+(sirinaVrstic[j]+5)+"s\n",tabela[i][j]);
					break;
				}
				writer.printf("%"+(sirinaVrstic[j]+5)+"s",tabela[i][j]);

			}
		}
		writer.close();
		}catch(Exception ex){

		}
	}
}