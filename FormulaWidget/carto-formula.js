class CartoFormula extends CartoElement {
    static get observedAttributes() {
        return ['title', 'subtitle', 'value', 'footer'];
    }

    set value(newValue) {
        this.setAttribute('value', newValue);
    }

    render() {
        return this._render`
            <div class="carto-formula">
                <span class="title">${this.state.title || ''}</span>
                <span class="subtitle">${this.state.subtitle || ''}</span>
                <span class="value">${this.state.value || ''}</span>
                <span class="footer">${this.state.footer || ''}</span>
            </div>
        `;
    }
}

customElements.define('carto-formula', CartoFormula);
