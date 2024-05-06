import HoverLogo from "./annotations/icons/HoverLogo";
import Logo from "./annotations/icons/Logo";
import React, {useState} from "react";
import '../style/landingPage.scss';

function Navigation() {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <nav id="nav">
            <div className="landing-logo"
                 onMouseEnter={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}
            >
                {isHovered ? <HoverLogo/> : <Logo/>}
            </div>
        </nav>
    );
}

export default Navigation;