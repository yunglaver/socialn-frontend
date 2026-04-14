import UploadTrackModal from "../../components/Music/UploadMusic/UploadTrackModal.jsx";
import Song from "../../components/Music/Song/Song.jsx";
import { useAudioPlayerStore } from "../../stores/audioPlayerStore.js"
import styles from "./Music.module.scss";
import { useState, useEffect } from "react";
import { BASE_API_URL } from "../../core/api.js";
import { shallow } from 'zustand/shallow';

export default function Music() {

    const mySongs = useAudioPlayerStore(s => s.mySongs);
    const allSongs = useAudioPlayerStore(s => s.allSongs);
    const currentPlaylist = useAudioPlayerStore(s => s.currentPlaylist);
    const currentTab = useAudioPlayerStore(s => s.currentTab);
    const playingId = useAudioPlayerStore(s => s.playingId);
    const isPlaying = useAudioPlayerStore(s => s.isPlaying);
    const setCurrentTab = useAudioPlayerStore(s => s.setCurrentTab);
    const setTrack = useAudioPlayerStore(s => s.setTrack);
    const togglePlay = useAudioPlayerStore(s => s.togglePlay);
    const fetchMyMusic = useAudioPlayerStore(s => s.fetchMyMusic);
    const fetchAllMusic = useAudioPlayerStore(s => s.fetchAllMusic);

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
                {currentTab === "my" ? <UploadTrackModal onUploaded={fetchMyMusic} /> : ''}
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
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
