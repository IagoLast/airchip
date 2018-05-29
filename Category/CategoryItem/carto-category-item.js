class CartoCategoryItem extends CartoElement {
    static get observedAttributes() {
        return ['value', 'selected', 'name', 'percent'];
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
}

customElements.define('carto-category-item', CartoCategoryItem);
