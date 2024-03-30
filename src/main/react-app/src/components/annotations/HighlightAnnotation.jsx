import {Annotation} from './Annotation.jsx';

export class HighlightAnnotation extends Annotation {
    offset = 10;

    constructor(props) {
        super(props);
        this.state.currentRects = props.annotation.rects || [];
    }

    render() {
        return (
            <div className={"annotation-root"}>
                {this.state.currentRects.map((rect, index) => {
                    return (
                        <div
                            key={`highlight_${index}`}
                            style={{
                                top: rect.top,
                                left: rect.left,
                                height: rect.height,
                                width: rect.width,
                            }}
                            className={"highlight highlight-" + this.state.currentCategory.toLowerCase()}
                        ></div>
                    );
                })}
            </div>
        );
    }
}

