import Annotation from './Annotation.jsx';

export default class UnderlineAnnotation extends Annotation {
    offset = 10;

    constructor(props) {
        super(props);
        this.state.currentWidth = 10;
        this.state.currentHeight = this.state.currentBound.height;

    }

    componentDidUpdate(prevProps, prevState) {
        // Check if the scroll position has changed
        if (window.scrollY !== prevState.scrollY) {
            // Update the state with the new scroll position
            this.setState({
                scrollY: window.scrollY || document.documentElement.scrollTop,
            });
        }
    }

    render() {
        console.log("Start");
        let range = this.state.currentSelection.getRangeAt(0);
        let rects = range.getClientRects();

        console.log("Rects:", rects);

        return (
            <div>
                {rects.length > 0 &&
                    Array.from(rects).map((rect, index) => {
                        // Check if rect.top and this.state.scrollY are valid numbers
                        const isValidTop = Number.isFinite(rect.top) && Number.isFinite(this.state.scrollY);

                        // Adjust the top position based on the scroll position and the rect's top
                        const adjustedTop = isValidTop ? rect.top + this.state.scrollY : 0;

                        console.log(`Line ${index + 1} - isValidTop: ${isValidTop}, adjustedTop: ${adjustedTop}`);

                        return (
                            <div
                                key={`underline_${index}`}
                                style={{
                                    top: adjustedTop,
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