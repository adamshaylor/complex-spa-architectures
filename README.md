#HATEOAS vs Isomorphism

##Introduction

Complex single page applications tend to have overlap between browser and server code. Though the data may reside in a database, the schema and much of the logic is often duplicated. As of this writing, there is no widely accepted solution to this problem. Some who tried will tell you to [give up](http://mir.aculo.us/2013/02/26/client-side-mvc-is-not-a-silver-bullet/).

This is a brief exploration of two techniques that might “re-couple” the back and front ends: Roy Fielding’s [Hypermedia As The Application of Engine State](http://en.wikipedia.org/wiki/HATEOAS) (HATEOAS) and Airbnb’s [Isomorphic JavaScript](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/).

Both demos attempt to model a t-shirt customization app and both use the same data from the JSON files in `/example-data`. I’m using Angular as the front-end framework as a matter of personal preference. Both demos could just as easily be done with another framework or even vanilla JavaScript.

![](screenshot.png?raw=true)

##Installation

###Node

The binary for Node is on [their website](http://nodejs.org). Then you’ll need to download or clone this repo into the same environment.

**Note:** You’ll need an Internet connection to start the demos.

###Browserify & Sails.js

You’ll need to install Browserify and Sails.js globally:

```shell
npm install -g browserify
npm install -g sails
```

If you’re on Mac or Linux, you may need to do this as a super user:

```shell
sudo npm install -g browserify
sudo npm install -g sails
```

###Dependencies

From the repo root, run:

```shell
cd hateoas
npm install
cd ../isomorphism
npm install
```

##Starting the isomorphism demo

From the repo root, run:

```shell
cd isomorphism
npm start
```

The demo should be running at [http://localhost:3000](http://localhost:3000).

##How the isomorphic demo works

Isomorphic JavaScript is another way of saying, “write your server in JavaScript and share your code with the browser.” The trick is structuring the logic and data you intend to share in such a way that it can be easily bundled up. In this case, I used [Browserify](http://browserify.org) to bundle a Node file and its dependencies (i.e. the data) into a self-contained browser script. The resultant client script exposes an object called `shirts` in the browser global scope. 

You can access various API endpoints such as [http://localhost:3000/categories](http://localhost:3000/categories). These routes are wired up to the same methods and data the browser uses. They could also be used to validate data passed from the browser to a REST API.

##Key isomorphism files

Shared logic:

* [isomorphism/shared-modules/shirts.js](isomorphism/shared-modules/shirts.js)

API routes:

* [isomorphism/routes/categories.js](isomorphism/routes/categories.js)
* [isomorphism/routes/shirts.js](isomorphism/routes/shirts.js)
* [isomorphism/routes/colors.js](isomorphism/routes/colors.js)

##Starting the HATEOAS demo

From the repo root, run:

```shell
cd hateoas
node app.js
```

The demo should be running at [http://localhost:1337](http://localhost:1337).

##How the HATEOAS demo works

I’ve taken liberties with the term “HATEOAS.” I’m not trying to create an API that documents its own affordances. Instead, I’m taking the term “application state” literally and modeling the user interface controls in the hypermedia. The API may imply its affordances indirectly but it does not adhere to any standard such as [JSON API](https://github.com/json-api/json-api).

The benefit of building an API this way is that the client can be ignorant of the meaning of its data and the logic behind it. When the user changes the controls, the client sends the state of those controls to the server. The server is responsible for translating the state data into models and responding to the client with a new state reflecting the consequences of the user’s change.

Take this t-shirt demo for example. Start by selecting a category, shirt and color. Now go back to the cateogory menu and pick a different category. Just like in the isomorphic demo, the shirt and color menus are updated, but with HATEOAS, the update is the server’s responsibility alone. Here's the diff between the client request and server response:

```diff
diff --git a/hateoas-request.json b/hateoas-response.json
index 1208e6c..bf73d3a 100644
--- a/hateoas-request.json
+++ b/hateoas-response.json
@@ -21,36 +21,23 @@
   },
   "shirt": {
     "type": "dropdown",
-    "value": 2,
+    "value": null,
     "prompt": "Select Shirt",
     "options": [
       {
-        "name": "Hanes Tagless",
-        "value": 1
+        "name": "LAT Women’s",
+        "value": 4
       },
       {
         "name": "Canvas Ringspun",
-        "value": 2
-      },
-      {
-        "name": "American Apparel",
-        "value": 3
+        "value": 5
       }
     ]
   },
   "color": {
     "type": "dropdown",
-    "value": 81,
+    "value": null,
     "prompt": "Select Color",
-    "options": [
-      {
-        "name": "Maroon",
-        "value": 81
-      },
-      {
-        "name": "Orange",
-        "value": 98
-      }
-    ]
+    "options": []
   }
 }
```

The client sends the change to the category and the server responds with the updated shirts and colors. It also nulls out the previous selections since they are no longer available.

The client is written in such a way that all the controls are temporarily disabled while this HTTP transaction takes place. For more complex applications, it might make more sense to model the dependency tree in the API so the client can be more selective about which controls to disable.

## Key HATEOAS files

Server controller and model:

* [hateoas/api/controllers/ShirtStateController.js](hateoas/api/controllers/ShirtStateController.js)
* [hateoas/api/models/ShirtState.js](hateoas/api/models/ShirtState.js)

Angular user interface controls and XHR

* [hateoas/views/layout.ejs](hateoas/views/layout.ejs)
* [hateoas/assets/js/angular/hateoas-ctrl.js](hateoas/assets/js/angular/hateoas-ctrl.js) (refreshingly empty controller)
* [hateoas/assets/js/angular/hateoas-ui-control.html](hateoas/assets/js/angular/hateoas-ui-control.html)
* [hateoas/assets/js/angular/hateoas-ui-control.js](hateoas/assets/js/angular/hateoas-ui-control.js)
* [hateoas/assets/js/angular/crud-ctrl.js](hateoas/assets/js/angular/crud-ctrl.js)

##Presentation slides

Open [index.html](index.html) in your browser.
