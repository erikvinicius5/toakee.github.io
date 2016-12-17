// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function() {
  'use strict';

  var app = {// key information necessary for the app.
    isLoading: true,
    //visibleCards: {},
    //selectedCities: [],
    spinner: document.querySelector('.loader'),
    coordinates: document.querySelector('.coordinates'),
    container: document.querySelector('.page-content'),
    modalLink: document.querySelector('.modal')
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butRefresh').addEventListener('click', function() {
    console.log('butRefresh clicked');
    window.location.reload();
  });

  document.getElementById('butLink').addEventListener('click', function() {
    console.log('butLink clicked');
    app.modalLink.style.display = "block";
  });

  document.querySelector('.close').addEventListener('click', function() {
    console.log('close-modal clicked');
    app.modalLink.style.display = "none";
  });

  // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == app.modalLink) {
        app.modalLink.style.display = "none";
    }
}

/*
  document.getElementById('butAddCity').addEventListener('click', function() {
    // Add the newly selected city
    var select = document.getElementById('selectCityToAdd');
    var selected = select.options[select.selectedIndex];
    var key = selected.value;
    var label = selected.textContent;
    if (!app.selectedCities) {
      app.selectedCities = [];
    }
    app.getForecast(key, label);
    app.selectedCities.push({key: key, label: label});
    app.saveSelectedCities();
    app.toggleAddDialog(false);
  });


  document.getElementById('butAddCancel').addEventListener('click', function() {
    // Close the add new city dialog
    app.toggleAddDialog(false);
  });
  */


  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateCoordinateLabels = function(data) {
    
    var userId = data.userId;
    var id = data.id;
    var title = data.title
    var body = data.body;

    //app.coordinates.textContent = ""+ title + " , " + body;

    console.log(data);

    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };

  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
    first checks if the  data is in the cache. If so,
   * then it gets that data and populates the variable with the cached data.
   * Then, getForecast() goes to the network for fresh data. If the network
   * request goes through, then the data gets updated a second time with the
   * freshest data.
   */
  app.getCoordinates = function(key, label) {//Will get coordinates or friends, IDK yet
    var statement = '' + key;
    var url = 'https://jsonplaceholder.typicode.com/posts/1';// + statement;
    // TODO add cache logic here

    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          //var results = response.query.results;
          //results.key = key;
          //results.label = label;
          //results.created = response.query.created;
          console.log(response);
          app.updateCoordinateLabels(response);
        }
      } else {
        // Return the initial(cache) data since no data is available.
        app.updateCoordinateLabels(initialFetchedData);
      }
    };
    request.open('GET', url);
    request.send();
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateCoordinates = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getCoordinates(key);
    });
  };

  // TODO add saveSelectedFriends function here
  // Save list of freinds (or events) to localStorage.
  app.saveSelectedFriends = function() {
    var selectedFriends = JSON.stringify(app.selectedFriends);
    localStorage.selectedFriends = selectedFriends;
  };

  /*
   * Fake weather data that is presented when the user first uses the app,
   * or when the user has not saved any cities. See startup code for more
   * discussion.
   */
  var initialFetchedData = {
    userId: 2,
    id: 2,
    title: 'Fake created',
    body: ' quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderi created',
  };

  // TODO uncomment line below to test app with fake data
  //app.updateCoordinateLabels(initialFetchedData);

  // TODO add startup code here

  /************************************************************************
   *
   * Code required to start the app
   *
   * NOTE: To simplify this codelab, we've used localStorage.
   *   localStorage is a synchronous API and has serious performance
   *   implications. It should not be used in production applications!
   *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
   *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
   ************************************************************************/

   //initiate friends list

  app.selectedFriends = localStorage.selectedFriends;
  if (app.selectedFriends) {
    app.selectedFriends = JSON.parse(app.selectedFriends);
    app.selectedFriends.forEach(function(city) {
      app.getCoordinates(city.key, city.label);
    });
  } else {
    /* The user is using the app for the first time, or the user has not
     * saved any cities, so show the user some fake data. A real app in this
     * scenario could guess the user's location via IP lookup and then inject
     * that data into the page.
     */
    app.updateCoordinateLabels(initialFetchedData);
    app.selectedFriends = [
      {title: initialFetchedData.title, body: initialFetchedData.body}
    ];
    app.saveSelectedFriends();
  }

  /*
  The startup code checks if there are any cities saved in local storage. If so,
   then it parses the local storage data and then displays a forecast card for 
   each of the saved cities. Else, the startup code just uses the fake forecast
    data and saves that as the default city.
  */

  // TODO add service worker code here
})();
