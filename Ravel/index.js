export function bind(carto, map, widgetElement, source, filterColumn, opts) {
    const originalQuery = source.getQuery();
    const dataview = new carto.dataview.Category(new carto.source.SQL(originalQuery), filterColumn, opts);

    dataview.addFilter(new carto.filter.BoundingBoxLeaflet(map));
    dataview.on('dataChanged', data => widgetElement.setData(data.categories));
    widgetElement.addEventListener('changed', function (event) {
        const selectedCountries = event.detail.selected.map(name => `'${name}'`).join(',');
        source.setQuery(`${originalQuery} WHERE ${filterColumn} IN (${selectedCountries})`);
    });

    return dataview;
}