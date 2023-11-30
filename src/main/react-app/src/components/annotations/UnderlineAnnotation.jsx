import Annotation from './Annotation.jsx';

export default class UnderlineAnnotation extends Annotation {
    offset = 10;

    constructor(props) {
        super(props);
        this.state.currentWidth = 10;
        this.state.currentHeight = this.state.currentBound.height;

    }

    render() {
        const { currentTop, currentLeft, currentWidth, currentHeight, currentScrollX, currentScrollY, currentSelection, currentBound, props } = this.state;

        // Get the position of the PdfHighlighter div
        const pdfHighlighterDiv = document.querySelector(".pdfViewer.removePageBorders");
        const pdfHighlighterRect = pdfHighlighterDiv.getBoundingClientRect();

        console.log(props)
        console.log(currentScrollX)
        console.log(currentScrollY)
        console.log(currentSelection)
        console.log(currentBound)
        console.log(pdfHighlighterRect.top)
        console.log(pdfHighlighterRect.left)
        const underlineStyle = {

            top: currentTop + pdfHighlighterRect.top, // Adjusted to consider the PdfHighlighter position
            left: currentLeft +  pdfHighlighterRect.left, // Adjusted to consider the PdfHighlighter position
            height: 2, // Adjust the height of the underline as needed
            width: currentWidth + 2 * this.offset, // Adjust the width of the underline as needed
        };

        return (
            <div style={underlineStyle} className={"underline"}>
            </div>
        );
    };
}
