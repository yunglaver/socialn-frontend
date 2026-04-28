import styles from './TrackDetailsStep.module.scss';

import { uploadMusic } from '../../../services/music.service.js';
import { useRef, useState, useEffect } from 'react';

export default function TrackDetailsStep({ audioFile, handleClose }) {
  const [coverFile, setCoverFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [artistName, setArtistName] = useState('');
  const [songTitle, setSongTitle] = useState('');

  useEffect(() => {
    songTitleRef.current?.focus();
  }, []);

  const artistNameRef = useRef(null);
  const songTitleRef = useRef(null);

  const handleUpload = async (
    audioFile,
    coverFile,
    artistName,
    songTitle,
    isPublic,
  ) => {
    if (!audioFile) return;
    try {
      await uploadMusic(audioFile, artistName, songTitle, coverFile, isPublic);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.audioFileInfo}>
        <span>filename: {audioFile.name}</span>
      </div>
      <div className={styles.inputsWrapper}>
        <label>
          <span>Title:</span>
          <input
            className={styles.infoInput}
            type="text"
            ref={songTitleRef}
            onChange={(e) => setSongTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                artistNameRef.current.focus();
              }
            }}
          />
        </label>
        <label>
          <span>Artist:</span>
          <input
            className={styles.infoInput}
            type="text"
            onChange={(e) => setArtistName(e.target.value)}
            ref={artistNameRef}
          />
        </label>
        <label>
          <span>Cover Art:</span>
          <input
            type="file"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className={styles.coverFileInput}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic((prev) => !prev)}
          />
          <span>Set public visibility</span>
        </label>
      </div>

      <button
        className={styles.uploadButton}
        onClick={() =>
          handleUpload(
            audioFile,
            coverFile,
            artistName,
            songTitle,
            isPublic,
            handleClose,
          )
        }
      >
        Upload
      </button>
    </div>
  );
}
