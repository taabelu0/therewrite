// Sort rectangles based on their page number and position
const sort = (rects) => {
    return rects.sort((A, B) => {
        const top = (A.pageNumber || 0) * A.top - (B.pageNumber || 0) * B.top;

        if (top === 0) {
            return A.left - B.left;
        }

        return top;
    });
};

// Check if two rectangles overlap horizontally and vertically
const overlaps = (A, B) =>
    A.pageNumber === B.pageNumber &&
    A.left < B.left + B.width &&
    B.left < A.left + A.width &&
    A.top < B.top + B.height &&
    B.top < A.top + A.height;

// Check if two rectangles are on the same line with a maximum height difference
const sameLine = (A, B, yMargin = 5) =>
    A.pageNumber === B.pageNumber &&
    Math.abs(A.top - B.top) < yMargin;

// Merge two rectangles into one
const mergeRectangles = (A, B) => {
    return {
        pageNumber: A.pageNumber,
        top: Math.min(A.top, B.top),
        left: Math.min(A.left, B.left),
        width: Math.max(A.left + A.width, B.left + B.width) - Math.min(A.left, B.left),
        height: Math.max(A.top + A.height, B.top + B.height) - Math.min(A.top, B.top)
    };
};

// Optimize and merge rectangles
const optimizeClientRects = (clientRects) => {
    let rects = sort(clientRects);
    let mergedRects = [];

    for (let i = 0; i < rects.length; i++) {
        let foundOverlap = false;

        for (let j = 0; j < mergedRects.length; j++) {
            if (overlaps(rects[i], mergedRects[j]) || sameLine(rects[i], mergedRects[j])) {
                mergedRects[j] = mergeRectangles(rects[i], mergedRects[j]);
                foundOverlap = true;
                break;
            }
        }

        if (!foundOverlap) {
            mergedRects.push(rects[i]);
        }
    }

    // Adjust heights for rectangles on the same line
    for (let i = 0; i < mergedRects.length; i++) {
        for (let j = i + 1; j < mergedRects.length; j++) {
            if (sameLine(mergedRects[i], mergedRects[j])) {
                const maxHeight = Math.max(mergedRects[i].height, mergedRects[j].height);
                mergedRects[i].height = maxHeight;
                mergedRects[j].height = maxHeight;
            }
        }
    }

    return mergedRects;
};

export default optimizeClientRects;
