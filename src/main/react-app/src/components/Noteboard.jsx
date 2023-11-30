import React, { useEffect, useRef, useState } from "react";
import PostIt from "./annotations/PostIt";

function Noteboard() {
    const [creatingPostIt, setCreatingPostIt] = useState(false);
    const [selectedColor, setSelectedColor] = useState("green");
    const [postIts, setPostIts] = useState([]);
    let width = useRef("100%");
    let height = useRef("100%");

    function handleDocumentMouseDown(event) {
        if (creatingPostIt) {
            const { clientX, clientY } = event;
            const noteboard = document.getElementById("noteboard");
            const rect = noteboard.getBoundingClientRect();

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            addPostIt(selectedColor, x, y);

            setCreatingPostIt(false);
        }
    }

    useEffect(() => {
        width.current = `${
            document.querySelector(".PdfHighlighter")?.offsetWidth
        }px`;
        height.current = `${
            document.querySelector(".PdfHighlighter")?.offsetHeight
        }px`;
    });

    useEffect(() => {
        if (creatingPostIt) {
            document.addEventListener("mousedown", handleDocumentMouseDown);
        } else {
            document.removeEventListener("mousedown", handleDocumentMouseDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleDocumentMouseDown);
        };
    }, [creatingPostIt, selectedColor]);

    function addPostIt(color, x, y) {
        const newPostIt = {
            color: color,
            dataX: x,
            dataY: y,
            text: "",
        };

        setPostIts([...postIts, newPostIt]);
    }

    function setPostItMeta(color) {
        setSelectedColor(color);
        setCreatingPostIt(true);
    }

    return (
        <section
            id={"workspace"}
            style={{
                width: width.current,
                height: height.current,
            }}
        >
            <nav id="sidebar">
                <div id="toolbar">
                    <div
                        className="tool add-post-it"
                        id="add-post-it-green"
                        onClick={() => setPostItMeta("green")}
                    >
                        +
                    </div>
                    <div
                        className="tool add-post-it"
                        id="add-post-it-yellow"
                        onClick={() => setPostItMeta("yellow")}
                    >
                        +
                    </div>
                    <div
                        className="tool add-post-it"
                        id="add-post-it-red"
                        onClick={() => setPostItMeta("red")}
                    >
                        +
                    </div>
                </div>
                <div id="category-selection">
                    <div className="category category-definition">
                        <div className="category-ball"></div>
                        <div>Definition</div>
                    </div>
                    <div className="category category-explosion">
                        <div className="category-ball"></div>
                        <div>Explosion</div>
                    </div>
                    <div className="category category-deletion">
                        <div className="category-ball"></div>
                        <div>Deletion</div>
                    </div>
                    <div className="category category-correction">
                        <div className="category-ball"></div>
                        <div>Correction</div>
                    </div>
                    <div className="category category-speculation">
                        <div className="category-ball"></div>
                        <div>Speculation</div>
                    </div>
                    <div className="category category-addition">
                        <div className="category-ball"></div>
                        <div>Addition</div>
                    </div>
                </div>
            </nav>
            <div id={"noteboard"}>
                <div className={"post-it-wrapper"}>
                    {postIts.map((postIt, index) => (
                        <PostIt
                            key={`postIt_${index}`}
                            color={postIt.color}
                            text={postIt.text}
                            dataX={postIt.dataX}
                            dataY={postIt.dataY}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Noteboard;
