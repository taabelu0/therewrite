// LandingPage.jsx
import React, {useState} from 'react';
import '../style/landingPage.scss';
import Logo from "./annotations/icons/Logo";
import HoverLogo from "./annotations/icons/HoverLogo";

function LandingPage() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="landing-container">
            <div className="landing-header">
                <div className="landing-logo"
                     onMouseEnter={() => setIsHovered(true)}
                     onMouseLeave={() => setIsHovered(false)}
                >
                    {isHovered ? <HoverLogo/> : <Logo/>}
                </div>
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
