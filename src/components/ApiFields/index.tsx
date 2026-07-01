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
      {/*
        Always render children (hidden with CSS when collapsed) instead of
        unmounting them. This keeps the content in the DOM and the static HTML,
        matching native <details> behavior, so DOM-based markdown extractors
        (such as the "Copy page" / "View as Markdown" button) still capture it.
      */}
      <div className={open ? styles.content : styles.contentHidden}>
        {children}
      </div>
    </div>
  );
}
