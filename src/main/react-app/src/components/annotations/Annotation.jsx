import React from "react";

export class Annotation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            currentSelection: props.selection,
            currentCategory: props.category,
            currentHeight: props.height,
            currentWidth: props.width,
            currentTop: props.top,
            currentLeft: props.left,
            currentScrollX: props.scrollX,
            currentScrollY: props.scrollY,
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

export function ParagraphSideBarCalc(props) {
    const offset = 0;
    AnnotationCalc(props);
    props.top = props.top || (props.bound.top + props.scrollY);
    props.left = props.left || (props.bound.left + props.scrollX - offset);
    props.width = props.width || 10;
    props.height = props.height || props.bound.height;
}

export function ParagraphCustomCalc(props) {
    const offset = 0;
    AnnotationCalc(props);
    props.top = props.top || (props.bound.top + props.scrollY);
    props.left = props.left || (props.bound.left + props.scrollX - offset);
    props.width = props.width || (props.bound.width + offset * 2);
    props.height = props.height || props.bound.height;
}