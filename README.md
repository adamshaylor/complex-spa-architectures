#HATEOAS vs Isomorphism

##Introduction

Complex single page applications tend to have overlap between browser and server code. Though the data may reside in a database, its schema and much of the logic is often duplicated. As of this writing, there is no widely accepted solution to this problem. Some who tried [suggest you run in the opposite direction](http://mir.aculo.us/2013/02/26/client-side-mvc-is-not-a-silver-bullet/).

This is a brief exploration of two techniques that might “re-couple” the back and front ends: Roy Fielding’s [Hypermedia As The Application of Engine State](http://en.wikipedia.org/wiki/HATEOAS) (HATEOAS) and Airbnb’s [Isomorphic JavaScript](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/).

Both demos attempt to model a t-shirt customization app and both use the same data from the JSON files in `/example-data`. I’m using Angular as the front-end framework as a matter of personal preference. Both demos could just as easily be done with another framework or even vanilla JavaScript.

![](screenshot.png?raw=true)

**Note**: I’ve taken liberties with the term “HATEOAS.” I’m not trying to create an API that documents its own affordances. That may be relevant to public APIs but it isn’t germane to many apps whose APIs are unlikely to ever be used publicly. Instead, I’m taking the term “application state” literally and modeling the user interface controls in the hypermedia. This demo of HATEOAS may indirectly define its affordances in the context of single page applications, but it does not adhere to any standard (e.g. [JSON API](https://github.com/json-api/json-api)).

##Installation

Install [Node](http://nodejs.org) and download this repo. You’ll also need an Internet connection to start the demos since the browser libraries are being served by CDNs.

That’s it.

I didn’t bother stripping out the `node_modules` directories. That saves you from running `npm install` and me from writing a `.gitignore`.


##Starting the isomorphism demo

From the repo root, run:

```shell
cd isomorphism
npm start
```

The demo should be running at [http://localhost:3000](http://localhost:3000).

##How the isomorphic demo works

Isomorphic JavaScript is another way of saying, “write your server in JavaScript and share your code with the browser.” The trick is structuring the logic and data you intend to share in such a way that it can be easily bundled up. In this case, I used [Browserify](http://browserify.org) to bundle `/isomorphism/shared-modules/shirts.js` and its dependencies (i.e. the data) into `/isomorphism/public/javascripts/shirts-module.js`. The resultant client script exposes an object called `shirts` in the browser global scope. 

You can access various API endpoints such as [http://localhost:3000/categories](http://localhost:3000/categories). These routes are wired up to the same methods and data the browser uses. They could also be used to validate data passed from the browser to a REST API.

##Starting the HATEOAS demo

From the repo root, run:

```shell
cd hateoas
node app.js
```

The demo should be running at [http://localhost:1337](http://localhost:1337).

##How the HATEOAS demo works

Instead of modeling data, the API models the user interface controls. The client is dumb about the meaning of those controls and the logic behind them. When the user changes them, the client sends them to the server. Assuming the server uses an MVC architecture, the controllers are responsible for translating the controls into models and responding to the client with new controls reflecting the consequences of the user’s change.

In the t-shirt example, say the user selects a category, shirt and color. Then they change their mind and pick a different category. The shirt and color drop-downs need to be updated, but with HATEOAS, that is the server’s responsibility alone.

Here's a diff between the request and response for this example. The client sends the change to the category and the server responds with the updated shirts and colors. It also nulls out the previous selections since they are no longer available:

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

The client is written in such a way that all the controls are temporarily disabled while this HTTP transaction takes place. For more complex applications, it might make more sense to model the dependency tree in the JSON so the client can be more selective about which controls to disable.

##Conclusions

&nbsp; | HATEOAS | Isomorphism
-----: | ------- | -----------
**API** | Stateful (which is neither by definition REST nor HATEOAS). Potential state conflicts and concurrency problems. Would web sockets be a better medium? | Stateless. No longer burdened with representing logic, just storing and validating data.
**Network & front-end performance** | Fast initial load but heavy on subsequent XHRs. The UI dies on the first network timeout. | Slow initial load but very little network chatter.
**Complexity** | ...is in defining how to model the controls and maintaining that definition over multiple projects. Use basic HTML instead of JSON? | ...is in figuring how how to modularize the shared logic and data.
**Flexibility** | Any front-end framework, any back-end capable of transforming data into controls and back. | Flexible on the front-end. Married to Node on the back.
**Modularity / re-use** | Once the contract is defined, UI widgets can be re-used as Angular directives or web components across projects. | Every isomorphic module is custom. Mark-up would presumably be copy/pasted from CSS framework documentation as usual.

At some point I may try modeling user controls over web sockets, at which point I may drop the term “HATEOAS” entirely.
