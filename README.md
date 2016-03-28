# webranium
Text obfuscation engine.  
Demo: https://webranium.herokuapp.com/

### Install:

	npm i
	node index.js
	
### Notes:
The demo uses EJS, you can use it with any other server side rendering framework.  
But it needs to be rendered server side.  
It has some bugs, I'll fix if and when someone spots em.

### How to use?

	var Webranium = require('./webranium'); //require Webranium
	app.set('view engine', 'ejs');          //Set a view engine
	
	Webranium.init(<Express App Variable>, <ModifiedSVG>, <GeneratedTTFfromModdedSVG>, <OriginalSVG>, <GeneratedTTFfromOriginalSVG>);   //Must have 3 or 5 parameters.
	Webranium.generate(10000);  //Generate font. Pass an optional `interval` parameter to generate a random font every `N` milliseconds.
