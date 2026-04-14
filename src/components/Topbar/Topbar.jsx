import styles from "./Topbar.module.scss"
import globeIcon from "../../assets/icons/globe.svg"
import AudioPlayer from "../Music/AudioPlayer/AudioPlayer.jsx"

export default function Navbar(){
    return (
        <div
            className={styles.topbar}
        >
            <div
                className={styles.logoContainer}
            >
                <img
                    className={styles.globeIcon}
                    src={globeIcon}
                    alt="globe-icon"
                />
                <span
                    className={styles.logoText}
                >
                    SocialN
                </span>
            </div>
            <AudioPlayer/>
        </div>
    )
}

