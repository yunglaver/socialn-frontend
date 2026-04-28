import styles from './Message.module.scss';

import incomingTailIcon from '../../assets/icons/incoming-tail.svg';
import outgoingTailIcon from '../../assets/icons/outgoing-tail.svg';

export default function Message({ messageText, isOutgoing, messageTime }) {
  function formatTime(time) {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(time));
  }

  return (
    <div
      className={`${styles.messageArea} ${isOutgoing ? styles.areaOutgoing : styles.areaIncoming}`}
    >
      {isOutgoing ? (
        <>
          <div
            className={`${styles.messageContainer} ${styles.containerOutgoing}`}
          >
            <div className={styles.textContainer}>
              <span className={styles.messageText}>{messageText}</span>
              <span className={styles.messageTime}>
                {formatTime(messageTime)}
              </span>
            </div>
          </div>

          <img
            src={outgoingTailIcon}
            alt="msg-tail"
            className={`${styles.messageTail} ${styles.tailOutgoing}`}
          />
        </>
      ) : (
        <>
          <img
            src={incomingTailIcon}
            alt="msg-tail"
            className={`${styles.messageTail} ${styles.tailIncoming}`}
          />

          <div
            className={`${styles.messageContainer} ${styles.containerIncoming}`}
          >
            <div className={styles.textContainer}>
              <span className={styles.messageText}>{messageText}</span>
              <span className={styles.messageTime}>
                {formatTime(messageTime)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
