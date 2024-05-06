import {Annotation} from './Annotation.jsx';
import Wave from './paragraphSquiggly/Wave';
import { renderToStaticMarkup } from 'react-dom/server';
import CategoryMapping from "./CategoryMapping";

export class Squiggly extends Annotation {
    offset = 10;

    constructor(props) {
        super(props);
        this.state.currentRects = props.annotation.rects || [];
        const color = CategoryMapping[this.state.currentCategory.toLowerCase()];
        const svgString = renderToStaticMarkup(<Wave stroke={color} />);
        this.state.currentSVG = `data:image/svg+xml;base64,${window.btoa(decodeURIComponent(encodeURIComponent(svgString)))}`;
    }

    render() {
        return (
            <div id={this.state.key} className={"annotation-root annotation"}>
                {this.state.currentRects.map((rect, index) => {
                    return (
                        <div
                            key={`highlight_${index}`}
                            style={{
                                top: rect.top,
                                left: rect.left,
                                height: rect.height,
                                width: rect.width,
                            }} className={"paragraph-custom annotation"}>
                            <div className="squiggly-paragraph" style={{
                                backgroundSize: `${40 * (rect.height / 100)}px ${rect.height}px`,
                                backgroundImage: `url(${this.state.currentSVG})`
                            }}>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}