"use strict";

let app = new Vue
    ({
        el: '#root',
        data:
        {
            terms: [],
        }
    });
    
let config = {
    apiKey: "AIzaSyDqD6AV81PzwbGdz0q28GTTXQmZXSS656U",
    authDomain: "food-map-1edb8.firebaseapp.com",
    databaseURL: "https://food-map-1edb8.firebaseio.com",
    projectId: "food-map-1edb8",
    storageBucket: "food-map-1edb8.appspot.com",
    messagingSenderId: "335280513115"
};
firebase.initializeApp(config);
firebase.database().ref("Terms").on("value", dataChanged, firebaseError);

function dataChanged(data)
{
    let unsortedList = [];
    let obj = data.val();
    let terms = [];
    for (let key in obj)
    {
        unsortedList.push(obj[key]);
    }
    let length = unsortedList.length;
    let sortedList = unsortedList.sort(function(a, b){return b.count-a.count});
    for (let i = 0; i < length; i++)
    {
        if (typeof sortedList[i] == "object")
        {
            terms.push(`${sortedList[i].term } :  ${sortedList[i].count}`);
        }
    }	
    app.terms = terms;
}

function firebaseError(error)
{
    app.terms = ["An error occurred while retrieving data. Please try again later."];
}