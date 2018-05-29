const widgets = new Set();
const filters = new Map();
let originalQuery;

export function bind(carto, map, widgetElement, source, filterColumn, opts) {
    widgets.add(widgetElement);
    if (originalQuery && originalQuery !== source.getQuery()) {
        throw Error('Only widgets with the same source can be binded');
    }
    originalQuery = source.getQuery();
    if (opts.sync) {
        var dataview = new carto.dataview.Category(source, filterColumn, opts);
    } else {
        var dataview = new carto.dataview.Category(new carto.source.SQL(originalQuery), filterColumn, opts);
    }

    dataview.addFilter(new carto.filter.BoundingBoxLeaflet(map));
    dataview.on('dataChanged', data => widgetElement.setData(data.categories));

    widgetElement.addEventListener('changed', function (event) {
        const selected = event.detail.selected.map(name => `'${name}'`).join(',');
        if (!selected) {
            filters.delete(widgetElement);
        } else {
            filters.set(widgetElement, `${filterColumn} IN (${selected}) `);
        }
        let query = buildQuery(filters)
        console.warn(query);
        source.setQuery(query);
    });

    return dataview;
}

function buildQuery(filters) {
    if (!filters.size) {
        return originalQuery;
    }

    let query = `${originalQuery} WHERE `;
    return `${query} ${filters.values().join(' AND ')}`;
}