import { useId } from 'react';
import PropTypes from 'prop-types';
import styles from './Field.module.css';

/**
 * Labelled text input.
 *
 * One component rather than an Input and a Textarea: the label, the optional
 * marker, the hint and the error all sit in the same place either way, and the
 * only thing that actually changes is the tag. `onChange` receives the string,
 * not the event — the same contract as SearchInput.
 */
export default function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  optional = false,
  multiline = false,
  rows = 3,
  maxLength,
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const Control = multiline ? 'textarea' : 'input';

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {optional && <span className={styles.optional}>optional</span>}
      </label>

      <Control
        id={id}
        className={[
          styles.control,
          multiline ? styles.textarea : '',
          error ? styles.controlError : '',
        ]
          .filter(Boolean)
          .join(' ')}
        type={multiline ? undefined : 'text'}
        rows={multiline ? rows : undefined}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />

      {(error || hint) && (
        <p
          id={hintId}
          className={[styles.hint, error ? styles.hintError : ''].filter(Boolean).join(' ')}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.string,
  optional: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
};
