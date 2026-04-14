import styles from "./Song.module.scss"
import playIcon from "../../../assets/icons/play.svg"
import pauseIcon from "../../../assets/icons/pause.svg"

export default function Song({ artistName, songTitle, isPlaying, onClick, coverPic }){
    return (
        <div className={styles.songContainer}>
            <button
                onClick={onClick}
                className={styles.button}
            >
                <div className={styles.coverContainer}>
                    <img
                        src={coverPic}
                        className={styles.coverPic}
                        alt="cover-icon"
                    />
                    <img
                        src={isPlaying ? pauseIcon : playIcon}
                        className={styles.playerIcon}
                        alt="play-icon"
                    />
                </div>
                <div
                    className={styles.titleContainer}
                >
                    <span className={styles.songTitle}>{songTitle}</span>
                    <span className={styles.songArtistName}>{artistName}</span>
                </div>
            </button>
        </div>
    )
}