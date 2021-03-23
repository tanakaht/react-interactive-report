import "./BubbleChart.css";
import React, { Component } from 'react'
import * as d3 from 'd3';

class BubbleChart extends Component {
    constructor(props) {
        super(props);
        const _self = this;
        const xname = _self.props.xname,
            yname = _self.props.yname,
            rname = _self.props.rname,
            itemname = _self.props.itemname;
        for (var i of [xname, yname, itemname]) {
            console.assert(i != undefined);
        }
        _self.xrange = [Infinity, -Infinity];
        _self.yrange = [Infinity, -Infinity];
        _self.rrange = [Infinity, -Infinity];
        _self.trange = [Infinity, -Infinity];
        for (var d of _self.props.data) {
            for (var i of d[xname]) {
                _self.xrange[0] = Math.min(_self.xrange[0], i[1]);
                _self.xrange[1] = Math.max(_self.xrange[1], i[1]);
                _self.trange[0] = Math.min(_self.trange[0], i[0]);
                _self.trange[1] = Math.max(_self.trange[1], i[0]);
            }
            for (var i of d[yname]) {
                _self.yrange[0] = Math.min(_self.yrange[0], i[1]);
                _self.yrange[1] = Math.max(_self.yrange[1], i[1]);
                _self.trange[0] = Math.min(_self.trange[0], i[0]);
                _self.trange[1] = Math.max(_self.trange[1], i[0]);
            }
            for (var i of d[rname]) {
                _self.rrange[0] = Math.min(_self.rrange[0], i[1]);
                _self.rrange[1] = Math.max(_self.rrange[1], i[1]);
                _self.trange[0] = Math.min(_self.trange[0], i[0]);
                _self.trange[1] = Math.max(_self.trange[1], i[0]);
            }
        }
        this.createBubbleChart = this.createBubbleChart.bind(this);
        this.play = this.play.bind(this);
        this.state = {
            time: _self.trange[0],
            emphasisObjects: new Set(),
            timescope: [_self.trange[0], _self.trange[1]]
        };
    }

    play(plays) {
        let type, param;
        const _self = this;
        for ([type, param] of plays) {
            switch (type) {
                case "setTime":
                    _self.setState({ timescope: param });
                    break;
                case "setItem":
                    if (typeof param == "string") {
                        param = [param]
                    }
                    _self.setState({emphasisObjects: new Set(param)});
                    break;
                case "init":
                    _self.setState({
                        time: _self.trange[0], // TODO: これどう？
                        timescope: _self.trange,
                        emphasisObjects: new Set()
                    });
                    break;
                default:
                    break;
            }
        }
    }

    componentDidMount() {
        this.createBubbleChart()
    }
    componentDidUpdate() {
        this.updateChart(this.state.time);
    }

    createBubbleChart() {
        const _self = this,
            node = this.node,
            interval = 400;
        let svg = d3.select(node),
            timeSlider = d3.select(_self.slider);

        svg.attr("width", '80%');
        let margin = ({ top: 20, right: 20, bottom: 35, left: 40 });

        function prepare(svg) {
            _self.width = svg.node().getBoundingClientRect().width;
            svg.attr("height", svg.node().getBoundingClientRect().width / 2);
            _self.height = svg.node().getBoundingClientRect().height;
            // scaleの更新
            _self.x = d3[_self.props.xscale](_self.xrange, [margin.left, _self.width - margin.right]);
            _self.y = d3[_self.props.yscale](_self.yrange, [_self.height - margin.bottom, margin.top]);
            _self.radius = d3[_self.props.rscale](_self.rrange, [0, _self.width / 24]);

            // 時間の表記位置の調整
            svg.selectAll('text').filter('.time-label').remove();
            _self.time_label = svg.append("text").attr("class", "time-label")
            _self.time_label.attr("text-anchor", "end")
                            .attr("y", _self.height - _self.height/8)
                            .attr("x", _self.width)
                            .attr("font-size", Math.floor(_self.width/5))
                            .text(_self.state.time);

            // 軸の描画
            svg.selectAll('g').filter('.xaxis').remove();
            svg.selectAll('g').filter('.yaxis').remove();
            svg.append("g")
                .attr("class", "xaxis")
                .attr("transform", `translate(0,${_self.height - margin.bottom})`)
                .call(d3.axisBottom(_self.x).ticks(_self.width / 80, ","))
                .call(g => g.select(".domain").remove())
                .call(g => g.append("text")
                    .attr("x", _self.width)
                    .attr("y", margin.bottom - 4)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text(_self.props.xname + " →"));
                    //.text("Income per capita (dollars) →"));
            svg.append("g")
                .attr("class", "yaxis")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(_self.y))
                .call(g => g.select(".domain").remove())
                .call(g => g.append("text")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("↑ "+_self.props.yname));
                    //.text("↑ Life expectancy (years)"));
        }
        prepare(svg);
        d3.select(window).on('resize', function () {
            prepare(svg);
            _self.updateChart(_self.state.time);
        });

        timeSlider.attr('min', _self.trange[0]).attr('max', _self.trange[1]).attr('value', _self.trange[0])
        timeSlider.on("change", function () {
            _self.setState({time: Number(this.value)})
        });

        svg.append("g").attr("stroke", "black")
                        .selectAll("circle")
                        .data(_self.dataAt(_self.trange[0]), d => d.name)
                        .join("circle")
                        .sort((a, b) => d3.descending(a.name, b.name))
                        .attr("cx", d => _self.x(d.x))
                        .attr("cy", d => _self.y(d.y))
                        .attr("r", d => _self.radius(d.r))
                        .attr("fill", "rgba(0, 0, 0, 0.5)")
                        .call(circle => circle.append("title")
                        .text(d => [d.name].join("\n")));

        function step(){
            const currentTime = _self.state.time;//Number(timeSlider.property('value'));
            if (currentTime >= _self.state.timescope[1] || currentTime < _self.state.timescope[0]){
                timeSlider.property('value', _self.state.timescope[0]);
                _self.setState({time: _self.state.timescope[0]})
            } else{
                timeSlider.property('value', currentTime+1);
                _self.setState({time: currentTime+1})
            }
        }
        setInterval(step, interval)

        function update(time){
            const circles = svg.selectAll('circle');
            circles.data(_self.dataAt(time), d => d.name)
                    .sort((a, b) => d3.descending(a.name, b.name))
                    .transition().duration(interval)
                    .attr("cx", d => _self.x(d.x))
                    .attr("cy", d => _self.y(d.y))
                    .attr("r", d => _self.radius(d.r))
                    .attr("class", d => _self.state.emphasisObjects.has(d.name)?"circle emphasis":"circle")
            _self.time_label.text(time)
        }
        _self.updateChart = update.bind(_self);
    }

    dataAt(time) {
        return this.props.data.map(d => ({
          name: d[this.props.itemname],
          x: this.valueAt(d[this.props.xname], time),
          y: this.valueAt(d[this.props.yname], time),
          r: this.valueAt(d[this.props.rname], time)
        }))
    }

    valueAt(values, time) {
        const i = d3.bisector(([time]) => time).left(values, time, 0, values.length - 1);
        const a = values[i];
        if (time>a[0] || i===0){
            return  a[1];
        } else {
          const b = values[i - 1];
          const t = (time - a[0]) / (b[0] - a[0]);
          return a[1] * (1 - t) + b[1] * t;
        }
    }

    render() {
        return <div>
            <svg ref={node => this.node = node}/>
            <input ref={node => this.slider = node} id="timeSlider" type="range"/>
        </div>
    }
}

BubbleChart.defaultProps = {
    xscale: "scaleLinear",
    yscale: "scaleLinear",
    rscale: "scaleLinear"
};

export default BubbleChart
