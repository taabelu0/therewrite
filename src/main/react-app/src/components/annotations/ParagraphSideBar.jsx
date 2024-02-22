import {Annotation} from './Annotation.jsx';
import {AnnotationCalc} from "./Annotation.jsx";
export class ParagraphSideBar extends Annotation {
    offset = 10;
    constructor(props) {
        super(props);
    }

    render() { return (<div style={{
        top: this.state.currentTop,
        left: this.state.currentLeft,
        height: this.state.currentHeight,
        width: this.state.currentWidth
    }} className={`paragraph-sidebar paragraph-sidebar-${this.state.currentCategory.toLowerCase()} annotation`}>
    </div>)};
}

export function ParagraphSideBarCalc(props) {
    const offset = 0;
    AnnotationCalc(props);
    props.top = props.top || (props.bound.top + props.scrollY);
    props.left = props.left || (props.bound.left + props.scrollX - offset);
    props.width = props.width || 10;
    props.height = props.height || props.bound.height;
}