class CartoCategoryItem extends HTMLElement {
    static get observedAttributes() {
        return ['value', 'selected', 'name', 'percent'];
    }

    constructor() {
        super();
        console.info('constructor', this);
        this.state = Object.freeze({});
        this._render = hyperHTML.bind(this);
    }

    render() {
        this._render`
            <span>${this.state.name || ''}</span>
            <span>${this.state.value || ''}</span>
            <div class="carto-category-bar" style="width:100%;"></div>
        `;
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

}

customElements.define('carto-category-item', CartoCategoryItem);
