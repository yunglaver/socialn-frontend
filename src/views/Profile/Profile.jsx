import styles from './Profile.module.scss';
import { useEffect, useState } from 'react';
import { loadAvatar } from '../../services/avatar.service.js';
import { BASE_API_URL } from '../../core/api.js';
import defaultAvatar from '../../assets/icons/default-avatar.svg';
import UploadAvatarModal from '../../components/Profile/UploadAvatarModal.jsx';

export default function Profile() {
  const [avatar, setAvatar] = useState(null);
  const [userName, setUserName] = useState(null);
  const [avatarKey, setAvatarKey] = useState(() => Date.now());

  const getAvatar = async () => {
    const result = await loadAvatar();
    setAvatar(result.userPic);
    setUserName(result.login);
    setAvatarKey(Date.now());
  };

  const avatarUrl = avatar
    ? `${BASE_API_URL}${avatar}_md.webp?v=${avatarKey}`
    : defaultAvatar;

  useEffect(() => {
    void getAvatar();
  }, []);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div
          className={styles.profileHeaderBg}
          style={{
            backgroundImage: avatar ? `url(${avatarUrl})` : 'none',
          }}
        />

        <div className={styles.headerContent}>
          <div className={styles.avatarWrapper}>
            <img
              className={styles.avatar}
              src={avatar ? `${avatarUrl}` : defaultAvatar}
              alt="avatar"
            />
            <UploadAvatarModal onUploadSuccess={getAvatar} />
          </div>

          <div className={styles.nameBar}>
            <span className={styles.userName}>{userName}</span>
          </div>
        </div>
      </div>
      <div className={styles.profileMain}>
        <div className={styles.profileButtons}>
          <button className={styles.profileButton}>button 1</button>
          <button className={styles.profileButton}>button 2</button>
          <button className={styles.profileButton}>button 3</button>
          <button className={styles.profileButton}>button 4</button>
        </div>
        <div className={styles.sendNewPost}>
          <textarea
            className={styles.textArea}
            placeholder="Enter your message here..."
          />
          <button className={styles.sendButton}>Send</button>
        </div>
      </div>
    </div>
  );
}
