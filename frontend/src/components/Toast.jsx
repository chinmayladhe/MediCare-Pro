import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1060 }}>
      <div className={`toast show align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">
            <i className={`bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
            {message}
          </div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose} aria-label="Close"></button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
