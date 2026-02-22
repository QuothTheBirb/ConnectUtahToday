"use client";

import {ReactNode, useEffect} from "react";
import styles from './Popup.module.scss';

export type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  overlayClassName?: string;
  bodyClassName?: string;
}

export const Popup = (
  {
    isOpen,
    onClose,
    title,
    children,
    footer,
    className,
    overlayClassName,
    bodyClassName,
  }: PopupProps
) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`${styles.popupOverlay} ${overlayClassName || ''} ${styles.visible}`}
        onClick={onClose}
      />
      <div
        className={`${styles.popupPopover} ${className || ''} ${styles.visible}`}
      >
        {(title) && (
          <div className={styles.popoverHeader}>
            <div className={styles.popoverHeaderFlex}>
              {title && <h2 className={styles.popoverTitle}>{title}</h2>}
              {onClose && (
                <button
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        )}
        <div className={`${styles.popoverBody} ${bodyClassName || ''}`}>
          {children}
          {footer && (
            <div className={styles.popoverFooter}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
