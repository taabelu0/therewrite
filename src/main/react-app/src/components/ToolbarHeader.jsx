import React, {useRef} from "react";


function ToolbarHeader()
{
    const toolbarRef = useRef(null);

    return (
        <div id="topbar-nav" ref={toolbarRef}>
            <button className="toggleCategoriesBtn">Annotation Categories</button>
            <p className="category-text">Select a category while annotating to mark your highlights and
                notes.</p>
        </div>
    );
}

export default ToolbarHeader;
