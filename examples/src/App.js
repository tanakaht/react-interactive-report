import './App.css';
import React, { Component } from 'react'
import { BubbleChart, LinkedTexts } from '../../src'
import data from '../static/nations.json';
import text from '../static/afghan.json';


class App extends Component {
  constructor(props) {
    super(props)
    this.BubbleChartRef = React.createRef();
  }


  render() {
    const doc = (
      <div>
        <h2>React D3.js Bubble chart</h2>
        <BubbleChart data={data} ref={this.BubbleChartRef} itemname='name' xname='income' yname='lifeExpectancy' rname='population' xscale="scaleLog" yscale="scaleLinear" rscale="scaleSqrt"/>
        <LinkedTexts data={text} visRef={this.BubbleChartRef}/>
      </div>
    )
    return doc
  }
}

export default App;
