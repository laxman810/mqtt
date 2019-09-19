
var config = require('./config.json');

const mqtt = require('mqtt');

/**
 * options:
 *  - clientId
 *  - username
 *  - password
 *  - keepalive: number
 *  - clean:
 *  - will: 
 */

const client = mqtt.connect({
    host: config.mqtt_host,
    port: config.mqtt_port,
    username: config.mqtt_username,
    password: config.mqtt_password
});
console.log('MQTT Connected')

/**
 * options: object
 *  - qos (integer): 0 > fire and forget
 *          1 > guaranteed delivery
 *          2 > guaranteed delivery with awk
 */
function mqtt_publish(topic, message, options, callback) {
    try {
        client.publish(topic, message, {qos: (options.qos) ? options.qos : 0})
    } catch (exec) {
        callback({err: 1, message: exec.message})
    }
    callback(null, {err: 0, message: 'Published.'})
}


/**
 * topic : string
 * options: object
 *  - qos : 0 > fire and forget
 *          1 > guaranteed delivery
 *          2 > guaranteed delivery with awk
 */
function mqtt_subscribe(topic, options, callback) {
    try {
        client.subscribe(topic, {qos: (options.qos) ? options.qos : 0});
    } catch (exec) {
        callback({err: 1, message: exec.message})
    }
    callback(null, {err: 0, message: 'Subscribed.'})
}

client.on('message', (topic, message) => {
    /**
     * match the pattern (start with) 
     */
    console.log(message);
    switch (topic) {
        case 'customer/channel':
            console.log('got data for customer');
            break;
        case String(topic.match(/^provider.*/)):
            console.log("this pattern match");
            break;
        default:
            console.log("default case");
            break
    }
});

exports.publish = mqtt_publish
exports.subscribe = mqtt_subscribe