// EXPRESS
// =============================================================================
var express = require('express'),
    app = express(),
    request = require('request'),
    bodyParser = require('body-parser'),
    apiai = require('apiai'),
    PORT = process.env.PORT || 8980;


var token = "d08bfab4d8ee462bbdc0b7581648f3e4";

var apiapp = apiai(token);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// DEFINE ROUTES
// =============================================================================
app.get('/', function (req, res) {
    res.send("Profile API's root endpoint!");
});



//FACEBOOK WEBHOOK
//==============================================================================
app.post('/myprofilers/', function (req, res,next) {
    console.log("reached");
    var items = !!req.body && (req.body instanceof Array) ? req.body : [req.body];
    console.log(items);
    items.forEach(function (item) {
        console.log(item);
        if (item && item.hasOwnProperty('text') && typeof item.text === 'string') {
              console.log(item.text);
            var apirequest = apiapp.textRequest(item.text, { sessionId: "nj-cg" });
            var textResponse = '';

            apirequest.on('response', function (response) {
                console.log(response.result.fulfillment.speech);
                textResponse = response.result.fulfillment.speech;
                res.status(200).json(textResponse);
            });

            apirequest.on('error', function (error) {
                console.log(error);
            });

            apirequest.end();
        }
    });


});


// START THE SERVER
// =============================================================================
app.listen(PORT);
console.log('Server running on port ' + PORT);