import {useParams} from "react-router-dom";
import {pdfAPI} from "../apis/pdfAPI";
import React, {Component, useState} from "react";
import {PdfHighlighter, PdfLoader} from "react-pdf-highlighter";
import '../style/demo.scss';
import Navigation from "./Navigation";
import postItIcon from "./annotations/icons/PostItIcon";

const annoationCategories = [
    {
        name:"Definition",
        description:"Select this category to add definitions of terms you found in the documents."
    },
    {
      name:"Explosion",
      description: "Select to add terms, notes and descriptions or external resources, e.g. links to material you feel needs to included in the document."
    },
    {
        name: "Deletion",
        description: "Select to signal that you would like to delete specific terms in the document altogether. Add some thoughts or links to sources that explain why you feel the term should be deleted."
    },
    {
        name:"Correction",
        description: "Select to propose changes to the term in question. Note that correction has an authoritative connotation: you're suggesting a definitive replacement!"
    },
    {
        name: "Speculation",
        description: "Select this category if you would like to avoid the authoritative connotation of correction. Speculation is future-oriented, open-ended, evocative and can involve uncertain trajectories."
    },
    {
        name: "Addition",
        description: "For additions."
    }
    ]
const initialUrl = {"url": ""};
function Demo() {
    const [creatingComponent, setCreatingComponent] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("Definition");
    const [toggleAnnotationCategories,setToggleAnnotationCategories] = useState(false);

    let { pdfName } = useParams();
    initialUrl.url = pdfAPI.getUrl(pdfName);

    const toggleCategories = () => {
        setToggleAnnotationCategories(prevState => !prevState);
    }
    return (
        <div>
            <Navigation />
            <nav className="nav-meta"></nav>
            <nav className="meta"></nav>
            <nav className="nav-tools"></nav>
            <Core pdfName={pdfName}></Core>
            <section id="demo">
            </section>
        </div>
    );
}

class Core extends Component<> {

    state = {
        url: initialUrl.url,
        highlights: [],
    };

    render() {
        const {url} = this.state;
        return (
            <PdfLoader url={url} beforeLoad={() => {
            }}>
                {(pdfDocument) => (
                    <PdfHighlighter
                        pdfDocument={pdfDocument}
                        onScrollChange={null}
                        enableAreaSelection={(event) => null}
                        onSelectionFinished={(event) => null}
                        pdfScaleValue={1.39}
                        scrollRef={null}
                        highlights={[]}
                    />
                )}
            </PdfLoader>
        );
    }
}

export default Demo;