import styles from "./Layout.module.scss";
import { Button } from "../../components/Layout/Buttons/Button.jsx"
import Topbar from "../../components/Topbar/Topbar.jsx"
import { logoutService } from '../../services/auth.services.js'
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {useEffect} from "react";

import usersIcon from "../../assets/icons/users.svg"
import musicIcon from "../../assets/icons/music.svg"
import chatsIcon from "../../assets/icons/chats.svg"
import profileIcon from "../../assets/icons/profile.svg"
import logoutIcon from "../../assets/icons/logout.svg"
import {useAudioPlayerStore} from "../../stores/audioPlayerStore.js";

export default function Layout() {



    const location = useLocation()
    const navigate = useNavigate()

    async function handleLogout() {
        await logoutService()
        navigate("/")
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.main__wrapper}>
                <Topbar

                />
                <div
                    className={styles.contentWrapper}
                >
                    <nav className={styles.sidebar}>
                        <Button
                            text="Profile"
                            onClick={() => navigate("/m/profile")}
                            isActive={location.pathname === "/m/profile"}
                            iconSrc={profileIcon}
                            iconAlt="profile"
                        />
                        <Button
                            text="Users"
                            onClick={() => navigate("/m/users")}
                            isActive={location.pathname === "/m/users"}
                            iconSrc={usersIcon}
                            iconAlt="users"
                        />
                        <Button
                            text="Music"
                            onClick={() => navigate("/m/music")}
                            isActive={location.pathname === "/m/music"}
                            iconSrc={musicIcon}
                            iconAlt="users"
                        />
                        <Button
                            text="Chats"
                            onClick={() => navigate("/m/chats")}
                            isActive={location.pathname === "/m/chats"}
                            iconSrc={chatsIcon}
                            iconAlt="chats"
                        />
                        <Button
                            text="Logout"
                            onClick={handleLogout}
                            iconSrc={logoutIcon}
                            iconAlt="logout"
                        />
                    </nav>

                    <div className={styles.content}>
                        <Outlet/>
                    </div>
                </div>
            </div>
        </div>
    )
}