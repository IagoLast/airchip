class CartoCategoryItem extends CartoElement {
    static get observedAttributes() {
        return ['value', 'selected', 'name', 'percent'];
    }

    constructor() {
      super();

      this.className = 'Air-CategoryItem';
    }

    render() {
        const className = `Air-CategoryItem--Progress ${this.state.selected === 'true' ? 'active' : ''}`;

        this._render`
            <p class="Air-CategoryItem--name">${this.state.name || ''}</p>
            <span class="Air-CategoryItem--value">${this.state.value || ''}</span>
            <div class="Air-CategoryItem--ProgressBar">
                <span class=${className} style="${{ width: `${this.state.percent}%` }}"></span>
            </div>
        `;
    }
}

customElements.define('carto-category-item', CartoCategoryItem);
