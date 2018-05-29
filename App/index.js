const carto = require('@carto/carto.js');
const L = require('leaflet');
require('@airship/formula-widget');
require('@airship/donut-widget');
require('@airship/category-widget');
require('@airship/category-widget-item');
require('@airship/category-multiple-widget');


const ravel = require('@carto/ravel');

const widgetElement0 = document.querySelector('#widget-0');
const widgetElement1 = document.querySelector('#widget-1');



// Prepare leaflet layer
const map = L.map('map').setView([30, 0], 3);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png').addTo(map);

// Prepare CARTO data
const originalQuery = `SELECT * FROM ne_10m_populated_places_simple`;
const client = new carto.Client({ apiKey: 'YOUR_API_KEY', username: 'cartojs-test' });
const source = new carto.source.SQL(originalQuery);
const style = new carto.style.CartoCSS(`#layer {marker-fill: red}`);
const layer = new carto.layer.Layer(source, style);


// Widget 1
const categoryDataview1 = ravel.bind(carto, map, widgetElement0, source, 'adm0name', {
    limit: 10,
    operation: carto.operation.COUNT,
    operationColumn: 'cartodb_id',
    sync: false,
});
client.addDataview(categoryDataview1);

// Widget 2
const categoryDataview2 = ravel.bind(carto, map, widgetElement1, source, 'name', {
    limit: 10,
    operation: carto.operation.COUNT,
    operationColumn: 'adm0name',
    sync: false,
});
client.addDataview(categoryDataview2);


client.addLayer(layer);
client.getLeafletLayer().addTo(map);