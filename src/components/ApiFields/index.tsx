import React, {useState, type ReactNode} from 'react';
import styles from './styles.module.css';

interface FieldsProps {
  children: ReactNode;
  /** Word(s) shown after "Show"/"Hide". Defaults to "fields". */
  label?: string;
}

/**
 * Collapsible disclosure used in the JSON-RPC API reference to hide nested
 * object fields. Mimics a native `<details>` element but renders a subtle,
 * Stripe-style toggle ("Show fields" / "Hide fields") and is nestable.
 */
export default function Fields({
  children,
  label = 'fields',
}: FieldsProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.fields}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={open ? `${styles.icon} ${styles.iconOpen}` : styles.icon}
          aria-hidden="true"
        >
          +
        </span>
        {open ? `Hide ${label}` : `Show ${label}`}
      </button>
      {open && <div className={styles.content}>{children}</div>}
    </div>
  );
}
