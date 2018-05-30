class CartoButton {
    static attachTo(param) {
        if (param.forEach) {
            param.forEach(element => new CartoButton(element));
            return;
        }
        new CartoButton(param);
    }

    constructor(element) {
        element.addEventListener('click', event => {
            var event = new CustomEvent('carto-click', {
                detail: {
                    foo: 'foo',
                    bar: 'bar'
                }
            });
            // Dispatch event.
            element.dispatchEvent(event);
        });
    }
}