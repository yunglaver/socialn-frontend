import styles from './Users.module.scss';
import { useUsersStore } from '../../stores/users.store.js';
import { BASE_API_URL } from '../../core/api.js';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect } from 'react';
import User from '../../components/Users/User';
import { useNavigate } from 'react-router-dom';
import { startChat } from '../../services/chat.service.js';
import defaultAvatar from '../../assets/icons/default-avatar.svg';

export default function Users() {
  const users = useUsersStore((s) => s.users) ?? [];
  const pageUsers = useUsersStore((s) => s.pageUsers);
  const hasMoreUsers = useUsersStore((s) => s.hasMoreUsers);
  const isLoadingUsers = useUsersStore((s) => s.isLoadingUsers);
  const fetchUsers = useUsersStore((s) => s.fetchUsers);

  const parentRef = useRef(null);

  const navigate = useNavigate();

  const handleStartChat = async (userId) => {
    const chat = await startChat(userId);

    navigate(`/m/chats/${chat.id}`);
  };
  useEffect(() => {
    void fetchUsers(1);
  }, [fetchUsers]);

  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    gap: 0,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;
    if (isLoadingUsers) return;
    if (!hasMoreUsers) return;

    if (lastItem.index >= users.length - 1) {
      void fetchUsers(pageUsers + 1);
    }
  }, [
    virtualItems,
    users.length,
    hasMoreUsers,
    isLoadingUsers,
    pageUsers,
    fetchUsers,
  ]);



  return (
      <div className={styles.container}>
        <div ref={parentRef} className={styles.parentScrollBlock}>
          <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
          >
            {virtualItems.map((virtualRow) => {
              const u = users[virtualRow.index];

              if (!u) return null;

              return (
                  <div
                      className={styles.users}
                      key={u.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                  >
                    <User
                        userName={u.login}
                        userAvatar={
                          u.userPic
                              ? `${BASE_API_URL}${u.userPic}_sm.webp`
                              : defaultAvatar
                        }
                        onClickToChat={() => {
                          void handleStartChat(u.id);
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