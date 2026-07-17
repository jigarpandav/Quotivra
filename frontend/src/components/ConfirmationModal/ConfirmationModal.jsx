import React from "react";
import "./ConfirmationModal.css";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-overlay" role="dialog" aria-modal="true">
      <div className="confirmation-modal-card">
        <h2 className="confirmation-modal-title">{title}</h2>

        <p className="confirmation-modal-message">{message}</p>

        <div className="confirmation-modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="confirmation-modal-btn confirmation-modal-cancel"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="confirmation-modal-btn confirmation-modal-confirm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
