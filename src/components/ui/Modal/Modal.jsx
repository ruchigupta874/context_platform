import PropTypes from 'prop-types';
import * as RadixDialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/Icon';
import styles from './Modal.module.css';

/**
 * Thin wrapper over Radix's dialog.
 *
 * Radix owns what is hard to get right by hand — focus trapping and
 * restoration, Escape, scroll locking, and marking the rest of the page
 * inert for screen readers. It ships no CSS, so everything visual below is
 * ours and reads from the same tokens as the rest of the app.
 *
 * The app imports this rather than Radix directly, so swapping the primitive
 * later stays a one-file change.
 */
export function Modal({ open, onOpenChange, children }) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  );
}

/** `asChild` lets the caller pass our own Button or any element as the trigger. */
export function ModalTrigger({ children }) {
  return <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>;
}

/** `title` is required: a dialog with no accessible name is announced as an unlabelled group. */
export function ModalContent({ children, title, description, size = 'md', onCloseAutoFocus }) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={styles.overlay} />
      <RadixDialog.Content
        className={[styles.content, styles[size]].join(' ')}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <header className={styles.header}>
          <div className={styles.headingGroup}>
            <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
            {description && (
              <RadixDialog.Description className={styles.description}>
                {description}
              </RadixDialog.Description>
            )}
          </div>
          <RadixDialog.Close className={styles.close} aria-label="Close">
            <Icon name="close" size={14} strokeWidth={1.8} />
          </RadixDialog.Close>
        </header>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

/** The scrolling middle. The header and footer stay put while this moves. */
export function ModalBody({ children, flush = false, className = '' }) {
  return (
    <div
      className={[styles.body, flush ? styles.bodyFlush : '', className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}

export function ModalFooter({ children }) {
  return <footer className={styles.footer}>{children}</footer>;
}

/** Closes the dialog without the caller having to thread `onOpenChange` down. */
export function ModalClose({ children }) {
  return <RadixDialog.Close asChild>{children}</RadixDialog.Close>;
}

Modal.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  children: PropTypes.node,
};

ModalTrigger.propTypes = { children: PropTypes.node.isRequired };

ModalContent.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  onCloseAutoFocus: PropTypes.func,
};

ModalBody.propTypes = {
  children: PropTypes.node,
  flush: PropTypes.bool,
  className: PropTypes.string,
};

ModalFooter.propTypes = { children: PropTypes.node };

ModalClose.propTypes = { children: PropTypes.node.isRequired };
