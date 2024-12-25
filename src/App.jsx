import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import {LogReg} from "./components/LogReg.jsx";
import {AccountsList} from "./components/MyAccounts.jsx";


function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<LogReg/>}/>
                    <Route path="/my/accounts" element={<AccountsList/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App