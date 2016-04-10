function divElementEnostavniTekst(sporocilo) {
  var jeSmesko = sporocilo.indexOf('http://sandbox.lavbic.net/teaching/OIS/gradivo/') > -1;
  if (jeSmesko) {
    sporocilo = sporocilo.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace('&lt;img', '<img').replace('png\' /&gt;', 'png\' />');
    return $('<div style="font-weight: bold"></div>').html(sporocilo);
  } else {
    return $('<div style="font-weight: bold;"></div>').text(sporocilo);
  }
}

function divElementHtmlTekst(sporocilo) {
  return $('<div></div>').html('<i>' + sporocilo + '</i>');
}

function procesirajVnosUporabnika(klepetApp, socket) {
  var sporocilo = $('#poslji-sporocilo').val();
  var sistemskoSporocilo;
  
<<<<<<< HEAD
  if (sporocilo.match(/[a-z\-_0-9\/\:\.]*\.jpg|jpeg|png|gif/g)) {
    var slike = '<div>' + dodajSlike(sporocilo) + '</div>';
=======
  if (sporocilo.match(/https?:\/\/www.youtube.com\/watch\?v=\w+\b/g)) {
    var video = '<div>' + dodajVideo(sporocilo) + '</div>';
>>>>>>> youtube
  }

  if (sporocilo.charAt(0) == '/') {
    sistemskoSporocilo = klepetApp.procesirajUkaz(sporocilo);
    if (sistemskoSporocilo) {
      $('#sporocila').append(divElementHtmlTekst(sistemskoSporocilo));
    }
  } else {
    sporocilo = filtirirajVulgarneBesede(sporocilo);
    sporocilo = dodajSmeske(sporocilo);
    klepetApp.posljiSporocilo(trenutniKanal, sporocilo);
    $('#sporocila').append(divElementEnostavniTekst(sporocilo));
    $('#sporocila').scrollTop($('#sporocila').prop('scrollHeight'));
  }
  
   klepetApp.posljiVideo(trenutniKanal, video);
  $('#sporocila').append(video);
  $('#sporocila').scrollTop($('#sporocila').prop('scrollHeight'));

  klepetApp.posljiSlike(trenutniKanal, slike);
  $('#sporocila').append(slike);
  $('#sporocila').scrollTop($('#sporocila').prop('scrollHeight'));

  $('#poslji-sporocilo').val('');
}


var socket = io.connect();
var trenutniVzdevek = "", trenutniKanal = "";

var vulgarneBesede = [];
$.get('/swearWords.txt', function(podatki) {
  vulgarneBesede = podatki.split('\r\n');
});

function filtirirajVulgarneBesede(vhod) {
  for (var i in vulgarneBesede) {
    vhod = vhod.replace(new RegExp('\\b' + vulgarneBesede[i] + '\\b', 'gi'), function() {
      var zamenjava = "";
      for (var j=0; j < vulgarneBesede[i].length; j++)
        zamenjava = zamenjava + "*";
      return zamenjava;
    });
  }
  return vhod;
}

$(document).ready(function() {
  var klepetApp = new Klepet(socket);
  
  socket.on('video', function(rezultat) {
    $('#sporocila').append(rezultat.besedilo);
  })

  socket.on('vzdevekSpremembaOdgovor', function(rezultat) {
    var sporocilo;
    if (rezultat.uspesno) {
      trenutniVzdevek = rezultat.vzdevek;
      $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
      sporocilo = 'Prijavljen si kot ' + rezultat.vzdevek + '.';
    } else {
      sporocilo = rezultat.sporocilo;
    }
    $('#sporocila').append(divElementHtmlTekst(sporocilo));
  });

  socket.on('pridruzitevOdgovor', function(rezultat) {
    trenutniKanal = rezultat.kanal;
    $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
    $('#sporocila').append(divElementHtmlTekst('Sprememba kanala.'));
  });

  socket.on('sporocilo', function (sporocilo) {
    var novElement = divElementEnostavniTekst(sporocilo.besedilo);
    $('#sporocila').append(novElement);
  });
  
  socket.on('kanali', function(kanali) {
    $('#seznam-kanalov').empty();

    for(var kanal in kanali) {
      kanal = kanal.substring(1, kanal.length);
      if (kanal != '') {
        $('#seznam-kanalov').append(divElementEnostavniTekst(kanal));
      }
    }

    $('#seznam-kanalov div').click(function() {
      klepetApp.procesirajUkaz('/pridruzitev ' + $(this).text());
      $('#poslji-sporocilo').focus();
    });
  });

  socket.on('uporabniki', function(uporabniki) {
    $('#seznam-uporabnikov').empty();
    for (var i=0; i < uporabniki.length; i++) {
      $('#seznam-uporabnikov').append(divElementEnostavniTekst(uporabniki[i]));
    }
    
     $('#seznam-uporabnikov div').click(function() {
    var msgimput = $('#poslji-sporocilo');
    msgimput.val('/zasebno "' + $(this).text() +'" ');
    msgimput.focus();
    });
  });

  setInterval(function() {
    socket.emit('kanali');
    socket.emit('uporabniki', {kanal: trenutniKanal});
  }, 1000);

  $('#poslji-sporocilo').focus();

  $('#poslji-obrazec').submit(function() {
    procesirajVnosUporabnika(klepetApp, socket);
    return false;
  });
  
  
});

<<<<<<< HEAD
function addPic(vhodnoBesedilo) {
  var format = /https?:.+\.jpg|png|gif/;
  var pic = format.exec(vhodnoBesedilo);
  if (pic != null) {
    pic.forEach(function(zadetek) {
      vhodnoBesedilo += "<br><img hspace='20' width='200' src='" + pic + "'>";
    });
  }
  return vhodnoBesedilo;
=======
function dodajVideo(vhodnoBesedilo) {
  var link = /https?:\/\/www.youtube.com\/watch\?v=\w+\b/g;
  var ext = link.exec(vhodnoBesedilo);
  var video = '';
   while(ext != null) {
    ext[0] = ext[0].replace("watch?v=", "v/");
    video += "<iframe src='" + ext[0] + "&output=embed' allowfullscreen height=150 width=200></iframe>";
    ext = link.exec(vhodnoBesedilo);
    // console.log(zadetki[0]); 
    }
  
  return video;
>>>>>>> youtube
}

function dodajSmeske(vhodnoBesedilo) {
  var preslikovalnaTabela = {
    ";)": "wink.png",
    ":)": "smiley.png",
    "(y)": "like.png",
    ":*": "kiss.png",
    ":(": "sad.png"
  }
  for (var smesko in preslikovalnaTabela) {
    vhodnoBesedilo = vhodnoBesedilo.replace(smesko,
      "<img src='http://sandbox.lavbic.net/teaching/OIS/gradivo/" +
      preslikovalnaTabela[smesko] + "' />");
  }
  return vhodnoBesedilo;
}

<<<<<<< HEAD
function dodajSlike(vhodnoBesedilo) {
  var link = /https?:.+\.jpg|png|gif/g;
  var pic = link.exec(vhodnoBesedilo);
  var slike = '';
   while(pic != null) {
    slike += "<img hspace='20' width='200' src='" + pic[0] + "'> ";
    pic = link.exec(vhodnoBesedilo);
    }
  
  return slike;
}
=======
>>>>>>> youtube
