class CartoCategoryMultiple extends CartoElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'data', 'ignore'];
  }

  constructor() {
    super();

    this.className = 'Air-CategoryMultiple';

    this.state = Object.freeze({
      selected: [],
    });
  }

  setState(state) {
    this.state = Object.freeze({ ...this.state, ...state });
    this.render();
  }

  setData(newValue) {
    this.setState({ data: newValue });
  }

  _renderItem(item) {
    return hyperHTML.wire() `
      <carto-category-item
        value=${item.value}
        name=${item.name}
        selected=${item.selected}
        percent=${item.percent}
        onclick=${this.childClicked}
      ></carto-category-item>
    `;
  }

  render() {
    if (!this.state.data) return 'No categories';

    const max = this.state.data.reduce((max, item) => {
      if (item.value > max) return item.value;
      return max;
    }, 0);

    const items = this.state.data
      .sort((a, b) => b.value - a.value)
      .map(item => ({
        name: item.name,
        value: item.value,
        selected: this.state.selected.length === 0 || this.state.selected.includes(item.name),
        percent: (item.value / max) * 100
      }))
      .filter(item => this.state.ignore !== item.name);

    return this._render`
        <div class="CA-Title">${this.state.title}</div>
        <div class="CA-Subtitle">${this.state.subtitle}</div>
        ${items.map(item => this._renderItem(item))}
        ${this.state.selected.length
        ? hyperHTML.wire() `
        <div class="btn-area">
            <button onclick=${this.applyFiltersClick.bind(this)} class="btn-clear"> APPLY </button>
            <button onclick=${this.clearFiltersClick.bind(this)} class="btn-clear"> CLEAR </button>
        </div>`: ''
      }`;
  }

  childClicked(event) {
    // parentElement refers to CategoryElement
    const newSelected = this.parentElement.state.selected.includes(this.state.name)
      ? this.parentElement.state.selected.filter(name => name !== this.state.name)
      : [...this.parentElement.state.selected, this.state.name]
    this.parentElement.setState({ ...this.parentElement.state, selected: newSelected });
  }

  applyFiltersClick() {
    const event = new CustomEvent('changed', { detail: this.state });
    this.dispatchEvent(event);
  }

  clearFiltersClick() {
    this.setState({ selected: [] });
    const event = new CustomEvent('changed', { detail: this.state });
    this.dispatchEvent(event);
  }
}

customElements.define('carto-category-multiple', CartoCategoryMultiple);
