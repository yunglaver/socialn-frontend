import UploadTrackModal from "../../components/Music/UploadMusic/UploadTrackModal.jsx";
import Song from "../../components/Music/Song/Song.jsx";
import { useAudioPlayerStore } from "../../stores/audioplayer.store.js"
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
    const pageMy = useAudioPlayerStore(s => s.pageMy);
    const pageAll = useAudioPlayerStore(s => s.pageAll);
    const hasMoreMy = useAudioPlayerStore(s => s.hasMoreMy);
    const hasMoreAll = useAudioPlayerStore(s => s.hasMoreAll);
    const setPageMy = useAudioPlayerStore(s => s.setPageMy);
    const setPageAll = useAudioPlayerStore(s => s.setPageAll);
    const tracks = currentTab === "my" ? mySongs : allSongs;


    const parentRef = useRef(null);

    const rowVirtualizer = useVirtualizer({
        count: tracks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 70,
        gap: 8,
    });

    const virtualItems = rowVirtualizer.getVirtualItems()

    useEffect(() => {
        switch(currentTab){
            case 'my':
                setPageMy(1);
                void fetchMyMusic(1);
                break;
            case 'all':
                setPageAll(1);
                void fetchAllMusic(1);
                break;
        }
    }, [currentTab]);


    useEffect(() => {
        const lastItem = virtualItems[virtualItems.length - 1];
        if (!lastItem) return;

        if (lastItem.index >= tracks.length - 1) {

            if (currentTab === "my" && hasMoreMy) {
                const nextPage = pageMy + 1;
                setPageMy(nextPage);
                void fetchMyMusic(nextPage);
            }

            if (currentTab === "all" && hasMoreAll) {
                const nextPage = pageAll + 1;
                setPageAll(nextPage);
                void fetchAllMusic(nextPage);
            }
        }
    }, [virtualItems]);

    return (
        <div className={styles.container}>
            <UploadTrackModal
                onUploaded={() => {
                    setPage(1);
                    if (currentTab === "my") {
                        void fetchMyMusic(1);
                    } else {
                        void fetchAllMusic(1);
                    }
                }}
            />
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
                className={styles.parentScrollBlock}
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
                                className={styles.songs}
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