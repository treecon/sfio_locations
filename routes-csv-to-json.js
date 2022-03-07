import fs from 'fs';
import { parse } from 'csv-parse/sync';

const csvToJson = () => {
    const csv = fs.readFileSync(`./data/all_routes.csv`);

    const parsed = parse(csv).map((x) => ({
        points: [parseInt(x[0]), parseInt(x[1])],
        distance: parseInt(x[2]),
    }));

    return parsed;
}

export { csvToJson };
