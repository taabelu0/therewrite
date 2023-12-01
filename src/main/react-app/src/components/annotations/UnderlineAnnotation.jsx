import Annotation from './Annotation.jsx';

export default class UnderlineAnnotation extends Annotation {
    offset = 10;

    constructor(props) {
        super(props);
        this.state.currentWidth = 10;
        this.state.currentHeight = this.state.currentBound.height;

        // Initialize scrollX and scrollY in the constructor or use other default values if needed
        this.state.scrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;
        this.state.scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    }

    componentDidMount() {
        // Add event listener for scroll events
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        // Remove event listener when component is unmounted
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        // Update the state with the new scroll positions
        this.setState({
            scrollX: window.scrollX || window.pageXOffset || document.documentElement.scrollLeft,
            scrollY: window.scrollY || window.pageYOffset || document.documentElement.scrollTop,
        });
    };

    render() {
        console.log("Start");
        let range = this.state.currentSelection.getRangeAt(0);
        let rects = range.getClientRects();

        console.log("Rects:", rects);

        let prevTop = null;

        return (
            <div>
                {rects.length > 0 &&
                    Array.from(rects).map((rect, index) => {
                        const isValidTop = Number.isFinite(rect.top);
                        const isValidLeft = Number.isFinite(rect.left);

                        // Check if the current top position is similar to the previous one
                        const isSameLine = isValidTop && prevTop !== null && Math.abs(rect.top - prevTop) < 5;

                        // Adjust the top and left positions based on the scroll positions and the rect's dimensions
                        const adjustedTop = isSameLine ? prevTop : (isValidTop ? rect.top + (this.state.scrollY ?? 0) : rect.top);
                        const adjustedLeft = isValidLeft ? rect.left + (this.state.scrollX ?? 0) : rect.left;

                        console.log("Recttop , scrollY", rect.top, this.state.scrollY)
                        console.log(`Line ${index + 1} - isValidTop: ${isValidTop}, adjustedTop: ${adjustedTop}`);

                        // Update the previous top position for the next iteration
                        prevTop = isValidTop ? rect.top : null;

                        return (
                            <div
                                key={`underline_${index}`}
                                style={{
                                    top: adjustedTop,
                                    left: adjustedLeft,
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
