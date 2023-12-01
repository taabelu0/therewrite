import React from "react";
export default class Annotation extends React.Component {
    constructor(props) {
        super(props);
        if(!props.selection) {
            throw new Error("No selection available");
        }
        if(props.selection.rangeCount < 1) throw new Error("No selection available");
        let range = props.selection.getRangeAt(0);

        let bound = range.getBoundingClientRect();
        this.state = {
            count: 0,
            currentSelection: props.selection,
            currentBound: bound,
            currentCategory: props.category,
            currentHeight: 0,
            currentWidth: 0,
            currentTop: bound.top,
            currentLeft: bound.left,
            currentScrollX: props.scroll.x,
            currentScrollY: props.scroll.y,
        };
        this.incrementCount = this.incrementCount.bind(this)
    }

    incrementCount() {
        this.setState(prevState => ({
            count: prevState.count + 1
        }));
    }

    render() {
        return null;
    }
}