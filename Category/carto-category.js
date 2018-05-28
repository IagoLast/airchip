class CartoCategory extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'data'];
  }

  get template() {
    if (!this.state.data) return 'No categories';

    const max = this.state.data.reduce((max, item) => {
      if (item.value > max) return item.value;
      return max;
    }, 0);

    const selected = this.state.data.reduce((selected, item) => {
      if (item.selected) return true;
      return selected;
    }, false);

    const items = this.state.data
      .sort((a, b) => b.value - a.value)
      .map(item => this.itemTemplate(item, max));

    return `
        <div class="carto-category ${selected ? 'carto-category--selected' : ''}">
          <div class="carto-title">${this.state.title}</div>
          <div class="carto-subtitle">${this.state.subtitle}</div>
          ${items.join('')}
        </div>
      `;
  }

  constructor() {
    super();
    console.info('constructor', this);
    this.state = Object.freeze({});
  }

  setData(newValue) {
    console.log(newValue);
    this.state.data = [].concat(newValue);
    this.render();
  }

  itemTemplate(item, max) {
    return `
      <div name="${item.name}" value="${item.value}" selected="${item.selected || false}" data-id="" class="carto-category-item">
        <div>
          <span>${item.name}</span>
          <span>${item.value}</span>
        </div>
        <div class="carto-category-bar ${item.selected ? 'carto-category-bar--selected' : ''}" style="width: ${(item.value / max) * 100}%;">
        </div>
      </div>
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
    const event = new CustomEvent('changed', { detail: this.state });
    this.dispatchEvent(event);
  }

  render() {
    this.innerHTML = this.template;
    this._listenToChildEvents();
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