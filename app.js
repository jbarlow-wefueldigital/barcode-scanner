import * as dotenv from 'dotenv';
import { emitKeypressEvents } from 'readline';
import fetch from 'node-fetch';
import log4js from 'log4js';


// get env file location
const myArgs = process.argv.slice(2);
dotenv.config({ path: `${myArgs[0]}.env` });


// get the station id from the env file
const station_id = process.env.STATION_ID;

// get date
const current_date = new Date();
const year = current_date.getFullYear();
const month = current_date.getMonth();
const day = current_date.getDate();


// setup logging
log4js.configure({
    appenders: { scanner: { type: "file", filename: `${myArgs[0]}${year}-${month}-${day}-${station_id}-scanner.log` } },
    categories: { default: { appenders: ["scanner"], level: "info" } },
});
const logger = log4js.getLogger('scanner');


// setup the user input interface
emitKeypressEvents(process.stdin);


// make sure the input is available character-by-character
if (process.stdin.isTTY) process.stdin.setRawMode(true);


// log barcode app starting
logger.info('barcode scanner app has started for station:', station_id);


// setup some globals
const allowedKeys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "/", "?", ":", "@", "&", "=", "+", "$", "-", "_", ".", "!", "~", "*", "'", "(", ")", "#"];
var keys = [];
var timeout = null;


// start keypress listener
process.stdin.on("keypress", (str, key) => {
    // need this so we can kill the app
    if (key.name === 'c' && key.ctrl) process.exit();

    // check for the end of the qr code and out it all together
    if (key.name === "return" && keys.length > 3) {
        let qrCodeURL = '';
        qrCodeURL = keys.join('');
        qrCodeURL += `&stationid=${station_id}`;

        logger.info(`station ${station_id} called ${qrCodeURL}`);

        fetch(qrCodeURL)
            .then((response) => response.json())
            .then(() => {
                logger.info(`station ${station_id} call to ${qrCodeURL} succeeded`);
            })
            .catch((error) => {
                logger.error(error);
            });

        // reset the keys array when fetch is complete
        return false;
    }

    // listen only for allowed keys and add them to the keys array
    if (allowedKeys.includes(key.name) || allowedKeys.includes(key.sequence)) {
        keys.push(key.name || key.sequence);

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(function () {
            clearTimeout(timeout);
            timeout = null;
            keys = [];
        }, 75);
    }
});
