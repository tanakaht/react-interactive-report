import './App.css';
import React, { Component } from 'react'
import { BubbleChart, LinkedText } from '../../src'
import data from '../static/nations.json';
import text from '../static/afghan.json';


class App extends Component {
  constructor(props) {
    super(props)
    this.BubbleChartRef = React.createRef();
    this.LinkedTextRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
    this.setDatafact = this.setDatafact.bind(this);
  }

  setFocus(timeRange, emphasisObjects){
    this.BubbleChartRef.current.setFocus(timeRange, emphasisObjects);
  }

  setDatafact(datafact) {
    return;
  }

  render() {
    const doc = (
      <div>
        <h2>React D3.js Bubble chart</h2>
        <BubbleChart data={data} ref={this.BubbleChartRef} itemname='name' xname='income' yname='lifeExpectancy' rname='population' />
        <LinkedText init_data={text} setFocus={this.setFocus} setDatafact={this.setDatafact} ref={this.LinkedTextRef}/>
      </div>
    )
    return doc
  }
}

export default App;
