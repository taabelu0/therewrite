import '../style/basic.css';
import '../style/list.css';
import '../style/customDropZone.min.css';
import Navigation from './Navigation.jsx';
import Home from'./Home.jsx';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Viewer from "./Viewer.jsx";

function App() {

    return (
        <Router>
            <Navigation/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/view/:pdfName" element={<Viewer />} />
            </Routes>
            {/*    Footer  */}
        </Router>
    );
}

export default App;
