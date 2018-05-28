import React, { Component } from 'react';
import { render } from 'react-dom';
import './index.css';
import '@airship/category-widget/carto-category.css';
import '@airship/category-widget';

class App extends Component {
  state = {
    oldState: '',
    text: 'oh\nno',
  };

  componentDidMount() {
    if (this.widget) {
      this.widget.addEventListener('changed', e => {
        const anySelected = e.detail.data.filter(e => e.selected).length > 0;
        if (anySelected) {
          this.setState({
            text: e.detail.data.filter(e => e.selected).map(e => e.name).join('\n'),
            oldState: this.state.text
          });
        } else {
          this.setState({
            text: this.state.oldState
          });
        }
        
      });
    }
  }

  onTextAreaChanged = event => {
    this.setState({ text: event.target.value });
    console.log(this.widget);

    const wholeText = event.target.value;
    const lines = wholeText.split('\n');
    const values = {};
    lines.forEach(e =>
      values[e] = (values[e]+1 || 1)
    );
    this.widget.setData(Object.keys(values).map(e => ({
      name: e,
      value: values[e]
    })));
  };

  render() {
    const { text } = this.state;
    const count = text.split('\n').length;

    return (
      <main>
        <header>{count} lines</header>
        <textarea
          defaultValue={text}
          onChange={this.onTextAreaChanged}
          rows="20"
          value={this.state.text}
        />
        <carto-category ref={ref => { if (ref) this.widget = ref; }} title="List" subtitle="A cool list"></carto-category>
      </main>
    );
  }
}

render(<App />, document.getElementById('root'));
