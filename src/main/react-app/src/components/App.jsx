import Home from'./Home.jsx';
import LandingPage from './LandingPage.jsx';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Viewer from "./Viewer.jsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/view/:pdfName" element={<Viewer/>} />
            </Routes>
            {/*    Footer  */}
        </Router>
    );
}

export default App;
