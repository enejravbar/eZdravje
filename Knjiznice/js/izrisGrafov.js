
      google.load("visualization", "1", {
        packages: ["corechart"]
      });
google.setOnLoadCallback(drawChart1);

//----------------------------- GRAF TELESNE VIŠINE -----------------------------//

function drawChart1() {
  var data = google.visualization.arrayToDataTable(posredujPodatkeZaGraf1("071f61ac-1e15-4a69-8cdb-4d1b7efa3b9d"));

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
    chartArea:{top:100, bottom:150}
  };

  var chart = new google.visualization.AreaChart(document.getElementById('graf1'));
  chart.draw(data, options);
}

google.load("visualization", "1", {
  packages: ["corechart"]
});
google.setOnLoadCallback(drawChart2);

//----------------------------- GRAF TELESNE MASE -----------------------------//

function drawChart2() {
  var data = google.visualization.arrayToDataTable([
    ['Datum', 'Telesna masa'],
    ['2013', 1000],
    ['2014', 1170],
    ['2015', 660],
    ['2016', 11030]
  ]);

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
    chartArea:{top:100, bottom:50}
  }

  var chart = new google.visualization.AreaChart(document.getElementById('graf2'));
  chart.draw(data, options);
}

google.load("visualization", "1", {
  packages: ["corechart"]
});
google.setOnLoadCallback(drawChart2);

//----------------------------- GRAF TELESNE TEMPERATURE -----------------------------//

function drawChart3() {
  var data = google.visualization.arrayToDataTable([
    ['Datum', 'Telesna temperatura'],
    ['2013', 1000],
    ['2014', 1170],
    ['2015', 660],
    ['2016', 11030]
  ]);

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
    chartArea:{top:100, bottom:50}
  }

  var chart = new google.visualization.AreaChart(document.getElementById('graf3'));
  chart.draw(data, options);
}

google.load("visualization", "1", {
  packages: ["corechart"]
});
google.setOnLoadCallback(drawChart3);

//----------------------------- GRAF ITM -----------------------------//

function drawChart4() {
  var data = google.visualization.arrayToDataTable([
    ['Datum', 'ITM'],
    ['2013', 1000],
    ['2014', 1170],
    ['2015', 660],
    ['2016', 11030]
  ]);

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
    chartArea:{top:100, bottom:50}
  }

  var chart = new google.visualization.AreaChart(document.getElementById('graf4'));
  chart.draw(data, options);
}

google.load("visualization", "1", {
  packages: ["corechart"]
});
google.setOnLoadCallback(drawChart4);

$(window).resize(function() {
  drawChart1();
  drawChart2();
  drawChart3();
  drawChart4();
});
