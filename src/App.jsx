import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthView } from "./views/auth.jsx";
import { RegisterView } from "./views/register.jsx";

function App() {


  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<AuthView />} />
            <Route path="/auth" element={<AuthView />} />
            <Route path="/register" element={<RegisterView />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
