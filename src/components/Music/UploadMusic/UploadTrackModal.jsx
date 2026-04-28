import { useState } from 'react';
import styles from './UploadTrackModal.module.scss';
import TrackFileStep from './TrackFileStep.jsx';
import TrackDetailsStep from './TrackDetailsStep.jsx';
import closeIcon from '../../../assets/icons/close.svg';
import { useAudioPlayerStore } from '../../../stores/audioplayer.store.js';

export default function UploadTrackModal() {
  const { fetchMyMusic } = useAudioPlayerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  const handleClose = () => {
    setIsModalOpen(false);
    setAudioFile(null);
    void fetchMyMusic();
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => setIsModalOpen(true)}
        className={styles.showModalButton}
      >
        Upload track
      </button>

      {isModalOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div onClick={(e) => e.stopPropagation()} className={styles.modal}>
            {!audioFile ? (
              <TrackFileStep
                onChange={(e) => setAudioFile(e.target.files[0])}
              />
            ) : (
              <TrackDetailsStep
                audioFile={audioFile}
                handleClose={handleClose}
              />
            )}

            <button onClick={handleClose} className={styles.closeModalButton}>
              <img src={closeIcon} alt="close-btn" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
