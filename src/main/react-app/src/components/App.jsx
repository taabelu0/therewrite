import Home from'./Home.jsx';
import LandingPage from './LandingPage.jsx';
import Login from './Login.jsx';
import Registration from "./Registration";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Viewer from "./Viewer.jsx";
import Navigation from "./Navigation";

import NotFound from "./404";
function App() {

    const isLandingPage = window.location.pathname === '/';
    const renderNavigation = !isLandingPage ? <Navigation /> : null;

    return (
        <Router>
            {renderNavigation}
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/view/:pdfName" element={<Viewer/>} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
            {/*    Footer  */}
        </Router>
    );
}

export default App;