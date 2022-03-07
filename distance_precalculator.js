// assumes that demandPoints are the same as gridPoints

import os from 'os';
import fs from 'fs';
import { calculateRouteDistance } from './routing.js';

const printProgress = (progressMessage) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progressMessage);
}

const pointsFile = './data/settlements.geojson';

const points = JSON.parse(fs.readFileSync(pointsFile));

console.log('started');

// compute number of routes
let totalNum = 0;
for (let i = 0; i < points.features.length - 1; i++) {
    for (let j = i + 1; j < points.features.length; j++) {
        totalNum++;
    }
}

let currentRecord = 0;
for (let i = 0; i < points.features.length - 1; i++) {
    for (let j = i + 1; j < points.features.length; j++) {
        const point_a = {
            id: points.features[i].properties.Id,
            lat: points.features[i].geometry.coordinates[1],
            lng: points.features[i].geometry.coordinates[0],
        };
        const point_b = {
            id: points.features[j].properties.Id,
            lat: points.features[j].geometry.coordinates[1],
            lng: points.features[j].geometry.coordinates[0],
        };

        const d = calculateRouteDistance(point_a.lng, point_a.lat, point_b.lng, point_b.lat);

        const record = `${point_a.id},${point_b.id},${d}${os.EOL}`;
    
        currentRecord++;
        printProgress(`${currentRecord}/${totalNum}`);
        fs.appendFileSync('./data/all_routes.csv', record);
    }
}

console.log('finished');
