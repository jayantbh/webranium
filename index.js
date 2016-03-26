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
	var initrnd = 200 + Math.floor(Math.random()*100);
	for (var j = 0; j < svg.length; j++) {
		var replacement = svg[j].match(rgx);
		if(replacement){
			//console.log(svg[j])
			//console.log("unicode=\"&#"+(300+j)+";\"");
			svg[j] = svg[j].replace(replacement[0],"unicode=\"&#"+(initrnd+j)+";\"");
			charMap[replacement[1]] = "&#"+(initrnd+j)+";";
		}

	}
	return svg.join("\n");
};


var ttf = svg2ttf(fs.readFileSync('static_wbr/roboto_original.svg'), {});
fs.writeFileSync('static_wbr/webranium_original.ttf', new Buffer(ttf.buffer));

function generate() {
	fs.readFile('static_wbr/roboto.svg', function (err, buffer) {
		if (!!err) throw err;

		var ttfb = new Buffer(getFontData(buffer.toString()));
		var ttf = svg2ttf(ttfb, {});
		fs.writeFileSync('static_wbr/webranium.ttf', new Buffer(ttf.buffer));
	});
}

var webranium = {
	process: function (str) {
		str = str.split("");
		for (var i = 0; i < str.length; i++) {
			str[i] = charMap[str[i]];
		}
		return str.join("");
	}
};
generate();
setInterval(generate, 10000);
app.get("/", function (req, res) {
	//res.sendFile(__dirname + "/index.html");
	res.render("index", {webranium: webranium});
});

app.use("/static_wbr/webranium.ttf", function (req, res, next) {
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	next();
});

app.use(express.static(__dirname));
console.log("Init!");
app.listen(process.env.PORT || "9000");
