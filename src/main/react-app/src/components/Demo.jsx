import {useParams} from "react-router-dom";
import {pdfAPI} from "../apis/pdfAPI";
import React, {Component, useState} from "react";
import {PdfHighlighter, PdfLoader} from "react-pdf-highlighter";
import '../style/demo.scss';


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
            <Core pdfName={pdfName}></Core>
            <section id={"demo-workspace-scroll"}>
                <nav id="demo-sidebar-nav">
                    <button className="toggleCategoriesBtn" onClick={toggleCategories}>Annotation Categories</button>
                    <p className="category-text">Select a category while annotating to mark your highlights and
                        notes.</p>
                    <div id="demo-category-selection">
                        {annoationCategories.map((cat, key) => (
                            <div
                                className={`demo-category demo-category-${cat.name.toLowerCase()} ${selectedCategory === cat.name ? "category-active" : ""} ${toggleAnnotationCategories ? 'demo-categories-open' : ''}`}
                                key={key}
                                onClick={() => setSelectedCategory(`${cat.name}`)}
                            >
                                <p className={"demo-category-title"}>{cat.name}</p>
                                <p className={`demo-category-desc`}>{cat.description}</p>
                            </div>
                        ))}
                    </div>
                    <div id="toolbar">
                        <div
                            className={`tool add-post-it ${creatingComponent === "HighlightAnnotation" ? "add-tool-active" : ""}`}
                            id="add-post-it-green"
                            onClick={() => setCreatingComponent("HighlightAnnotation")}
                        >
                            ✎
                        </div>
                        <div
                            className={`tool add-post-it ${creatingComponent === "ParagraphCustom" ? "add-tool-active" : ""}`}
                            onClick={() => setCreatingComponent("ParagraphCustom")}
                        >
                            🖌
                        </div>
                        <div
                            className={`tool add-post-it ${creatingComponent === "ParagraphSideBar" ? "add-tool-active" : ""}`}
                            onClick={() => setCreatingComponent("ParagraphSideBar")}
                        >
                            |
                        </div>
                        <div
                            className={`tool add-post-it ${creatingComponent === "UnderlineAnnotation" ? "add-tool-active" : ""}`}
                            onClick={() => setCreatingComponent("UnderlineAnnotation")}
                        >
                            ⎁
                        </div>
                        <div
                            className={`tool add-post-it ${creatingComponent === "PostIt" ? "add-tool-active" : ""}`}
                            onClick={() => setCreatingComponent("PostIt")}
                        >
                            🗅
                        </div>
                        <div
                            className={`tool add-post-it ${creatingComponent === "TinyText" ? "add-tool-active" : ""}`}
                            id="add-post-it-yellow"
                            onClick={() => setCreatingComponent("TinyText")}
                        >
                            Ƭ
                        </div>
                    </div>
                </nav>
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