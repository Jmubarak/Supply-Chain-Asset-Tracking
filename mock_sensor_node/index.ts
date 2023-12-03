import axios from 'axios';
import * as mqtt from 'mqtt';
import readline from 'readline';

const SENSOR_NODE_REGISTRATION_URL = 'http://localhost:3000/sensornode';
const RFID_SCANNER_REGISTRATION_URL = 'http://localhost:3000/rfidscanner';
const MQTT_BROKER_URL = 'mqtt://broker.hivemq.com:1883'; // HiveMQ broker
const RFID_TAG_SCAN_URL = 'http://localhost:3000/rfidscannerrecord'; // Updated URL to send scanned tag

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function registerSensorNode() {
    try {
        const response = await axios.post(SENSOR_NODE_REGISTRATION_URL);
        return response.data.nodeID; // Assuming the server returns an object with nodeID
    } catch (error) {
        console.error('Failed to register sensor node:', error);
        throw error;
    }
}

async function registerRFIDScanner(nodeID: number): Promise<number> {
    try {
        const response = await axios.post(RFID_SCANNER_REGISTRATION_URL, { node: { nodeID } });
        const scannerID = response.data.scannerID;
        if (typeof scannerID !== 'number') {
            throw new Error(`Invalid scannerID received: ${scannerID}`);
        }
        console.log(`RFID scanner registered with ID: ${scannerID}`);
        return scannerID;
    } catch (error) {
        console.error('Failed to register RFID scanner:', error);
        throw error;
    }
}

function postEnvironmentalReadings(nodeID: number) {
    const client = mqtt.connect(MQTT_BROKER_URL);
    const topic = `sensorNode/${nodeID}/environment`;

    // Starting coordinates for London
    let latitude = 51.5074;  // Latitude for London
    let longitude = -0.1278; // Longitude for London

    client.on('connect', () => {
        setInterval(() => {
            // Simulate movement by randomly adjusting latitude and longitude
            latitude += (Math.random() - 0.5) * 0.001; // Smaller adjustment for more realistic movement
            longitude += (Math.random() - 0.5) * 0.001;

            const environmentalData = {
                temperature: parseFloat((Math.random() * 35).toFixed(2)),
                humidity: parseFloat((Math.random() * 100).toFixed(2)),
                latitude: parseFloat(latitude.toFixed(6)),
                longitude: parseFloat(longitude.toFixed(6))
            };

            client.publish(topic, JSON.stringify(environmentalData));
            console.log(`Published environmental data ${JSON.stringify(environmentalData)} to ${topic}`);
        }, 5000); // Publish every 5 seconds
    });
}



async function sendTagScan(scannerID: number) {
    while (true) {
        const tagID = await new Promise<string>((resolve) => {
            rl.question('Enter RFID tag to scan (or "exit" to quit): ', resolve);
        });

        if (tagID.toLowerCase() === 'exit') {
            break;
        }

        try {
            const requestData = {
                scanner: {
                    scannerID: scannerID
                },
                tag: {
                    tagID: parseInt(tagID) // Ensure tagID is an integer
                }
            };

            await axios.post(RFID_TAG_SCAN_URL, requestData);
            console.log(`Tag ${tagID} sent to server.`);
        } catch (error) {
            console.error('Failed to send RFID tag:', error);
        }
    }

    rl.close();
}


async function startSimulation() {
    let nodeID;
    let scannerID;

    const answer = await new Promise<string>((resolve) => {
        rl.question('Do you want to register a new sensor node and scanner? (yes/no): ', resolve);
    });

    if (answer.toLowerCase() === 'yes') {
        nodeID = await registerSensorNode();
        console.log(`Registered sensor node with ID: ${nodeID}`);
        scannerID = await registerRFIDScanner(nodeID);
    } else {
        nodeID = await new Promise<number>((resolve) => {
            rl.question('Enter the ID of the pre-registered sensor node: ', (id) => resolve(parseInt(id)));
        });

        scannerID = await new Promise<number>((resolve) => {
            rl.question('Enter the ID of the pre-registered scanner: ', (id) => resolve(parseInt(id)));
        });
    }

    // Start posting temperature readings
    postEnvironmentalReadings(nodeID);

    // Start scanning tags
    await sendTagScan(scannerID);

    rl.close(); // Close readline interface after all operations are done
}



startSimulation();
