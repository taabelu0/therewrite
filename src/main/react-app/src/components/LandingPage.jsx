// LandingPage.jsx
import React from 'react';
import '../style/landingPage.scss';

function LandingPage() {
    return (
        <div className="landing-container">
            <div className="landing-header">
                <h1>The Rewrite</h1>
                <a href="/login" className="login-text">
                    Log In
                </a>
            </div>
            <div className="landing-text">
                <h2>Annotate creatively</h2>
                <p>
                    Collectively annotate and diversify literature through discussions.
                </p>
                <a href="/registration" className="signup-button">
                    Sign Up
                </a>
            </div>
        </div>
    );
}

export default LandingPage;
