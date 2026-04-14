import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthView } from "./views/Auth/Auth.jsx";
import { RegisterView } from "./views/Auth/Register.jsx";
import { useEffect } from "react";
import { connectSocket } from "./core/socket.js";
import Layout from "./views/Layout/Layout.jsx";
import Chats from "./views/Chats/Chats.jsx";
import Users from "./views/Users/Users.jsx";
import Profile from "./views/Profile/Profile.jsx";
import Messages from "./views/Messages/Messages.jsx";
import Music from "./views/Music/Music.jsx"

function App() {

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            connectSocket();
        }
    }, []);

    return (
        <BrowserRouter>
            <Routes>

                {/* auth */}
                <Route path="/" element={<AuthView />} />
                <Route path="/auth" element={<AuthView />} />
                <Route path="/register" element={<RegisterView />} />


                <Route path="/m" element={<Layout />}>

                    <Route path="profile" element={<Profile />} />
                    <Route path="users" element={<Users />} />
                    <Route path="music" element={<Music />} />

                    <Route path="chats" element={<Chats />}>


                        <Route index element={<div>Select chat</div>} />


                        <Route path=":chatId" element={<Messages />} />

                    </Route>

                    <Route index element={<Navigate to="chats" replace />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;