import {Annotation, AnnotationCalc} from './Annotation.jsx';

export default class UnderlineAnnotation extends Annotation {
    offset = 10;

    constructor(props) {
        super(props);
        this.state.currentRects = props.rects || [];
    }

    render() {
        return (
            <div>
                {this.state.currentRects.map((rect, index) => {
                        return (
                            <div
                                key={`underline_${index}`}
                                style={{
                                    top: rect.top,
                                    left: rect.left,
                                    height: rect.height,
                                    width: rect.width,
                                }}
                                className={"underline"}
                            ></div>
                        );
                    })}
            </div>
        );
    }
}

export function UnderlineCalc(props) {
    AnnotationCalc(props);
    const rects = props.range.getClientRects();
    console.log("RECTS", rects);

    if (rects.length < 1) return;

    const underlineRects = [];
    let prevTop = null;

    Array.from(rects).forEach((rect, index) => {
        const isValidTop = Number.isFinite(rect.top);
        const isValidLeft = Number.isFinite(rect.left);

        // Adjust the top and left positions based on the scroll positions and the rect's dimensions
        const adjustedTop = isValidTop ? rect.top + window.scrollY : rect.top;
        const adjustedLeft = isValidLeft ? rect.left + window.scrollX : rect.left;

        console.log("Recttop , scrollY", rect.top, window.scrollY);
        console.log(`Line ${index + 1} - isValidTop: ${isValidTop}, adjustedTop: ${adjustedTop}`);

        // Check if the current top position is similar to the previous one
        const isSameLine = isValidTop && prevTop !== null && Math.abs(rect.top - prevTop) < 5;

        // Check if the line has already been underlined
        const isLineUnderlined = underlineRects.some(
            (underlineRect) =>
                Math.abs(underlineRect.top - adjustedTop) < 5 &&
                Math.abs(underlineRect.height - rect.height) < 5
        );

        // Add the underline only if it's not the same line and not already underlined
        if (!isSameLine && !isLineUnderlined) {
            const underlineRect = {
                top: adjustedTop,
                left: adjustedLeft,
                width: rect.width,
                height: rect.height,
            };

            underlineRects.push(underlineRect);
        }

        // Update the previous top position for the next iteration
        prevTop = isValidTop ? rect.top : null;
    });

    props.rects = underlineRects;
}
