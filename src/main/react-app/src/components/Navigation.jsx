import { useNavigate } from 'react-router-dom';
import HoverLogo from "./annotations/icons/HoverLogo";
import Logo from "./annotations/icons/Logo";
import { useLocation } from 'react-router-dom';
import ShareIcon from './annotations/icons/ShareIcon';
import React, { useState } from "react";
import '../style/landingPage.scss';

function Navigation() {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    const shouldShowShareIcon = () => {
        const path = location.pathname;
        return path !== '/' && path !== '/home';
    };

    const handleLogoClick = () => {
        navigate('/home');
    };

    return (
        <nav id="nav">
            <div className="landing-logo"
                 onMouseEnter={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}
                 onClick={handleLogoClick}
            >
                {isHovered ? <HoverLogo/> : <Logo/>}
            </div>
            {shouldShowShareIcon() && <div className="share-icon"><ShareIcon /></div>}
        </nav>
    );
}

export default Navigation;
