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


            console.log(typeof adjustedTop)
            for(let i = 0; i < lengthMaxTop && !isBigger; i++) {
                console.log("Adjustedtop - maxtop", adjustedTop, maxTop[i])

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
    props.rects = underlineRects;
    console.log(maxTop)
}
