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

export function BoundingBoxCalc(props) {
    AnnotationCalc(props);
    const rects = props.range.getClientRects();

    if (rects.length < 1) return;

    let underlineRects = [];
    let prevTop = null;
    let maxTop = [];
    let differenceMax = 25

    Array.from(rects).forEach((rect, index) => {
        const isValidTop = Number.isFinite(rect.top);
        const isValidLeft = Number.isFinite(rect.left);

        let adjustedTop = isValidTop ? rect.top + props.scrollY : rect.top;
        let adjustedLeft = isValidLeft ? rect.left + props.scrollX : rect.left;

        adjustedTop = Math.round(adjustedTop * 100) / 100

        const underlineRect = {
            top: adjustedTop,
            left: adjustedLeft,
            width: rect.width,
            height: rect.height,
        };

        underlineRects.push(underlineRect);

        let isBigger = false
        let isNeverSameLine = true
        let lengthMaxTop = maxTop.length

        for(let i = 0; i < lengthMaxTop && !isBigger; i++) {
            if (Math.abs(adjustedTop - maxTop[i]) < differenceMax) {
                isNeverSameLine = false
                isBigger = maxTop[i] < adjustedTop;
                maxTop[i] = isBigger ? (adjustedTop) : maxTop[i];
            }
        }

        if(maxTop.length === 0 || isNeverSameLine){
            maxTop.push(adjustedTop)
        }

        prevTop = isValidTop ? rect.top : null;
    });
    underlineRects = underlineRects.filter(rects => maxTop.some(mt => Math.abs(rects.top - mt) < 0.5))
    console.log(underlineRects)
    props.rects = underlineRects;
}