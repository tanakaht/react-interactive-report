import "./LinkedText.css";
import React, { Component } from 'react'

class LinkedText extends Component {
    constructor(props) {
        super(props);
        this.spanRef = React.createRef();
        this.createLinkedText = this.createLinkedText.bind(this);
    }

    componentDidMount() {
        this.createLinkedText()
    }
    componentDidUpdate() {
        this.createLinkedText()
    }

    createLinkedText() {
        const _self = this;
        const rep = _self.spanRef.current;
        rep.append(document.createTextNode(_self.props.text));
        rep.className = 'nonselected';
        if (_self.props.plays.length) {
            rep.addEventListener("mouseenter", (event) => {
                _self.props.visRef.current.play(_self.props.plays);
                rep.className = 'selected'
            }, false);
            rep.addEventListener("mouseleave", (event) => {
                _self.props.visRef.current.play([["init", ""]]);
                rep.className = 'nonselected'
            }, false);
        }
    }

    render() {
        return <span ref={this.spanRef} />
    }
}

LinkedText.defaultProps = {
    plays: []
};


export default LinkedText
