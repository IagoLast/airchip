//TODO: Include D3 as a node module

class CartoDonut extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'subtitle', 'footer', 'data'];
    }

    constructor() {
        super();
        console.info('constructor', this);
        this.state = Object.freeze({});

        this._render = hyperHTML.bind(this);
    }

    get _mutableContent() {
        return `
            <span class="title">${this.state.title || ''}</span>
            <span class="subtitle">${this.state.subtitle || ''}</span>
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

    render() {
        this._render`
        <div class="data-container">
            <span class="title">${this.state.title || ''}</span>
            <span class="subtitle">${this.state.subtitle || ''}</span>
        </div>
        <div class="chart-container"></div>
        `;
        this._drawChart();
    }

    setData(data) {
        const newState = Object.assign({}, this.state);
        newState.data = data;
        this.setState(newState);
    }

    _initChart() {
        this._width = 100; //this.offsetWidth * 0.5;
        this._height = 100; //this.offsetHeight * 0.6;
        this._thickness = 5;

        this._radius = Math.min(this._width, this._height) / 2;


        this._svg = d3.select(this.querySelector('.chart-container'))
            .append('svg')
            .attr('class', 'pie')
            .attr('width', this._width)
            .attr('height', this._height);

        // this._g = this._svg.append('g').attr('transform', 'translate(' + (this._width / 2) + ',' + (this._height / 2) + ')');

        this._isChartInitialized = true;
    }

    _drawChart() {
        const COLORS = ['#56C58C', '#F0CD53', '#3AB5F0', '#7E78E2', '#F45171', '#FDA94D'];
        if (!this.state.data) {
            return;
        }
        if (!this._isChartInitialized) {
            this._initChart();
        }

        var arc = d3.arc().innerRadius(this._radius - this._thickness).outerRadius(this._radius);
        var pie = d3.pie().value(d => d.value).sort(null);

        this._svg.selectAll('path')
            .data(pie(this.state.data))
            .enter()
            .append("g")
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => COLORS[i])
            .each((d, i) => { this._current = i; });
    }
}

customElements.define('carto-donut', CartoDonut);