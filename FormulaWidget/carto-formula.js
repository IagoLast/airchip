class CartoFormula extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'subtitle', 'value', 'footer'];
    }

    get template() {
        return `
            <div class="carto-formula">
                <span class="title">${this.state.title || ''}</span>
                <span class="subtitle">${this.state.subtitle || ''}</span>
                <span class="value">${this.state.value || ''}</span>
                <span class="footer">${this.state.footer || ''}</span>
            </div>
        `;
    }

    set value(newValue) {
        this.setAttribute('value', newValue);
    }

    constructor() {
        super();
        console.info('constructor', this);
        this.state = Object.freeze({});
    }

    connectedCallback() {
        console.info('connectedCallback', this);
        this.render();
    }

    attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
        console.info('attributeChangedCallback', this);
        const newState = Object.assign({}, this.state);
        newState[attributeName] = newValue;
        this.setState(newState);
    }

    setState(state) {
        this.state = state;
        this.render();
    }

    render() {
        this.innerHTML = this.template;
    }
}

customElements.define('carto-formula', CartoFormula);