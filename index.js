/**
 * Created by jayantbhawal on 25/3/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ttf2svg = require('ttf2svg');
var svg2ttf = require('svg2ttf');
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var find = [];
var replace = [];

var getFontData = function (svg) {
	find = [];
	replace = [];
	var rgx = /unicode="([&#xA-Z0-9;]+)"/ig;

	var result = svg.match(rgx);

	var replacement = result.slice(0);
	for(var i = 0; i < result.length; i++){
		var randomIndex = Math.floor(Math.random()*(result.length-1));
		var a = result[randomIndex];
		result[randomIndex] = result[i];
		result[i] = a;
	}

	for(var i = 0; i < result.length; i++){
		svg = svg.replace(result[i],replacement[i]);
		find.push(rgx.exec(result[i]));
		find.push(rgx.exec(replacement[i]));
		//console.log("GFD",replacement[i],result[i]);
	}
	//console.log("GFD",svg);
	return svg;
};


//var ttf = svg2ttf(fs.readFileSync('static/roboto.svg'), {});
//fs.writeFileSync('roboto.ttf', new Buffer(ttf.buffer));

function generate(){
	fs.readFile('static/roboto.svg', function (err, buffer) {
		if (!!err) throw err;

		var ttf = svg2ttf(new Buffer(getFontData(buffer.toString())),{});
		fs.writeFile('static/roboto.ttf', new Buffer(ttf.buffer), function (err) {
			if(err) return err;
		});
	});
}
setInterval(generate,10000);
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname));
console.log("Init!");
app.listen(process.env.PORT || "9000");
