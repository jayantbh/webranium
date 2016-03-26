/**
 * Created by jayantbhawal on 25/3/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ttf2svg = require('ttf2svg');
var svg2ttf = require('svg2ttf');
var fs = require('fs');
var ejs = require('ejs');
var Random = require('random-js');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var find = [];
var replace = [];
var charMap = {};

var getFontData = function (svg) {
	find = [];
	replace = [];
	charMap = {};

	var rgx = /unicode="([\S]+| )"/;
	var rgxg = /unicode="([\S]+| )"/g;

	var matches = svg.match(rgxg);
	var result = matches.slice(0);

	for (var i = 0; i < result.length; i++) {
		var randomIndex = Math.floor(Math.random() * (result.length - 1));
		var a = result[randomIndex];
		result[randomIndex] = result[i];
		result[i] = a;
		charMap[rgx.exec(matches[i])[1]] = rgx.exec(result[i])[1];
	}

	svg = svg.split("\n");
	for (var j = 0; j < svg.length; j++) {
		var replacement = svg[j].match(rgx);
		if(replacement){
			//console.log(svg[j])
			console.log("unicode=\"&#"+(200+j)+";\"");
			svg[j] = svg[j].replace(replacement[0],"unicode=\"&#"+(200+j)+";\"");
			charMap[replacement[1]] = "&#"+(200+j)+";";
		}

	}

    //
	//var rndCode = Random.hex(true)(Random.engines.nativeMath, 2);
	//for (var j = 0; j < replacement.length; j++) {
	//	var replacer = "unicode=\"&#x"+parseInt(parseInt(rndCode,16)+j).toString(16)+";\"";
	//	svg = svg.replace(result[j],replacer);
	//	charMap[rgxl.exec(result[j])[1]] = rgxl.exec(replacer)[1];
	//	//console.log("GFD",replacement[j], result[j]);
	//}
	console.log("GFD",charMap);
	//console.log("GFD",svg.join("\n"));
	return svg.join("\n");
};


var ttf = svg2ttf(fs.readFileSync('static/roboto_original.svg'), {});
fs.writeFileSync('webranium_original.ttf', new Buffer(ttf.buffer));

function generate() {
	fs.readFile('static/roboto.svg', function (err, buffer) {
		if (!!err) throw err;

		var ttfb = new Buffer(getFontData(buffer.toString()));
		var ttf = svg2ttf(ttfb, {});
		fs.writeFileSync('static/webranium.ttf', new Buffer(ttf.buffer));
	});
}

var webranium = {
	process: function (str) {
		str = str.split("");
		for (var i = 0; i < str.length; i++) {
			//console.log(find);
			//console.log("P> ",str[i])
			str[i] = charMap[str[i]];
			//find[i] = find[i].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			//str = str.replace(new RegExp(find[i], 'g'), replace[i]);
		}
		//console.log(str.join(""));
		return str.join("");
	}
};
generate();
setInterval(generate, 1000000);
app.get("/", function (req, res) {
	//res.sendFile(__dirname + "/index.html");
	res.render("index", {webranium: webranium});
});

app.use(express.static(__dirname));
console.log("Init!");
app.listen(process.env.PORT || "9000");
