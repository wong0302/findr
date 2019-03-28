let app = {
    map: null,
    position: "",
    label: "",
    markers: [], //Array of markers saved from local storage
    markerKey: "Markers", // Local Storage Key
    currentMarker: null,
    defaultPos: { //default location to use if geolocation fails
        coords: {
            latitude: 45.555,
            longitude: -75.555
        },

    },
    // Application Constructor
    init: () => {
        app.ready();

    },

    ready: () => {

        app.getLocation();
        app.addListeners();

    },

    /************************* GET MAP LOCATION  ***************************/
    getLocation: () => {
        if (navigator.geolocation) {
            let giveUp = 1000 * 30; //30 seconds
            let tooOld = 1000 * 60 * 60; //one hour
            let options = {
                enableHighAccuracy: true,
                timeout: giveUp,
                maximumAge: tooOld
            }

            navigator.geolocation.getCurrentPosition(app.gotPosition, app.posFail, options);
        } else {
            //using an old browser that doesn't support geolocation
            //pass default location to gotPosition
            app.gotPosition(app.defaultPos);
        }
    },

    /************************* GET CLICKED POSITION ***************************/

    gotPosition: (position) => {

        //initialize map with coordinates
        app.map = new google.maps.Map(document.getElementById("map"), {
            center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            },
            zoom: 16,
            disableDoubleClickZoom: true, // disable zoom on doubleclick
            mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        app.getLocalStorage();
        app.addMapListeners(); //call Listeners

    },

    /************************* CLICK LISTENER  ***************************/
    addListeners: () => {
        //Listeners for modal
        document.getElementById("cancelBtn").addEventListener("click", app.hideModal)
        document.getElementById("confirmBtn").addEventListener("click", app.addMarker)
    },

    /************************* LISTEN FOR CLICK ON MAP  ***************************/

    addMapListeners: () => {
        console.log("addMapListeners");
        app.map.addListener("dblclick", app.markerDblClick); //map is global variable, addListener is method
    },

    /*************************      ADD MARKER     ***************************/

    addMarker: () => {
        app.label = document.getElementById("label").value; //user label input
        // let delBtn = document.getElementById("delBtn");

        console.log("app.postion:", app.position);
        //pass through global variable position
        let marker = new google.maps.Marker({ //local variable
            //pass in object with various properties
            map: app.map,
            draggable: false, //user ability to move marker
            position: app.position //specifies location clicked

        });

        let infoWindow = new google.maps.InfoWindow({
            map: app.map
        });
        let contentDiv = document.createElement("div");
        let h1 = document.createElement("h1");
        h1.textContent = app.label;
        contentDiv.appendChild(h1);
        let delBtn = document.createElement("p");
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => {
            app.removeMarker(marker, infoWindow)
        });
        contentDiv.appendChild(delBtn);
        infoWindow.setContent(contentDiv);

        google.maps.event.addListener(marker, "click", function () {
            infoWindow.open(map, this);
            app.map.panTo(marker.getPosition());

        });

        let markerObject = {
            "label": app.label,
            "position": {
                lat: app.position.lat(),
                lng: app.position.lng()
            },
            "id": Date.now()
        }

        app.markers.push(markerObject);
        console.log(markerObject);

        //add double click listener to Marker
        // marker.addListener("dblclick", app.markerDblClick);

        app.hideModal();

        app.saveLocalStorage();

        // clearing input fields
        document.getElementById("label").value = "";
    },

    /************************* CLICK FUNCTIONS ***************************/

    markerClick: (ev) => {
        console.log("Click", ev);
        console.log(this);
        let marker = this; // to use the marker locally
        console.log("marker " + marker)
        console.log("getpos " + marker.getPosition)
        app.currentMarker = marker; //to use the marker globally
        app.map.panTo(marker.getPosition());
    },

    markerDblClick: (ev) => {
        app.showModal();
        app.position = ev.latLng;
        console.log("Double Click", ev);
    },

    removeMarker: (marker, infoWindow) => {
        console.log("Delete Button Click");
        //remove the marker from the map
        marker.setMap(null);
        infoWindow.close();
        app.currentMarker = null;
        app.removeLocalStorage(marker);
    },

    posFail: (err) => {
        //err is a number
        let errors = {
            1: 'No permission',
            2: 'Unable to determine',
            3: 'Took too long'
        }
        console.log(errors[err]);
        //failed to get the user's location for whatever reason
        app.gotPosition(app.defaultPos);
    },

    /*************************      MODAL    ***************************/
    showModal: () => {
        document.getElementById("modal").style.display = "block";
    },

    hideModal: () => {
        document.getElementById("modal").style.display = "none";
    },

    /*************************      LOCAL STORAGE    ***************************/

    saveLocalStorage: () => {
        console.log("Saving current Marker to Local Storage");
        //LocalStorage can only store strings, To do this we use the JSON.stringify() method before passing to setItem() 
        localStorage.setItem(app.markerKey, JSON.stringify(app.markers));
    },

    removeLocalStorage: (marker) => {
        console.log("marker is", marker);
        for (let i = 0; i < app.markers.length; i++) {
            const item = app.markers[i].position; //Compare lat and lng if no matches then delete 
            if (item.lat == marker.getPosition().lat() && item.lng == marker.getPosition().lng()) {
                console.log("Test", item.lat, item.lng);
                console.log("Delete Marker:", marker.getPosition().lat(), marker.getPosition().lng());
                app.markers.splice(i, 1);
                break;
            }

        }

        localStorage.setItem(app.markerKey, JSON.stringify(app.markers));
    },

    getLocalStorage: () => { //retrieve the user key stored above
        if (localStorage.getItem(app.markerKey)) {
            //JSON.parse() method converts a JSON string into a Javascript Object
            app.markers = JSON.parse(localStorage.getItem(app.markerKey));

            app.markers.forEach(item => {
                console.log("item is", item);
                console.log("Label: ", item.label);
                console.log("lat is", item.position.lat);
                let marker = new google.maps.Marker({ //local variable
                    //pass in object with various properties
                    map: app.map,
                    draggable: false, //user ability to move marker
                    position: item.position
                });

                let infoWindow = new google.maps.InfoWindow({
                    map: app.map
                });
                //   let position = app.position;
                //   infoWindow.setPosition(position);
                let contentDiv = document.createElement("div");
                let h1 = document.createElement("h1");
                h1.textContent = item.label;
                contentDiv.appendChild(h1);
                let delBtn = document.createElement("p");
                delBtn.textContent = "Delete";
                delBtn.addEventListener("click", () => {
                    app.removeMarker(marker, infoWindow)
                });
                contentDiv.appendChild(delBtn);
                infoWindow.setContent(contentDiv);

                google.maps.event.addListener(marker, "click", () => {
                    infoWindow.open(map, this);
                    app.map.panTo(marker.getPosition());

                });
            })
        }
    }


};

document.addEventListener('deviceready', app.init);