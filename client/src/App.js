import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Message from "./pages/Message";
function App() {
  return (
    <div className="App"> 
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/message" element={<Message />}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
