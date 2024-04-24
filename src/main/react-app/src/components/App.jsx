import Home from'./Home.jsx';
import LandingPage from './LandingPage.jsx';
import Demo from './Demo.jsx';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Viewer from "./Viewer.jsx";
import Navigation from "./Navigation";

import NotFound from "./404";
function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/demo/:pdfName" element={<Demo/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/view/:pdfName" element={<Viewer/>} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
            {/*    Footer  */}
        </Router>
    );
}

export default App;
