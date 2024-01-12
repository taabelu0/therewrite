import Navigation from './Navigation.jsx';
import Home from'./Home.jsx';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Viewer from "./Viewer.jsx";
import NotFound from "./404";
function App() {

    return (
        <Router>
            <Navigation/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/view/:pdfName" element={<Viewer/>} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
            {/*    Footer  */}
        </Router>
    );
}

export default App;
