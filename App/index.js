const carto = require('@carto/carto.js');
const L = require('leaflet');
require('@airship/formula-widget');
require('@airship/donut-widget');
require('@airship/category-widget');
require('@airship/category-widget-item');

const widgetElement = document.querySelector('carto-category');


// Prepare leaflet layer
const map = L.map('map').setView([30, 0], 3);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png').addTo(map);

// Prepare CARTO data
const originalQuery = `SELECT * FROM ne_10m_populated_places_simple`;
const client = new carto.Client({ apiKey: 'YOUR_API_KEY', username: 'cartojs-test' });
const source = new carto.source.SQL(originalQuery);
const style = new carto.style.CartoCSS(`#layer {marker-fill: red}`);
const layer = new carto.layer.Layer(source, style);


// Formula
const categoryDataView = new carto.dataview.Category(source, 'adm0name', {
    limit: 10,
    operation: carto.operation.COUNT,
    operationColumn: 'cartodb_id'
});
categoryDataView.on('dataChanged', _updateWidgets);
categoryDataView.addFilter(new carto.filter.BoundingBoxLeaflet(map));
/**
 * Update formula widgets
 */
function _updateWidgets(data) {
    widgetElement.setData(data.categories);
}

// Add dataviews and layer
client.addDataview(categoryDataView);
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

widgetElement.addEventListener('changed', function (event) {
    const selectedCountries = event.detail.selected.map(name => `'${name}'`).join(',');
    source.setQuery(`${originalQuery} WHERE adm0name IN (${selectedCountries})`);
})
