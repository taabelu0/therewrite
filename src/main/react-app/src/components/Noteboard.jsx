import React, { useEffect, useRef, useState } from "react";
import PostIt from "./annotations/PostIt";
import {api} from "../apis/config/axiosConfig";

function Noteboard() {
    const [creatingPostIt, setCreatingPostIt] = useState(false);
    const [selectedColor, setSelectedColor] = useState("green");
    const [postIts, setPostIts] = useState([]);
    let width = useRef("100%");
    let height = useRef("100%");

    useEffect(() => {
        // Fetch post-its from the database when the component mounts
        fetchPostItsFromDatabase();
    }, []);

    async function fetchPostItsFromDatabase() {
        try {
            const response = await api.get('/api/getAnnotations');
            const { data } = response;

            // Update state with post-its from the server
            setPostIts(data);
        } catch (error) {
            console.error('Error fetching post-its:', error);
        }
    }

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

        savePostItPositionToDatabase(x, y, color).then((data) => {
            newPostIt.id = data;
            setPostIts([...postIts, newPostIt]);
        });
    }

    async function savePostItPositionToDatabase(x, y, color) {
        const annotation = {
            dataX: x,
            dataY: y,
            annotationType: "post-it",
            annotationDetail: JSON.stringify({"x": x, "y": y, "color": color}),
        };

        return await api.post('/api/saveAnnotation',
            annotation
        )
            .then(response => response.data)
            .catch((error) => {
                console.error('Error:', error);
            });
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
            <nav id="toolbar">
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
            </nav>
            <div id={"noteboard"}>
                <div className={"post-it-wrapper"}>
                    {postIts.map((postIt, index) => (
                        <PostIt
                            key={`postIt_${index}`}
                            id={postIt.id}
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
