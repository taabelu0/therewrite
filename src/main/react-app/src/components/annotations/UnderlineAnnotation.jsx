import {Annotation, AnnotationCalc} from './Annotation.jsx';

export class UnderlineAnnotation extends Annotation {
    offset = 10;

    constructor(props) {
        super(props);
        this.state.currentRects = props.annotation.rects || [];
    }

    render() {
        return (
            <div id={this.state.key} className={"annotation-root annotation"}>
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
