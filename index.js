const L = require('leaflet');
const carto = require('@carto/carto.js');
const ravel = require('@carto/ravel');

require('./components/Donut');
require('./components/Category');
require('./components/CategoryItem');
require('./components/CategoryMultiple');
require('./components/FormulaWidget');
require('./components/CartoElement');

const widgetElement0 = document.querySelector('#widget-0');
const widgetElement1 = document.querySelector('#widget-1');

const map = L.map('map').setView([30, 0], 3);
const originalQuery = `SELECT * FROM ne_10m_populated_places_simple`;
const client = new carto.Client({ apiKey: 'YOUR_API_KEY', username: 'cartojs-test' });
const source = new carto.source.SQL(originalQuery);
const style = new carto.style.CartoCSS(`#layer {marker-fill: red}`);
const layer = new carto.layer.Layer(source, style);

const categoryDataview1 = ravel.bind(carto, map, widgetElement0, source, 'adm0name', {
    limit: 10,
    operation: carto.operation.COUNT,
    operationColumn: 'cartodb_id',
    sync: false,
});

const categoryDataview2 = ravel.bind(carto, map, widgetElement1, source, 'name', {
    limit: 10,
    operation: carto.operation.COUNT,
    operationColumn: 'adm0name',
    sync: false,
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png').addTo(map);
client.addDataview(categoryDataview1);
client.addDataview(categoryDataview2);
client.addLayer(layer);
client.getLeafletLayer().addTo(map);
