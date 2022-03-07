import fs from 'fs';
import { Graph, CoordinateLookup, buildGeoJsonPath, buildEdgeIdList } from 'geojson-dijkstra';
import config from './config.js';

// todo: important, fix _cost

const calculateRouteDistance = (lng_a, lat_a, lng_b, lat_b) => {
    let geojson = JSON.parse(fs.readFileSync(`./data/${config.roadNetworkGeoJson}`));
    
    const graph = new Graph(geojson);
    
    // create a coordinate lookup to be able to input arbitrary coordinate pairs
    // and return the nearest coordinates in the network
    const lookup = new CoordinateLookup(graph);
    const coords1 = lookup.getClosestNetworkPt(lng_a, lat_a);
    const coords2 = lookup.getClosestNetworkPt(lng_b, lat_b);
    
    // create a finder, in which you may specify your A* heuristic (optional)
    // and add extra attributes to the result object
    const finder = graph.createFinder({ parseOutputFns: [buildGeoJsonPath, buildEdgeIdList] });
    
    // the result will contain a total_cost attribute,
    // as well as additional attributes you specified when creating a finder
    const result = finder.findPath(coords1, coords2);

    return result.total_cost;
}

export { calculateRouteDistance };
