class CartoElement extends HTMLElement {
  constructor() {
    super();
    this.state = Object.freeze({});
    this._render = hyperHTML.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    this.setState({ [attributeName]: newValue });
  }

  setState(state) {
    this.state = { ...this.state, ...state };
    this.render();
    const event = new CustomEvent('changed', { detail: this.state });
    this.dispatchEvent(event);
  }
}
