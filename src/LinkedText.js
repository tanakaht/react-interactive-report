import "./LinkedText.css";
import React, { Component } from 'react'

class LinkedText extends Component {
    constructor(props) {
        super(props);
        this.createLinkedText = this.createLinkedText.bind(this);
        this.update_text = this.update_text.bind(this);
        this.divRef = React.createRef();
    }

    componentDidMount() {
        this.createLinkedText()
    }
    componentDidUpdate() {
        this.createLinkedText()
    }

    update_text(data) {
        const _self = this;
        while (_self.divRef.current.lastChild) {
            _self.divRef.current.removeChild(_self.divRef.current.lastChild);
        }
        let cnt = 0
        for (let report of data) {
            cnt++
            if (cnt > 1000) { break }
            const rep = document.createElement('span');
            rep.append(document.createTextNode(report.text));
            rep.className = 'nonselected'
            rep.addEventListener("mouseenter", (event) => {
                if (report.focusArgs === null) {
                    return;
                }
                _self.props.setFocus(...report.focusArgs);
                rep.className = 'selected'
            }, false);
            rep.addEventListener("mouseleave", (event) => {
                _self.props.setFocus();
                rep.className = 'nonselected'
            }, false);
            rep.addEventListener("click", (event) => {
                _self.props.setDatafact(report);
            }, false);
            _self.divRef.current.appendChild(rep);
            rep.append(document.createElement("br"));
        };
    }

    createLinkedText() {
        const _self = this;
        _self.update_text(_self.props.init_data)
    }

    render() {
        return <div ref={this.divRef} />
    }
}

export default LinkedText
