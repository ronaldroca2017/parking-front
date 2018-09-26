var GoogleMap = {
  obj: null,
  info: null,
  inw: null,
  autocomplete: null,
  places: null,
  markers : [],
  grafico : [],
  urlser : 'http://apiparking.oscarpasache.com/api/search',
  consult: null,
  painted: [],

  center: {
    lat: -12.077450,
    lng: -77.093677
  },

  init: function () {
      var map = $("#map");
      if ( map.length > 0 ) this.runMap( map );
  },

  runMap: function ( map ) {
    this.obj = new google.maps.Map( map.get(0) , {
      center: this.center,
      zoom: 16,
      mapTypeId: 'terrain'
    });

    //this.addMarker( this.center );
    this.inw = new google.maps.InfoWindow({map: this.obj});
    this.obj.addListener('center_changed', function(e) {
      window.setTimeout(GoogleMap.extdata(e), 3000);
    });
    this.conectarDB(this.inw,this.obj);
    //this.iniciarAutocompletar();
  },

  addMarker: function ( position ) {
    new mapIcons.Marker({
      position: position,
      map: this.obj,
      icon: {
        path: mapIcons.shapes.SQUARE_PIN,
        fillColor: '#00CCBB',
        fillOpacity: 1,
        strokeColor: '',
        strokeWeight: 0
      },
      map_icon_label: '<span class="map-icon map-icon-map-pin"></span>'
    });
  },

  plantilla: function (of,clase,nid){
    if ((of.image_1 == "") || (of.image_1 == null)){
      var imageg="/assets/welcome/carrito.jpg";
    } else {
      var imageg=of.image_1;
    }
    if (clase==1){
      return "<div id='o"+ nid +"' class='box-oferta box-oferta2'><span class='of-price'>" + of.price + " S/. /mes</span><table><tr><td><img class='list-img' src='"+ imageg +"'/></td><td><p id='search-subt'><i class='fa fa-id-card'></i>"  + of.address +"</p><p>  <i class='fa fa-flag-o'></i>"  + of.days +"</p><p>  <i class='fa fa-map-marker'> " + of.location + "</p><table><tr><td id='idts'><div>Con techo</div></td><td id='idts'><div>Grande</div></td><td id='idts'><div>Control</div></td><td id='idts'><div></div></td></tr><tr><td id='idts'><div class='big-icon-search'><i class='fa fa-umbrella'></div></td><td id='idts'><div class='big-icon-search'><i class='fa fa-taxi'></div></td><td id='idts'><div class='big-icon-search'><i class='fa fa-lock'></div></td><td id='idts'> <button><a href='/parking/show' onclick='show_offer("+ of.of_id +")'>Ver detalle</a></button></td></tr></table></td></tr></table></div><br>";
    } else {
      return "<div id='o"+ nid +"' class='box-oferta'><span class='of-price'>" + of.price + " S/. /mes</span><table><tr><td><img class='list-img' src='"+ imageg +"'/></td><td><p id='search-subt'><i class='fa fa-id-card'></i>"  + of.address +"</p><p>  <i class='fa fa-flag-o'></i>"  + of.days +"</p><p>  <i class='fa fa-map-marker'> " + of.location + "</p><table><tr><td id='idts'><div>Con techo</div></td><td id='idts'><div>Grande</div></td><td id='idts'><div>Control</div></td><td id='idts'><div></div></td></tr><tr><td id='idts'><div class='big-icon-search'><i class='fa fa-umbrella'></div></td><td id='idts'><div class='big-icon-search'><i class='fa fa-taxi'></div></td><td id='idts'><div class='big-icon-search'><i class='fa fa-lock'></div></td><td id='idts'> <button><a href='/parking/show' onclick='show_offer("+ of.of_id +")'>Ver detalle</a></button></td></tr></table></td></tr></table></div><br>";
    }
  },

  ubicart: function(){
    var cm2 =GoogleMap.center;
    var nz2 = GoogleMap.obj.getZoom();
    var dv2 =$("#map").height()*Math.PI*Math.cos(cm2.lat*Math.PI/180)/Math.pow(2,nz2+2);
    var dh2 =$("#map").width()*Math.PI*Math.cos(cm2.lng*Math.PI/180)/Math.pow(2,nz2);

    var datosjs = {
      lati: GoogleMap.obj.getCenter().lat(),
      longi: GoogleMap.obj.getCenter().lng(),
      dla: dv2,
      dlo: dh2
    };
    var arraytemporal=[];
    if (GoogleMap.consult != null){
      GoogleMap.consult.abort();
      GoogleMap.consult=null;
      console.log("Abortado");
    }
    GoogleMap.consult = $.post(GoogleMap.urlser, datosjs, function(response){
      arraytemporal=response.data;
      var pinpon=-1;
      var numid=1;
      var cm =GoogleMap.center;
      var nz = GoogleMap.obj.getZoom();
      var dv =$("#map").height()*Math.PI*Math.cos(cm.lat*Math.PI/180)/Math.pow(2,nz+2);
      var dh =$("#map").width()*Math.PI*Math.cos(cm.lng*Math.PI/180)/Math.pow(2,nz);

      $('.list_offers').html('');

      var arrayampliado=[];
      arraytemporal.forEach( function(valor, indice, arreglo) {
        var distancia=Math.pow(Math.pow(cm.lat-valor.latitud,2)+Math.pow(cm.lng-valor.longitud,2),0.5);
        arrayampliado.push({
          latitude: valor.latitud,
          longitude: valor.longitud,
          distance: distancia,
          location: valor.nombre,
          address: valor.direccion,
          //price:valor.price,
          price: 1.00,
          days: 1,
          image_1: 'http://parking.oscarpasache.com/images/garage.jpg',
          of_id: valor.id
        })
      });

      arrayampliado=arrayampliado.sort(function (a, b) {
        return a.distance - b.distance ;
      });

      arraytemporal=arrayampliado;
      console.log(cm);
      console.log(arraytemporal);
      var _html = '';
      arraytemporal.forEach( function(valor, indice, arreglo) {
        //var la =parseFloat(valor.location.split(",")[0]);
        //var lo =parseFloat(valor.location.split(",")[1]);
        var la =valor.latitude;
        var lo =valor.longitude;

        if ( (la<cm.lat+dv) && (la>cm.lat-dv) && (lo<cm.lng+dh) && (lo>cm.lng-dh) ){
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(la,lo),
            map: GoogleMap.obj,
            title: valor.address,
            animation: google.maps.Animation.DROP
          });
          var idstring="o"+numid;
          var michi="#"+idstring;
          marker.addListener('click', function() {
            for (var i = 0; i < GoogleMap.painted.length; i++) {
             $( GoogleMap.painted[i]).removeClass( "boxresaltado" );
            }
            $( michi ).addClass( "boxresaltado" );
            GoogleMap.painted.push(michi);
            document.getElementById(idstring).scrollIntoView();
          });
          GoogleMap.markers.push(marker);
          _html += GoogleMap.plantilla(valor,pinpon,numid);
          pinpon=pinpon*(-1);
          numid+=1;
        }
      });

      $('.list_offers').html(_html);

      var redsqrt = [
        {lat: cm.lat+dv, lng: cm.lng+dh},
        {lat: cm.lat+dv, lng: cm.lng-dh},
        {lat: cm.lat-dv, lng: cm.lng-dh},
        {lat: cm.lat-dv, lng: cm.lng+dh}
      ];

      // colocar el cuadro rojo
      var sqrtONmap = new google.maps.Polygon({
        paths: redsqrt,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 0.5,
        fillColor: '#FF0000',
        fillOpacity: 0.08
      });
      GoogleMap.grafico.push(sqrtONmap);
      sqrtONmap.addListener('click', function(e) {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        window.setTimeout(GoogleMap.extdata(e), 3000);

      }, {passive: true});
      sqrtONmap.setMap(GoogleMap.obj);
    }, 'json');
  },

  conectarDB: function(inw,obj){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        GoogleMap.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(GoogleMap.center);
        inw.setPosition(GoogleMap.center);
        inw.setContent('Ud esta aqui!');
        obj.setCenter(GoogleMap.center);
        //GoogleMap.ubicart();
      }, function() {
        //GoogleMap.ubicart();
        GoogleMap.handleLocationError(true, inw, obj.getCenter());
      });
    }
  },

  extdata: function(e){
    var datosjs = {};
    for (var i = 0; i < GoogleMap.markers.length; i++) {
      GoogleMap.markers[i].setMap(null);
    }
    for (var i = 0; i < GoogleMap.grafico.length; i++) {
      GoogleMap.grafico[i].setMap(null);
    }

    GoogleMap.markers=[];
    GoogleMap.center ={lat: GoogleMap.obj.getCenter().lat() , lng: GoogleMap.obj.getCenter().lng() };

    GoogleMap.ubicart();
  },

  handleLocationError: function (browserHasGeolocation, infoWindow, pos) {
    /*infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: El servicio de geolocalizacion ha fallado.' :
                          'Error: Tu navegador no soporta geolocalizacion.');*/
  },

  iniciarAutocompletar: function(){
    this.autocomplete = new google.maps.places.autocomplete((document.getElementById('autocomplete')), {
      types: ['geocode'],
      componentRestrictions: {'country': 'pe'}
    });
    this.places = new google.maps.places.PlacesService(this.obj);
    this.autocomplete.addListener('place_changed', function () {
      var place = GoogleMap.autocomplete.getPlace();
      if (place.geometry) {
        GoogleMap.obj.panTo(place.geometry.location);
        GoogleMap.obj.setZoom(16);
        GoogleMap.extdata(null);
      } else {
        document.getElementById('autocomplete').placeholder = 'Busque un lugar';
      }
    });
  }
}
