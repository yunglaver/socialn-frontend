import styles from "./Song.module.scss"
import playIcon from "../../../assets/icons/play.svg"
import pauseIcon from "../../../assets/icons/pause.svg"
import addSongIcon from "../../../assets/icons/addSongIcon.svg"
import addSongActiveIcon from "../../../assets/icons/addSongActiveIcon.svg"

export default function Song({ artistName, songTitle, isPlaying, onClick, onClickSave, coverPic, currentTab, isLiked, duration}){

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div className={styles.songContainer}>
            <button
                onClick={onClick}
                className={styles.button}
            >
                <div
                    className={styles.wrapper}
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
                </div>
            </button>
            <div
                className={styles.addSongWrapper}
            >
                <div>
                    <span>{formatted}</span>
                </div>
                <div>
                    <button
                        className={styles.addButton}
                        onClick={onClickSave}
                    >
                        <img
                            className={styles.addSongIcon}
                            src={isLiked ? addSongActiveIcon : addSongIcon}
                            alt="add-icon"
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}