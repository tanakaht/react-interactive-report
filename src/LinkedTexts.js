import LinkedText from './LinkedText';
import React, { Component } from 'react'

function getUniqueStr(myStrong){
    var strong = 1000;
    if (myStrong) strong = myStrong;
    return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}

class LinkedTexts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                { this.props.data.map(d => {
                    return <LinkedText key={getUniqueStr()} visRef={this.props.visRef} text={d.text} plays={d.plays} />
                    })
                }
            </div>
        )
    }
}

export default LinkedTexts
