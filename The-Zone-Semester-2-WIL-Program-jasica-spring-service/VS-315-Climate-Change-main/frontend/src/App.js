import Homepage from "./Pages/Homepage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Define the main routing structure of the application
function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' exact element={<Homepage />} />
            </Routes>
        </Router>
    );
}

export default App;
