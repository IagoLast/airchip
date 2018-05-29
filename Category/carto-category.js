class CartoCategory extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'data'];
  }

  constructor() {
    super();
    console.info('constructor', this);
    this.state = Object.freeze({});
    this._render = hyperHTML.bind(this);
  }

  setData(newValue) {
    console.log(newValue);
    this.state.data = [].concat(newValue);
    this.render();
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
    const event = new CustomEvent('changed', { detail: this.state });
    this.dispatchEvent(event);
  }

  childClicked(e) {
    this.setState({
      ...this.state,
      selected: (this.state.selected === 'true') ? 'false' : 'true'
    });
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
        selected: item.selected || false,
        percent: (item.value / max) * 100
      }));

    return this._render`
        <div class="carto-title">${this.state.title}</div>
        <div class="carto-subtitle">${this.state.subtitle}</div>
        ${items.map(item => hyperHTML.wire()`<carto-category-item value=${item.value} name=${item.name} selected=${item.selected} percent=${item.percent} onclick=${this.childClicked}></carto-category-item>`)}
      `;
  }

  _listenToChildEvents() {
    this.querySelectorAll('.carto-category-item').forEach(element => {
      element.addEventListener('click', () => {
        const newState = Object.assign({}, this.state);
        newState.data = newState.data.filter(e => e.name !== element.attributes.name.value);
        newState.data.push({
          name: element.attributes.name.value,
          value: element.attributes.value.value,
          selected: !(element.attributes.selected.value == 'true'),
        });
        this.setState(newState);
      })
    });
  }
}

customElements.define('carto-category', CartoCategory);