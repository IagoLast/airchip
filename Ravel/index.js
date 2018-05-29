export function bind(dataview, widgetElement, filterColumn) {
    const source = dataview._source;
    const originalQuery = source.getQuery();
    dataview.on('dataChanged', data => widgetElement.setData(data.categories));

    widgetElement.addEventListener('changed', function (event) {
        const selectedCountries = event.detail.selected.map(name => `'${name}'`).join(',');
        source.setQuery(`${originalQuery} WHERE ${filterColumn} IN (${selectedCountries})`);
    });
}