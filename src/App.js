import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import Interview from './pages/Interview';
import Terms from './pages/Terms';
import Chat from './components/Chat'

function App() {
  // const socket = io('', {
  //   rejectUnauthorized: false
  // })

  return (
      <Router>
        <Routes>
          <Route exact path="/:chatID" element={<Interview />} />
          <Route exact path="/chattest" element={<Chat />} />
          <Route exact path="/terms" element={<Terms />} />
        </Routes>
      </Router>
  );
}

export default App;