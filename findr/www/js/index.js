/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
let app = {
    // Application Constructor
    init: function() {
        app.initMap();
        
    },

    map: "",
    lat:"",
    lng:"",

    initMap: () => {

        app.getLocation();
    },

    getLocation: () => {
    if(navigator.geolocation){
        let giveUp = 1000 * 30;  //30 seconds
        let tooOld = 1000 * 60 * 60;  //one hour
        let options ={
            enableHighAccuracy: true,
            timeout: giveUp,
            maximumAge: tooOld
        }
        
        navigator.geolocation.getCurrentPosition(app.gotPos, app.posFail, options);
    }else{
        //using an old browser that doesn't support geolocation
    }
},



gotPos: (position) => {
    
    app.lat = position.coords.latitude;
    app.lng = position.coords.longitude;

    //initialize map with coordinates

    app.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: app.lat, lng: app.lng },
        zoom: 16,
        disableDoubleClickZoom: true, // disable zoom on doubleclick
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })

      let map = new google.maps.Map(document.getElementById('map'), app.map);

        let marker = new google.maps.Marker({
        position: {lat: app.lat, lng: app.lng},//{ lat: -35.543, lng: 150.123 }, //position should not be hard coded
        map: map,
        label: "B",
        title: "This is the mouse over text"
      })

      //Creating new marker when user doubleclicks on map 
      google.maps.event.addListener(map, "dblClick", (ev) => {
        let marker = new google.maps.Marker({
            position: ev.latlng,
            map: map,
            title: ev.latlng.lat() + "," + ev.latlng.lng() //add Title user input 
        })

        // To add the marker to the map, call setMap();
        marker.setMap(map);

        //To remove a marker from the map, call the setMap() method passing null as the argument.
        //marker.setMap(null);

      })
    
},

posFail: (err) => {
    //err is a number
    let errors = {
        1: 'No permission',
        2: 'Unable to determine',
        3: 'Took too long'
    }
    console.log(errors[err]);
}
 

    
};

 document.addEventListener('deviceready', app.init);
// document.addEventListener('DOMContentLoaded', app.init);