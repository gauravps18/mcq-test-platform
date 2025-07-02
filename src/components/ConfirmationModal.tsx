import React, { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'warning' | 'danger' | 'info' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
  size = 'md',
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'fas fa-exclamation-triangle',
          iconClass: 'text-danger',
          buttonClass: 'btn-danger',
          bgClass: 'bg-danger-subtle',
          borderClass: 'border-danger-subtle',
        };
      case 'info':
        return {
          icon: 'fas fa-info-circle',
          iconClass: 'text-info',
          buttonClass: 'btn-info',
          bgClass: 'bg-info-subtle',
          borderClass: 'border-info-subtle',
        };
      case 'success':
        return {
          icon: 'fas fa-check-circle',
          iconClass: 'text-success',
          buttonClass: 'btn-success',
          bgClass: 'bg-success-subtle',
          borderClass: 'border-success-subtle',
        };
      default:
        return {
          icon: 'fas fa-exclamation-triangle',
          iconClass: 'text-warning',
          buttonClass: 'btn-warning',
          bgClass: 'bg-warning-subtle',
          borderClass: 'border-warning-subtle',
        };
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'modal-sm';
      case 'lg':
        return 'modal-lg';
      default:
        return '';
    }
  };

  const config = getVariantConfig();

  return (
    <div
      className="modal fade show d-block confirmation-modal"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className={`modal-dialog modal-dialog-centered ${getSizeClass()}`}>
        <div
          className={`modal-content shadow-lg ${config.borderClass}`}
          style={{
            borderRadius: '12px',
            animation: 'modalSlideIn 0.3s ease-out',
            transform: 'scale(1)',
          }}
        >
          <div
            className={`modal-header ${config.bgClass} border-0`}
            style={{
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              padding: '1.5rem',
            }}
          >
            <h5
              className={`modal-title d-flex align-items-center ${config.iconClass}`}
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: 0,
              }}
            >
              <i className={`${config.icon} me-3`} style={{ fontSize: '1.5rem' }}></i>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCancel}
              style={{
                filter: 'brightness(0.8)',
                opacity: 0.8,
              }}
            ></button>
          </div>
          <div
            className="modal-body"
            style={{
              padding: '2rem 1.5rem',
              fontSize: '1rem',
              lineHeight: '1.6',
            }}
          >
            <p className="mb-0" style={{ color: '#e0e0e0' }}>
              {message}
            </p>
          </div>
          <div
            className="modal-footer border-0"
            style={{
              padding: '1rem 1.5rem 1.5rem',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              gap: '12px',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              style={{
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`btn ${config.buttonClass}`}
              onClick={onConfirm}
              style={{
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
