const http = require('http');
const express = require('express');
const app = express();

//--------------------------------------------------------------


var mqtt_module = require('./mqtt_module.js');

//--------------------------------------------------------------


app.post('/publish', (req, res) => {
    
    var message = {auther: 'Laxman'};
    var topicName = "testTopic";
    var qos = 1;
    
    mqtt_module.publish(topicName, JSON.stringify(message), {qos: qos}, function (mqttErr, mqttRes) {
        var data = {};
        if (mqttErr)
            data = {err: 1, message: mqttErr.message};
        else
            data = {err: 0, data: mqttRes};

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(data);
    });
    
});

//--------------------------------------------------------------

mqtt_module.subscribe('provider/#', {qos: 1}, function (err, res) {
    if (err)
        console.log('subscribe failed')
    if (res)
        console.log('subscribed to provider', res)
});

mqtt_module.subscribe('laxman/test', {qos: 1}, function (err, res) {
    if (err)
        console.log('subscribe failed laxman/test')
    if (res)
        console.log('subscribed to laxman/test')
});

//--------------------------------------------------------------


http.createServer(app).listen(1234, () => {
    console.log('server listening on port 1234');
});
