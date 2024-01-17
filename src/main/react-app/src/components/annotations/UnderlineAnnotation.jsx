import {Annotation, AnnotationCalc} from './Annotation.jsx';

export class UnderlineAnnotation extends Annotation {
    offset = 10;

    constructor(props) {
        super(props);
        this.state.currentRects = props.annotation.rects || [];
        console.log('HELLO', props.annotation.rects)
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
                            className={"underline underline-" + this.state.currentCategory.toLowerCase()}
                        ></div>
                    );
                })}
            </div>
        );
    }
}

export function UnderlineCalc(props) {
    AnnotationCalc(props);
    let rects = props.range.getClientRects();
    console.log("RECTS", rects);
    props.rects = [];
    let prevTop = null;
    if(rects.length < 1) return;
    const underlineRects = Array.from(rects).map((rect, index) => {
        const underlineRect = {};
        const isValidTop = Number.isFinite(rect.top);
        const isValidLeft = Number.isFinite(rect.left);

        // Check if the current top position is similar to the previous one
        const isSameLine = isValidTop && prevTop !== null && Math.abs(rect.top - prevTop) < 5;

        // Adjust the top and left positions based on the scroll positions and the rect's dimensions
        const adjustedTop = isSameLine ? prevTop : (isValidTop ? rect.top + (props.scrollY ?? 0) : rect.top);
        const adjustedLeft = isValidLeft ? rect.left + (props.scrollX ?? 0) : rect.left;

        console.log("Recttop , scrollY", rect.top, props.scrollY)
        console.log(`Line ${index + 1} - isValidTop: ${isValidTop}, adjustedTop: ${adjustedTop}`);

        // Update the previous top position for the next iteration
        prevTop = isValidTop ? rect.top : null;
        underlineRect.top = adjustedTop
        underlineRect.left = adjustedLeft
        underlineRect.width = rect.width
        underlineRect.height = rect.height
        return underlineRect;
    });
    props.rects = underlineRects;
}
