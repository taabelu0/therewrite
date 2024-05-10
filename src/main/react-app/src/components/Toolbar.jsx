import HighlightIcon from "./annotations/icons/HighlightIcon";
import UnderlineIcon from "./annotations/icons/UnderlineIcon";
import SquigglyIcon from "./annotations/icons/SquigglyIcon";
import ParagraphSidebarIcon from "./annotations/icons/ParagraphSidebarIcon";
import PostItIcon from "./annotations/icons/PostItIcon";
import TinyTextIcon from "./annotations/icons/TinyTextIcon";
import '../style/toolbar.scss';
import React, {useEffect, useRef, useState} from "react";

function Toolbar({
                     annotationCategories: annotationCategories,
                     selectedCategory,
                     setSelectedCategory,
                     creatingComponent,
                     toggleAnnotationCategories,
                     setCreatingComponent,
                     setToggleAnnotationCategories
                 }) {
    const toolbarRef = useRef(null);

    function changeCreatingComponent(newComp) {
        setCreatingComponent(prev => {
            return (prev !== null && newComp === prev) ? null : newComp;
        });
    }

    const toggleCategories = () => {
        setToggleAnnotationCategories(prevState => !prevState);
    }


    /*useEffect(() => {
        const handleScroll = () => {
            const toolbar = toolbarRef.current;
            const rect = toolbar.getBoundingClientRect();
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

     */


    return (
        <div id="topbar-nav" ref={toolbarRef}>
            <button className="toggleCategoriesBtn" onClick={toggleCategories}>Annotation Categories</button>
            <p className="category-text">Select a category while annotating to mark your highlights and
                notes.</p>
            <div id="category-selected">
                {annotationCategories.map((cat, key) => (
                    <div
                        className={`category category-${cat.name.toLowerCase()} ${selectedCategory === cat.name ? "category-active" : ""} ${toggleAnnotationCategories ? 'categories-open' : ''}`}
                        key={key}
                        onClick={() => setSelectedCategory(`${cat.name}`)}
                    >
                        <p className={"category-title"}>{cat.name}</p>
                        <p className={"category-desc"}>{cat.description}</p>
                    </div>
                ))}
            </div>
            <div id="tools">
                <div className={`styles ${'styles-' + selectedCategory}`}>
                    <div
                        className={`toolbarItem add-post-it ${creatingComponent === "HighlightAnnotation" ? "add-tool-item-active-" + selectedCategory : ""} ${'tool-' + selectedCategory}`}
                        id="add-post-it-green"
                        onClick={() => changeCreatingComponent("HighlightAnnotation")}
                    >
                        <HighlightIcon/>
                    </div>
                    <div
                        className={`toolbarItem add-post-it ${creatingComponent === "UnderlineAnnotation" ? "add-tool-item-active-" + selectedCategory : ""} ${'tool-' + selectedCategory}`}
                        onClick={() => changeCreatingComponent("UnderlineAnnotation")}
                    >
                        <UnderlineIcon/>
                    </div>
                    <div
                        className={`toolbarItem add-post-it ${creatingComponent === "Squiggly" ? "add-tool-item-active-" + selectedCategory : ""} ${'tool-' + selectedCategory}`}
                        onClick={() => changeCreatingComponent("Squiggly")}
                    >
                        <SquigglyIcon/>
                    </div>
                    <div
                        className={`toolbarItem add-post-it ${creatingComponent === "ParagraphSideBar" ? "add-tool-item-active-" + selectedCategory : ""} ${'tool-' + selectedCategory}`}
                        onClick={() => changeCreatingComponent("ParagraphSideBar")}
                    >
                        <ParagraphSidebarIcon/>
                    </div>
                </div>
                <div className={`styles ${'styles-' + selectedCategory}`}>
                    <div
                        className={`toolbarItem add-post-it ${creatingComponent === "PostIt" ? "add-tool-item-active-" + selectedCategory : ""} ${'tool-' + selectedCategory}`}
                        onClick={() => changeCreatingComponent("PostIt")}
                    >
                        <PostItIcon/>
                    </div>
                    <div
                        className={`toolbarItem add-post-it ${creatingComponent === "TinyText" ? "add-tool-item-active-" + selectedCategory : ""} ${'tool-' + selectedCategory}`}
                        id="add-post-it-yellow"
                        onClick={() => changeCreatingComponent("TinyText")}
                    >
                        <TinyTextIcon/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;