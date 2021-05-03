/**
 * Created by jayantbhawal on 25/3/16.
 */
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var ejs = require("ejs");
var Webranium = require("./webranium");

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const interval = process.env.INTERVAL || 10000;
const port = process.env.PORT || "9000";

Webranium.init(
	app,
	"static_wbr/roboto.svg",
	"static_wbr/webranium.ttf",
	"static_wbr/roboto_original.svg",
	"static_wbr/webranium_original.ttf"
);
Webranium.generate(interval);

app.get("/", function (req, res) {
	res.render("index", {
		webranium: Webranium,
		interval: parseFloat((interval / 6e4).toPrecision(3)),
	});
});

app.use(express.static(__dirname));

app.listen(port, () => {
	console.log("Webranium running on http://localhost:" + port);
});
