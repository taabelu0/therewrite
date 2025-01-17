import React from "react";
import optimizeClientRects from "./OptimizeRectanglesCustom";
import {getPagesFromRange} from "react-pdf-highlighter/dist/cjs/lib/pdfjs-dom";

export class Annotation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            key: props.annotation.id,
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

    componentDidUpdate(prevProps) {
        if (this.props.annotation !== prevProps.annotation) {
            this.setState({
                key: this.props.annotation.id,
                currentSelection: this.props.annotation.selection,
                currentCategory: this.props.annotation.category,
                currentHeight: this.props.annotation.height,
                currentWidth: this.props.annotation.width,
                currentTop: this.props.annotation.top,
                currentLeft: this.props.annotation.left,
                currentScrollX: this.props.annotation.scrollX,
                currentScrollY: this.props.annotation.scrollY,
            });
        }
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
    if (props.selection) {
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

const isClientRectInsidePageRect = (clientRect, pageRect) => {
    if (clientRect.top < pageRect.top) {
        return false;
    }
    if (clientRect.bottom > pageRect.bottom) {
        return false;
    }
    if (clientRect.right > pageRect.right) {
        return false;
    }
    if (clientRect.left < pageRect.left) {
        return false;
    }

    return true;
};


const getClientRectsCustom = (range, pages, scroll) => {
    const clientRects = Array.from(range.getClientRects());
    const rects = [];
    for (const clientRect of clientRects) {
        for (const page of pages) {
            const pageRect = page.node.getBoundingClientRect();

            if (
                isClientRectInsidePageRect(clientRect, pageRect) &&
                clientRect.width > 0 &&
                clientRect.height > 0 &&
                clientRect.width < pageRect.width &&
                clientRect.height < pageRect.height
            ) {
                const highlightedRect = {
                    top: clientRect.top + scroll.scrollY,
                    left: clientRect.left + scroll.scrollX,
                    width: clientRect.width,
                    height: clientRect.height,
                    pageNumber: page.number,
                };

                rects.push(highlightedRect);
            }
        }
    }
    return optimizeClientRects(rects);
};

export function BoundingBoxCalc(props) {
    AnnotationCalc(props);
    props.rects = getClientRectsCustom(props.range, getPagesFromRange(props.range),
        {scrollX: props.scrollX, scrollY: props.scrollY});
}