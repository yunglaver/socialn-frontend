import UploadTrackModal from "../../components/Music/UploadMusic/UploadTrackModal.jsx";
import Song from "../../components/Music/Song/Song.jsx";
import { useAudioPlayerStore } from "../../stores/audioPlayerStore.js"
import styles from "./Music.module.scss";
import { useEffect } from "react";
import { BASE_API_URL } from "../../core/api.js";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export default function Music() {

    const mySongs = useAudioPlayerStore(s => s.mySongs);
    const allSongs = useAudioPlayerStore(s => s.allSongs);
    const currentTab = useAudioPlayerStore(s => s.currentTab);
    const playingId = useAudioPlayerStore(s => s.playingId);
    const isPlaying = useAudioPlayerStore(s => s.isPlaying);
    const setCurrentTab = useAudioPlayerStore(s => s.setCurrentTab);
    const setTrack = useAudioPlayerStore(s => s.setTrack);
    const togglePlay = useAudioPlayerStore(s => s.togglePlay);
    const fetchMyMusic = useAudioPlayerStore(s => s.fetchMyMusic);
    const fetchAllMusic = useAudioPlayerStore(s => s.fetchAllMusic);
    const fetchLikeSong = useAudioPlayerStore(s => s.fetchLikeSong);
    const fetchRemoveSong = useAudioPlayerStore(s => s.fetchRemoveSong);

    useEffect(() => {
        switch(currentTab){
            case 'my':
                void fetchMyMusic();

                break;
            case 'all':
                void fetchAllMusic();

                break;
        }
    }, [currentTab]);

    useEffect(() => {
        const [lastItem] = [...virtualItems].reverse();

        if (!lastItem) return;

        if (
            lastItem.index >= tracks.length - 1
        ) {
            // вызвать fetch следующей страницы
        }
    }, [virtualItems]);


    console.log('mySongs',mySongs)
    console.log('allSongs',allSongs)
    const parentRef = useRef(null);

    const tracks = currentTab === "my" ? mySongs : allSongs;

    const rowVirtualizer = useVirtualizer({
        count: tracks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 70, // высота одного Song (подгони)
        gap: 8,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    return (
        <div className={styles.container}>
            <UploadTrackModal onUploaded={fetchMyMusic} />
            <div
                className={styles.buttonContainer}
            >
                <button
                    className={`${styles.musicTabButton} ${currentTab === "my" ? styles.active : ''}`}
                    onClick={() => {setCurrentTab('my')}
                }
                >
                    My Music
                </button>
                <button

                    className={`${styles.musicTabButton} ${currentTab === "all" ? styles.active : ''}`}
                    onClick={() => setCurrentTab('all')}

                >
                    Other Music
                </button>
            </div>
            <div
                ref={parentRef}
                style={{
                    height: "600px",
                    overflow: "auto",
                }}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        position: "relative",
                    }}
                >
                    {virtualItems.map((virtualRow) => {
                        const s = tracks[virtualRow.index];
                        if (!s) return null;

                        return (
                            <div
                                key={s.id}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <Song
                                    key={s.id}
                                    artistName={s.artistName}
                                    songTitle={s.songTitle}
                                    isPlaying={playingId === s.id && isPlaying}
                                    coverPic={`${BASE_API_URL}${s.coverPic}_sm.webp`}
                                    onClick={() => {
                                        const tracks = currentTab === "my" ? mySongs : allSongs;
                                        useAudioPlayerStore.setState({
                                            currentPlaylist: tracks,
                                        });

                                        if (playingId !== s.id) {
                                            setTrack(s.id);
                                            useAudioPlayerStore.setState({ isPlaying: true });
                                        } else {
                                            togglePlay();
                                        }
                                    }}
                                    duration={s.duration}
                                    isLiked={s.isLiked}
                                    onClickSave={async () => {
                                        if (!s.isLiked) {
                                            await fetchLikeSong(s.id);
                                        } else {
                                            await fetchRemoveSong(s.id);
                                        }

                                        if (currentTab === 'my') {
                                            await fetchMyMusic();
                                        } else {
                                            await fetchAllMusic();
                                        }
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}









/*

import UploadTrackModal from "../../components/Music/UploadMusic/UploadTrackModal.jsx";
import Song from "../../components/Music/Song/Song.jsx";
import { useAudioPlayerStore } from "../../stores/audioPlayerStore.js"
import styles from "./Music.module.scss";
import { useEffect } from "react";
import { BASE_API_URL } from "../../core/api.js";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export default function Music() {

    const mySongs = useAudioPlayerStore(s => s.mySongs);
    const allSongs = useAudioPlayerStore(s => s.allSongs);
    const currentTab = useAudioPlayerStore(s => s.currentTab);
    const playingId = useAudioPlayerStore(s => s.playingId);
    const isPlaying = useAudioPlayerStore(s => s.isPlaying);
    const setCurrentTab = useAudioPlayerStore(s => s.setCurrentTab);
    const setTrack = useAudioPlayerStore(s => s.setTrack);
    const togglePlay = useAudioPlayerStore(s => s.togglePlay);
    const fetchMyMusic = useAudioPlayerStore(s => s.fetchMyMusic);
    const fetchAllMusic = useAudioPlayerStore(s => s.fetchAllMusic);
    const fetchLikeSong = useAudioPlayerStore(s => s.fetchLikeSong);
    const fetchRemoveSong = useAudioPlayerStore(s => s.fetchRemoveSong);

    useEffect(() => {
        switch(currentTab){
            case 'my':
                void fetchMyMusic();

                break;
            case 'all':
                void fetchAllMusic();

                break;
        }
    }, [currentTab]);


    console.log('mySongs',mySongs)
    console.log('allSongs',allSongs)
    const parentRef = useRef(null);

    const tracks = currentTab === "my" ? mySongs : allSongs;

    const rowVirtualizer = useVirtualizer({
        count: tracks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 70, // высота одного Song (подгони)
        gap: 8,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    return (
        <div className={styles.container}>
            <div
                className={styles.buttonContainer}
            >
                <button
                    className={`${styles.musicTabButton} ${currentTab === "my" ? styles.active : ''}`}
                    onClick={() => {setCurrentTab('my')}
                }
                >
                    My Music
                </button>
                <button

                    className={`${styles.musicTabButton} ${currentTab === "all" ? styles.active : ''}`}
                    onClick={() => setCurrentTab('all')}

                >
                    Other Music
                </button>
            </div>

            <div>
                <UploadTrackModal onUploaded={fetchMyMusic} />
                <div className={styles.songs}>
                    {(currentTab === "my" ? mySongs : allSongs).map((s) => (
                        <Song
                            key={s.id}
                            artistName={s.artistName}
                            songTitle={s.songTitle}
                            isPlaying={playingId === s.id && isPlaying}
                            coverPic={`${BASE_API_URL}${s.coverPic}_sm.webp`}
                            onClick={() => {
                                const tracks = currentTab === "my" ? mySongs : allSongs;
                                useAudioPlayerStore.setState({
                                    currentPlaylist: tracks,
                                });

                                if (playingId !== s.id) {
                                    setTrack(s.id);
                                    useAudioPlayerStore.setState({ isPlaying: true });
                                } else {
                                    togglePlay();
                                }
                            }}
                            duration={s.duration}
                            isLiked={s.isLiked}
                            onClickSave={async () => {
                                if (!s.isLiked) {
                                    await fetchLikeSong(s.id);
                                } else {
                                    await fetchRemoveSong(s.id);
                                }

                                if (currentTab === 'my') {
                                    await fetchMyMusic();
                                } else {
                                    await fetchAllMusic();
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

*/