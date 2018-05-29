class CartoCategoryItem extends HTMLElement {
    static get observedAttributes() {
        return ['value', 'selected', 'name', 'percent'];
    }

    constructor() {
        super();
        this.state = Object.freeze({});
        this._render = hyperHTML.bind(this);
    }

    render() {
        const className = `CategoryItem--progress ${this.state.selected === 'true' ? 'active' : ''}`;

        this._render`
            <p class="CategoryItem--name">${this.state.name || ''}</p>
            <span class="CategoryItem--value">${this.state.value || ''}</span>
            <div class="CategoryItem--progressBar">
                <span class=${className} style="${{ width: `${this.state.percent}%` }}"></span>
            </div>
        `;
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
        this.setState({ [attributeName]: newValue });
    }

    setState(state) {
        this.state = { ...this.state, ...state};
        this.render();
    }

}

customElements.define('carto-category-item', CartoCategoryItem);
