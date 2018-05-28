const carto = require('@carto/carto.js');
const L = require('leaflet');
require('@airship/formula-widget');
require('@airship/donut-widget');


// Prepare leaflet layer
const map = L.map('map').setView([30, 0], 3);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png').addTo(map);

// Prepare CARTO data
const client = new carto.Client({ apiKey: 'YOUR_API_KEY', username: 'cartojs-test' });
const source = new carto.source.Dataset(`ne_10m_populated_places_simple`);
const style = new carto.style.CartoCSS(`#layer {marker-fill: red}`);
const layer = new carto.layer.Layer(source, style);


// Formula
const formulaDataview = new carto.dataview.Formula(source, 'pop_max', {
    operation: carto.operation.COUNT
});
formulaDataview.on('dataChanged', _updateWidgets);
formulaDataview.addFilter(new carto.filter.BoundingBoxLeaflet(map));
/**
 * Update formula widgets
 */
function _updateWidgets(data) {
    document.querySelectorAll('carto-formula').forEach(element => {
        element.value = data.result
    });
}

// Donut
var histogram = new carto.dataview.Histogram(source, 'cartodb_id', { bins: 2 });
// Add a bounding box filter, so the data will change when the map is moved.
histogram.addFilter(new carto.filter.BoundingBoxLeaflet(map));
// Set up a callback to render the histogram data every time new data is obtained.
histogram.on('dataChanged', histogramData => {
    console.log(histogramData.bins);
    document.querySelector('carto-donut').setData([
        { name: "Less populated", value: histogramData.bins[0].freq },
        { name: "Higher pop", value: histogramData.bins[1].freq },
    ]);
});



// Add dataviews and layer
client.addDataview(histogram);
client.addDataview(formulaDataview);
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

