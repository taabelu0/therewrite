import {Annotation} from './Annotation.jsx';
import Wave from './paragraphSquiggly/Wave';
import { renderToStaticMarkup } from 'react-dom/server';
import CategoryMapping from "./CategoryMapping";
import {AnnotationCalc} from "./Annotation.jsx";

export class ParagraphCustom extends Annotation {
    constructor(props) {
        super(props);
        const color = CategoryMapping[this.state.currentCategory.toLowerCase()];
        const svgString = renderToStaticMarkup(<Wave stroke={color} />);
        this.state.currentSVG = `data:image/svg+xml;base64,${window.btoa(decodeURIComponent(encodeURIComponent(svgString)))}`;
    }

    render() {
        return (<div style={{
            top: this.state.currentTop,
            left: this.state.currentLeft,
            height: this.state.currentHeight,
            width: this.state.currentWidth
        }} className={"paragraph-custom annotation"}>
            <div className="squiggly-paragraph" style={{
                backgroundSize: `${40 * (this.state.currentHeight / 100)}px ${this.state.currentHeight}px`,
                backgroundImage: `url(${this.state.currentSVG})`
            }}>
            </div>
        </div>)
    };
}

export function ParagraphCustomCalc(props) {
    const offset = 0;
    AnnotationCalc(props);
    props.top = props.top || (props.bound.top + props.scrollY);
    props.left = props.left || (props.bound.left + props.scrollX - offset);
    props.width = props.width || (props.bound.width + offset * 2);
    props.height = props.height || props.bound.height;
}