import styles from './AuthInput.module.scss';

export const AuthInput = ({
  type,
  placeholder,
  onKeyDown,
  ref,
  value,
  onChange,
}) => {
  return (
    <form className="input__container" onSubmit={(e) => e.preventDefault()}>
      <input
        type={type}
        placeholder={placeholder}
        className={styles.input}
        autoComplete="off"
        onKeyDown={onKeyDown}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </form>
  );
};
