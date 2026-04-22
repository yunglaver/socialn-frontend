import { BASE_API_URL } from "../../../core/api.js";
import { useAudioPlayerStore } from "../../../stores/audioplayer.store.js";
import { useEffect, useRef, useState } from "react";
import styles from "./AudioPlayer.module.scss";
import pauseIcon from "../../../assets/icons/playerPause.svg";
import playIcon from "../../../assets/icons/playerPlay.svg";
import prevIcon from "../../../assets/icons/playerPrev.svg";
import nextIcon from "../../../assets/icons/playerNext.svg";
import defaultCoverIcon from "../../../assets/icons/defaultCoverPic.webp";

export default function AudioPlayer() {
    const audioRef = useRef(null);
    const currentPlaylist = useAudioPlayerStore(e => e.currentPlaylist);
    const currentTab = useAudioPlayerStore(e => e.currentTab);
    const playingId = useAudioPlayerStore(e => e.playingId);
    const isPlaying = useAudioPlayerStore(e => e.isPlaying);
    const togglePlay = useAudioPlayerStore(e => e.togglePlay);
    const setTrack = useAudioPlayerStore(e => e.setTrack);
    const lastSavedRef = useRef(0);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {


        const saved = JSON.parse(localStorage.getItem("player"));

        if (saved?.playingId) {
            setTrack(saved.playingId);
            useAudioPlayerStore.setState({
                currentPlaylist: saved.currentPlaylist,
            });
        }

    }, []);

    const currentIndex = currentPlaylist.findIndex(t => t.id === playingId);
    const currentTrack = currentPlaylist.find(t => t.id === playingId);
    const percent = duration ? (progress / duration) * 100 : 0;

    const next = () => {
        if (!currentPlaylist.length || currentIndex === -1) return;
        const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        setTrack(currentPlaylist[prevIndex].id);
        useAudioPlayerStore.setState({ isPlaying: true });
    };

    const prev = () => {
        if (!currentPlaylist.length || currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % currentPlaylist.length;
        setTrack(currentPlaylist[nextIndex].id);
        useAudioPlayerStore.setState({ isPlaying: true });
    };

    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;
        const audio = audioRef.current;
        audio.src = `${BASE_API_URL}/uploads/music/audio/${currentTrack.filename}`;

        audio.onloadedmetadata = () => {
            const saved = JSON.parse(localStorage.getItem("player"));
            if (saved && saved.playingId === playingId) {
                audio.currentTime = saved.time;
            } else {
                audio.currentTime = 0;
            }
        };

    }, [playingId]);

    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        if (isPlaying) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    }, [playingId, isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack) return;
        const save = () => {
            const time = audio.currentTime;
            const now = Date.now();

            if ((now - lastSavedRef.current > 1000) && isPlaying) {
                localStorage.setItem("player", JSON.stringify({
                    playingId,
                    time,
                    currentTab,
                    currentPlaylist
                }));
                lastSavedRef.current = now;

            }
        };
        audio.addEventListener("timeupdate", save);

        return () => audio.removeEventListener("timeupdate", save);
    }, [currentTrack, isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack) return;

        const handleTimeUpdate = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
    }, [currentTrack, isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            next();
        };

        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("ended", handleEnded);
        };

    }, [currentPlaylist, playingId]);

    const handleSeek = (e) => {
        if (!audioRef.current) return;
        const time = e.target.value;
        audioRef.current.currentTime = time;
        setProgress(time);
    };

    return (
        <div className={styles.container}>
            <audio ref={audioRef} />

            <div className={styles.controls}>
                <button onClick={prev} className={styles.playerButton}>
                    <img src={prevIcon} alt="prev-track" />
                </button>

                <button onClick={togglePlay} className={styles.playerButton}>
                    <img src={isPlaying ? pauseIcon : playIcon} alt="play-pause" />
                </button>

                <button onClick={next} className={styles.playerButton}>
                    <img src={nextIcon} alt="next-track" />
                </button>
            </div>

            <div className={styles.playerTrackContainer}>
                <div className={styles.trackInfo}>
                    <img
                        src={currentTrack ? `${BASE_API_URL}${currentTrack.coverPic}_sm.webp` : defaultCoverIcon}
                        alt="cover-pic"
                        className={styles.playerCoverPic}
                    />

                    <div className={styles.trackInfoText}>
                        <span className={styles.songTitle}>
                            {currentTrack ? currentTrack.songTitle : ""}
                        </span>

                        <span className={styles.artistName}>
                            {currentTrack ? currentTrack.artistName : ""}
                        </span>

                        <input
                            className={styles.audioProgress}
                            type="range"
                            min="0"
                            step="0.01"
                            max={duration || 0}
                            value={progress}
                            onChange={handleSeek}
                            style={{
                                background: `linear-gradient(to right, white ${percent}%, rgba(71, 71, 71, 0.34) ${percent}%)`
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}