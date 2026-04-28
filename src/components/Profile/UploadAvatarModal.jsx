import { useState } from 'react';
import styles from './UploadAvatarModal.module.scss';
import closeIcon from '../../assets/icons/close.svg';
import { uploadAvatar } from '../../services/avatar.service.js';
import editAvatar from '../../assets/icons/edit-avatar.svg';

export default function UploadAvatarModal({ onUploadSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  const handleClose = () => {
    setIsModalOpen(false);
    setPhotoFile(null);
  };

  const handleUpload = async () => {
    if (!photoFile) return;

    const formData = new FormData();
    formData.append('photo', photoFile);

    const data = await uploadAvatar(formData);

    if (data.userPic) {
      setIsModalOpen(false);
      setPhotoFile(null);
      await onUploadSuccess?.();
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.avatarEditButton}
        onClick={() => setIsModalOpen(true)}
      >
        <img
          className={styles.avatarEditPic}
          src={editAvatar}
          alt="edit-avatar"
        />
      </button>

      {isModalOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div onClick={(e) => e.stopPropagation()} className={styles.modal}>
            <form
              id="uploadAvatarForm"
              onSubmit={(e) => {
                e.preventDefault();
                void handleUpload();
              }}
            >
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              />

              <button
                type="submit"
                className={styles.uploadButton}
                disabled={!photoFile}
              >
                Upload
              </button>
            </form>

            <button onClick={handleClose} className={styles.closeModalButton}>
              <img src={closeIcon} alt="close-btn" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
