import React from "react";

export class Annotation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            currentSelection: props.annotation.selection,
            currentCategory: props.annotation.category,
            currentHeight: props.annotation.height,
            currentWidth: props.annotation.width,
            currentTop: props.annotation.top,
            currentLeft: props.annotation.left,
            currentScrollX: props.annotation.scrollX,
            currentScrollY: props.annotation.scrollY,
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

export function AnnotationCalc(props) {
    if (props.selection)  {
        if (props.selection.rangeCount < 1) throw new Error("No selection available");
        props.range = props.selection.getRangeAt(0);
        props.bound = props.range.getBoundingClientRect();
        props.scrollX = window.scrollX;
        props.scrollY = window.scrollY;
    } else {
        props.bound = {};
        props.range = {};
    }
}