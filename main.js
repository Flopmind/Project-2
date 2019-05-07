"use strict";

// localStorage setup code here
const prefix = "foodMap878454554486733";
const searchKey = prefix + "Search"
const latKey = prefix + "Lat";
const longKey = prefix + "Long";
const storedSearch = localStorage.getItem(searchKey);
const storedLat = localStorage.getItem(latKey);
const storedLong = localStorage.getItem(longKey);

let app = new Vue
    ({
        el: '#root',
        data:
        {
            area: "your area",
            restaurants: [],
            names: [],
            options: ["category1", "category2", "category3"],
            lat: 43.083040,
            lng: -77.6799,
            radius: 8047,
            search: "",
            category: "Afghan"
        },
        methods:
        {
            searchButton() {
                for (let i = 0; i < this.restaurants.length; i++) {
                    this.restaurants[i].marker.setMap(null);
                }
                this.getData();
                let searchString = searchField.value.trim();
                // add punctuation removal here
                let searchTerms = searchString.split(" ");
                for (let i = 0; i < searchTerms.length; i++) {
                    let word = searchTerms[i];
                    let path = pathStart + "/" + word;
                    let wordOccurance = 0;
                    // add get wordOccurance value here
                    for (let j = 0; j < termList.length; j++) {
                        if (termList[j].term == word) {
                            wordOccurance = termList[j].count;
                        }
                    }
                    wordOccurance++;
                    firebase.database().ref(path).set({
                        term: word,
                        count: wordOccurance
                    });
                }

                if (navigator.geolocation) {
                    let pos =
                    {
                        lat: Number(app.lat),
                        lng: Number(app.lng)
                    };
                    infoWindow.setPosition(pos);
                }
            },
            getData() {
                let fetchUrl =
                    "https://people.rit.edu/~jxs2828/330/Projects/Project2/yelp-proxy.php?" +
                    "term=" + this.search +
                    "&lat=" + this.lat +
                    "&lng=" + this.lng +
                    "&rad=" + this.radius +
                    "&cat=" + this.category;

                let xhr = new XMLHttpRequest();

                //xhr.onprogress = (e) => console.log(`PROGRESS: ${e}`);
                //xhr.onerror = (e) => console.log(`ERROR: ${e}`);
                xhr.onload = (e) => {
                    let json = JSON.parse(e.target.responseText)
                    //createMarkers(json.businesses);
                    if (json.businesses != undefined && json.businesses[0] != undefined && json.businesses[0].location != undefined && json.businesses[0].location.city != undefined) {
                        app.area = json.businesses[0].location.city;
                    }
                    else {
                        app.area = "your area";
                    }
                    this.restaurants = [];
                    this.names = [];
                    json.businesses.forEach(element => {
                        console.log("hi");
                        this.restaurants.push(new restaurant(
                            element.name,
                            element.price,
                            element.coordinates.longitude,
                            element.coordinates.latitude
                        ));
                            //uncomment to add namelist
                        this.names.push(element.name);
                    });
                }
                xhr.open("GET", fetchUrl, true);
                xhr.send();
            },
            searchFieldChange(event) {
                localStorage.setItem(searchKey, event.target.value);
                app.search = event.target.value;
            },
            latChange(event) {
                localStorage.setItem(latKey, event.target.value);
            },
            lngChange(event) {
                localStorage.setItem(longKey, event.target.value);
            },
            radiusSelectChange(event) {
                let radVal = event.target.value;
                if (radVal > 10) {
                    app.radius = 40000;
                }
                else {
                    app.radius = Math.round(radVal * 1609.344);
                }
            },
            optionSelectChange(event) {
                app.category = event.target.value;
            }
        },
        computed:
        {

        }
    });


// Firebase code here
let config = {
    apiKey: "AIzaSyDqD6AV81PzwbGdz0q28GTTXQmZXSS656U",
    authDomain: "food-map-1edb8.firebaseapp.com",
    databaseURL: "https://food-map-1edb8.firebaseio.com",
    projectId: "food-map-1edb8",
    storageBucket: "food-map-1edb8.appspot.com",
    messagingSenderId: "335280513115"
};
firebase.initializeApp(config);

const pathStart = "Terms";

firebase.database().ref(pathStart).on("value", dataChanged, firebaseError);

let termList = [];

function dataChanged(data) {
    let obj = data.val();
    for (let key in obj) {
        termList.push(obj[key]);
    }
}

function firebaseError(error) {
    
}

searchField.onchange = e => {
    localStorage.setItem(searchKey, e.target.value);
    app.search = e.target.value;
};

if (storedSearch) {
    app.search = storedSearch;
}
if (storedLat) {
    app.lat = storedLat;
}
if (storedLong) {
    app.lng = storedLong;
}

let categories = [];
for (let i = 0; i < yelpList.length; i++) {
    for (let ii = 0; ii < yelpList[i].parents.length; ii++) {
        if (yelpList[i].parents[ii] == "restaurants") {
            categories.push(yelpList[i].title);
            break;
        }
    }
}
app.options = categories;

let map, infoWindow;
function initMap() {
    map = new google.maps.Map(document.querySelector('#map'),
        {
            center: { lat: 43.083040, lng: -77.6799 },
            zoom: 16
        });
    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            app.lat = pos.lat;
            app.lng = pos.lng;

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    }
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
let markers = [];

class restaurant {
    constructor(name, price, Lng, Lat) {
        this.name = name;
        this.price = price;
        this.marker = new google.maps.Marker({
            position: {
                lat: Lat,
                lng: Lng
            },
            map: map
        });
        this.handler = function (e) {
            if (infoWindow) infoWindow.close()
            infoWindow = new google.maps.InfoWindow({
                map: map,
                position: {
                    lat: Lat,
                    lng: Lng
                },
                content: "<b>" + name + " <b> <b> " + price + "<b>"
            })
        };
        google.maps.event.addListener(this.marker, 'click', this.handler);
    }
}