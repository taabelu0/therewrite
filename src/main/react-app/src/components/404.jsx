import React from 'react';
const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
            <h1>404 Not Found</h1>
            <p>The page you are looking for doesn't exist or has been moved.</p>
            <a href="/" style={{ textDecoration: 'none', color: 'blue' }}>Go Home</a>
        </div>
    );
}

export default NotFound;