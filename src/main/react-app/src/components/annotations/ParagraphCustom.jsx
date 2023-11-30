import Annotation from './Annotation.jsx';
export default class ParagraphCustom extends Annotation {
    offset = 10;
    constructor(props) {
        super(props);
        this.state.currentWidth = this.state.currentBound.width + this.offset * 2;
        this.state.currentHeight = this.state.currentBound.height;
    }

    render() { return (<div style={{
        top: this.state.currentTop + this.state.currentScrollY,
        left: this.state.currentLeft + this.state.currentScrollX - this.offset,
        height: this.state.currentHeight,
        width: this.state.currentWidth
    }} className={"paragraph-custom annotation"}>
        <div className="squiggly-underline" style={{
            backgroundSize: `${40 * (this.state.currentHeight / 100)}px ${this.state.currentHeight}px`
        }}>
        </div>
    </div>)};
}