import os from 'os';
import fs from 'fs';
import { Generation } from './generation.js';
import config from './config.js';

const timest = Date.now();

console.log(`started at ${new Date().toLocaleTimeString()}`);

let demandPoints = JSON.parse(fs.readFileSync(`./data/${config.demandPointsGeoJson}`));
demandPoints = {
    ...demandPoints,
    features: demandPoints.features.filter(x => x.properties.population),
};
const gridPoints = JSON.parse(fs.readFileSync(`./data/${config.gridPointsGeoJson}`));
const parameters = {
    populationNum: config.populationNum,
    elite: config.elite,
    mutation: config.mutation,
    oddsParam: config.oddsParam,
    facilitiesNum: config.facilitiesNum,
}

const start = () => {
    nextGeneration(1, null, demandPoints, gridPoints, parameters);
}

const nextGeneration = (generationIndex, population, demandPoints, gridPoints, parameters) => {
    let generation = new Generation(population, demandPoints, gridPoints, parameters);

    console.log(`generation ${generationIndex}: ${generation.best.pMedianLength}, ${JSON.stringify(generation.best)}`);
    fs.appendFileSync(`./data/results_weighted_${timest}`, `${new Date().toLocaleTimeString()}, ${generationIndex}, ${JSON.stringify(generation.best)}${os.EOL}`);

    // if (generationIndex > config.numberOfGenerations) {
    //     console.log(generation.best);
    //     console.log('ended (wip)');
    //     console.log(`ended at ${new Date().toLocaleTimeString()}`);
    //     return;
    // }

    nextGeneration(generationIndex + 1, generation.population, demandPoints, gridPoints, parameters);
}

start();