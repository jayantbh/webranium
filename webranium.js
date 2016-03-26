/**
 * Created by jayantbhawal on 27/3/16.
 */
var fs = require('fs');
var svg2ttf = require('svg2ttf');

var modifiedSVG,
	modifiedTTF,
	untouchedSVG,
	untouchedTTF;

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
	var initrnd = 200 + Math.floor(Math.random() * 100);
	for (var j = 0; j < svg.length; j++) {
		var replacement = svg[j].match(rgx);
		if (replacement) {
			//console.log(svg[j])
			//console.log("unicode=\"&#"+(300+j)+";\"");
			svg[j] = svg[j].replace(replacement[0], "unicode=\"&#" + (initrnd + j) + ";\"");
			charMap[replacement[1]] = "&#" + (initrnd + j) + ";";
		}

	}
	return svg.join("\n");
};

function generate(interval) {
	fs.readFile(modifiedSVG, function (err, buffer) {
		if (!!err) throw err;

		var ttfb = getFontData(buffer.toString());
		var ttf = svg2ttf(ttfb, {});
		fs.writeFileSync(modifiedTTF, new Buffer(ttf.buffer));
	});
	if (interval) {
		setTimeout(generate, 10000);
	}
}

function process(str) {
	str = str.split("");
	for (var i = 0; i < str.length; i++) {
		str[i] = charMap[str[i]];
	}
	return str.join("");
}

function init(app, modSVG, modTTF, originalSVG, originalTTF) {
	if (!(arguments.length == 3 || arguments.length == 5) || !app.use) {
		throw new Error("Webranium.init(...) must be passed 2 or 4 arguments in the order as (app,modSVG,modTTF,originalSVG,originalTTF)," +
			" where the app parameter is the express server object, modSVG is the SVG font file containing only the " +
			"alphanumeric and special characters on the keyboard, and the originalSVG is the untouched SVG file so that " +
			"both of them may be included in the view.");
	}
	else if(!svg2ttf){
		throw new Error("Missing dependency `svg2ttf`. To install, use `npm i -S svg2ttf`.");
	}
	else {
		if (arguments.length >= 3) {
			modifiedSVG = modSVG;
			modifiedTTF = modTTF;

			app.use("/static_wbr/webranium.ttf", function (req, res, next) {
				res.header("Cache-Control", "no-cache, no-store, must-revalidate");
				res.header("Pragma", "no-cache");
				res.header("Expires", 0);
				next();
			});
		}
		if (arguments.length == 5) {
			untouchedSVG = originalSVG;
			untouchedTTF = originalTTF;

			var ttf = svg2ttf(fs.readFileSync(untouchedSVG).toString(), {});
			fs.writeFileSync(untouchedTTF, new Buffer(ttf.buffer));
		}
	}
}

module.exports = {
	init: init,
	process: process,
	generate: generate
};
