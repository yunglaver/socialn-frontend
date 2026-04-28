export default function FormatMessageTime(input) {
  const date = new Date(input);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfMessageDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffInMs = startOfToday.getTime() - startOfMessageDay.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays >= 0 && diffInDays < 7) {
    return new Intl.DateTimeFormat('ru-RU', {
      weekday: 'short',
    }).format(date);
  }

  const isSameYear = date.getFullYear() === now.getFullYear();

  if (isSameYear) {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date);
}
