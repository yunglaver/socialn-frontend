import { BASE_API_URL } from "../../../core/api.js";
import { useAudioPlayerStore } from "../../../stores/audioPlayerStore.js";
import { useEffect, useRef, useState } from "react";

import styles from "./AudioPlayer.module.scss";
import pauseIcon from "../../../assets/icons/playerPause.svg";
import playIcon from "../../../assets/icons/playerPlay.svg";
import prevIcon from "../../../assets/icons/playerPrev.svg";
import nextIcon from "../../../assets/icons/playerNext.svg";
import defaultCoverIcon from "../../../assets/icons/defaultCoverPic.svg";

export default function AudioPlayer() {



    const audioRef = useRef(null);


    const currentPlaylist = useAudioPlayerStore(e => e.currentPlaylist);
    const currentTab = useAudioPlayerStore(e => e.currentTab);
    const playingId = useAudioPlayerStore(e => e.playingId);
    const isPlaying = useAudioPlayerStore(e => e.isPlaying);
    const togglePlay = useAudioPlayerStore(e => e.togglePlay);
    const setTrack = useAudioPlayerStore(e => e.setTrack);

    useEffect(() => {
        if (!currentPlaylist.length) return;

        const saved = JSON.parse(localStorage.getItem("player"));

        if (saved?.playingId) {
            setTrack(saved.playingId);
        }

    }, []);


    const [progress, setProgress] = useState(0);
    // текущее время трека (для UI)

    const [duration, setDuration] = useState(0);
    // длительность трека

    const currentIndex = currentPlaylist.findIndex(t => t.id === playingId);
    // индекс текущего трека в массиве

    const currentTrack = currentPlaylist.find(t => t.id === playingId);
    // сам текущий трек (объект)

    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;
        // если аудио или трек не готовы — выходим

        const audio = audioRef.current;
        // берём сам <audio>

        audio.src = `${BASE_API_URL}/uploads/music/audio/${currentTrack.filename}`;
        // подставляем путь к файлу

        audio.onloadeddata = () => {
            // это событие срабатывает когда файл реально загрузился

            const saved = JSON.parse(localStorage.getItem("player"));


            if (saved && saved.playingId === playingId) {
                audio.currentTime = saved.time;

            } else {
                audio.currentTime = 0;
            }
            // если это тот же трек → ставим позицию
            // иначе сбрасываем в начало
        };

    }, [playingId]);
    // этот эффект срабатывает когда меняется текущий трек

    useEffect(() => {
        if (!audioRef.current) return;
        // если аудио нет — ничего не делаем

        const audio = audioRef.current;

        if (isPlaying) {
            audio.play().catch(() => {});
        } else {
            audio.pause();

        }
        // если isPlaying true → play
        // если false → pause
        // catch нужен потому что браузер может запретить autoplay

    }, [playingId, isPlaying]);
    // реагируем только на изменение состояния воспроизведения

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let lastSaved = 0;

        const handleTimeUpdate = () => {
            if (!currentTrack) return;

            const time = audio.currentTime;

            // обновляем UI
            setProgress(time);
            setDuration(audio.duration || 0);

            // сохраняем раз в 1 секунду
            const now = Date.now();
            if (now - lastSaved > 1000) {
                localStorage.setItem("player", JSON.stringify({
                    playingId,
                    time,
                    currentTab
                }));
                lastSaved = now;
            }
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
        };

    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            next();
        };
        // когда трек закончился → вызываем next()

        audio.addEventListener("ended", handleEnded);
        // подписываемся на событие окончания

        return () => {
            audio.removeEventListener("ended", handleEnded);
        };
        // отписка при обновлении

    }, [currentPlaylist, playingId]);
    // зависимость — треки или текущий трек

    const next = () => {
        if (!currentPlaylist.length || currentIndex === -1) return;

        const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        // предыдущий трек (с циклом)

        setTrack(currentPlaylist[prevIndex].id);
        // ставим его

        useAudioPlayerStore.setState({ isPlaying: true });
        // включаем воспроизведение

    };

    const prev = () => {
        if (!currentPlaylist.length || currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % currentPlaylist.length;
        // берём следующий индекс (циклически)

        setTrack(currentPlaylist[nextIndex].id);
        // ставим новый трек

        useAudioPlayerStore.setState({ isPlaying: true });
        // вручную включаем play
    };

    const handleSeek = (e) => {
        if (!audioRef.current) return;

        const time = e.target.value;
        // время из input range

        audioRef.current.currentTime = time;
        // перематываем аудио

        setProgress(time);
        // обновляем UI
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
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}