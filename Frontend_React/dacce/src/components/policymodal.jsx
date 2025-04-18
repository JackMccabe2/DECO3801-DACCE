import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../css/policymodal.css";

function PolicyModal({ show, onClose, onConfirm }) {
  const [isChecked, setIsChecked] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Private Policy</Modal.Title>
      </Modal.Header>

      {/* Private Policy context generated by ChatGPT and refined by a human. */}
      <Modal.Body className="modal-body">
        <p>
          Welcome to Cool Hack Game! Your privacy is important to us. This
          Privacy Policy explains how we handle your information when you use
          our game.{" "}
          <p>
            <i>
              <u>Please read and agree to the policy before continuing.</u>
            </i>
          </p>
        </p>
        <ul>
          1. Age Recommendation
          <br />
          <li>
            Cool Hack Game is designed for users aged 18 and over. If you are
            under 18, we recommend that you seek permission from a parent or
            guardian before starting the game. By using the game, you confirm
            that you either: (1) &nbsp; Are 18 years of age or older, or
            (2)&nbsp;Have obtained permission from a parent or guardian.
          </li>
        </ul>
        <ul>
          2. Information We Collect
          <br />
          <li>
            At this stage of development, Cool Hack Game does not collect any
            personal data such as your legal name, email address, or location.
            However, we may collect non-identifiable usage data to help improve
            the game, such as: General gameplay statistics (e.g., number of
            sessions, performance)
          </li>
        </ul>
        <ul>
          3. How We Use Your Information
          <br />
          <li>
            We do not sell, share, or disclose your data to third parties. Any
            data collected will only be used to: (1)&nbsp; Improve game
            performance (2)&nbsp;Understand player interactions and enhance user
            experience (3)&nbsp; Fix bugs or issues.
          </li>
        </ul>
        <ul>
          4. Data Storage
          <br />
          <li>
            All data (if collected) is securely stored and only accessible by
            authorised members of the Cool Hack Game development team.
          </li>
        </ul>
        <ul>
          5. Contact Us
          <br />
          <li>
            If you have any questions or concerns, feel free to contact our team
            "DACCE".
          </li>
        </ul>

        <Form.Check
          type="checkbox"
          label="I agree to the terms and conditions."
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={!isChecked}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PolicyModal;
