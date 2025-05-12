// Import React Hooks
import { useState, useEffect } from "react";

// Import Icons
import { PiSmileyXEyesFill } from "react-icons/pi";

// Import Bootstrap Components
import Container from "react-bootstrap/Container";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const Error = ({ onNavigate }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  // refresh the entire game after 4 secs
  useEffect(() => {
    setToastMessage("Reloading...");
    setToastType("error");
    setShowToast(true);
    const timer = setTimeout(() => {
      //onNavigate("landing");
      window.location.reload();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <>
      <Container
        fluid
        className="game-wrapper d-flex flex-column justify-content-center align-items-center"
      >
        <h1 className="text-white">Server connection lost.</h1>
        <p className="text-white">X _____ X</p>

        <ToastContainer position="top-center" className="p-4 mt-3">
          <Toast
            className={`custom-toast ${toastType}`}
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
          >
            <Toast.Body className="custom-toast-body">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {toastType === "error" && (
                  <PiSmileyXEyesFill
                    style={{
                      marginRight: "0.5rem",
                      fontSize: "1.5rem",
                      color: "var(--dark-red)",
                    }}
                  />
                )}
                {toastMessage}
              </div>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </>
  );
};

export default Error;
