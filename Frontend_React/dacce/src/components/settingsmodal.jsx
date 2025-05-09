// Import React Hooks
import { useState } from "react";

// Import Bootstrap Components
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "../css/policymodal.css";

function SettingsModal({ show, onClose, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body">
        <div></div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onConfirm(isChecked)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingsModal;
