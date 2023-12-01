import Annotation from './Annotation.jsx';
import Wave from './paragraphSquiggly/Wave';
import { renderToStaticMarkup } from 'react-dom/server';
import CategoryMapping from "./CategoryMapping";

export default class ParagraphCustom extends Annotation {
    offset = 0;
    widthProportion = 0.4;

    constructor(props) {
        super(props);
        this.state.currentWidth = this.state.currentBound.width + this.offset * 2;
        this.state.currentHeight = this.state.currentBound.height;
        this.state.currentWaveWidth = this.widthProportion * this.state.currentHeight;
        this.state.currentWaveHeight = this.state.currentHeight;
        const color = CategoryMapping[this.state.currentCategory.toLowerCase()];
        const svgString = renderToStaticMarkup(<Wave stroke={color} />);
        this.state.currentSVG = `data:image/svg+xml;base64,${window.btoa(decodeURIComponent(encodeURIComponent(svgString)))}`;
    }

    render() {
        return (<div style={{
            top: this.state.currentTop + this.state.currentScrollY,
            left: this.state.currentLeft + this.state.currentScrollX - this.offset,
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