import Annotation from './Annotation.jsx';
export default class ParagraphSideBar extends Annotation {
    offset = 10;
    constructor(props) {
        super(props);
        this.state.currentWidth = 10;
        this.state.currentHeight = this.state.currentBound.height;
    }

    render() { return (<div style={{
        top: this.state.currentTop + this.state.currentScrollY,
        left: this.state.currentLeft + this.state.currentScrollX - this.state.currentWidth - this.offset,
        height: this.state.currentHeight,
        width: this.state.currentWidth
    }} className={`paragraph-sidebar paragraph-sidebar-${this.state.currentCategory.toLowerCase()} annotation`}>
    </div>)};
}