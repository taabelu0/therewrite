import '../style/basic.css';
import '../style/list.css';
import '../style/customDropZone.min.css';
import '../style/index.css';
import Navigation from './Navigation.jsx';
import Home from'./Home.jsx';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Viewer from "./Viewer.jsx";

function App() {

    return (
        <Router>
            <Navigation/>
            <section id="content">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/viewer" element={<Viewer/>}/>
                </Routes>
            </section>
            {/*    Footer  */}
        </Router>
    );
}

export default App;
