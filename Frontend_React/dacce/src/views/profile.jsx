// Import Bootstrap components
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Import Chart.js components
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Import CSS
import "../css/profile.css";

// Import Assets
import CancelBtn from "../assets/cancel.png";
import ProfilePic from "../assets/profile.png";

import btnCloseSound from "../assets/music/button_close.mp3";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      min: 0,
      max: 100,
    },
  },
};

const labels = ["Firewall Skill", "Encipher Skill"];

// Run npm install first to run chart.js library
// Data can be replaced with the actual data from the database
const data = {
  labels,
  datasets: [
    {
      data: [40, 10], // Change value here
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const Profile = ({ onNavigate }) => {
  return (
    <>
      <Container className="custom-profile-container">
        <div className="custom-trapezoid text-center">User Profile</div>
        <img
          src={CancelBtn}
          alt="Close"
          className="custom-close-btn"
          onClick={() => {
            const audio = new Audio(btnCloseSound);
            audio.play();
            onNavigate("dashboard");
          }}
        />
        <Container fluid className="custom-profile-data-container m-0">
          <Row className="d-flex align-content-center h-100 py-3">
            <Col
              xs={12}
              md={3}
              lg={3}
              className="custom-profile-info-container d-flex align-items-start h-100"
            >
              <img src={ProfilePic} className="custom-profile-pic mb-5" />
              <h5>User Name</h5>
              <div className="input-group p-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="User Name"
                  aria-label="Input group example"
                  aria-describedby="basic-addon1"
                />

                {/* 
                Click the confirm button to change the username.
                But, I’m not sure if the primary key can be changed.
                If not, I’ll change the input to a text field without the modify function.
                */}
                <span
                  className="input-group-text"
                  id="basic-addon1"
                  onClick={() => {
                    alert("User Name Updated");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"></path>
                  </svg>
                </span>
              </div>
            </Col>
            <Col
              xs={12}
              md={9}
              lg={9}
              className="d-flex flex-column align-items-start p-5 h-100"
            >
              <h5 className="mb-5">Skill Analysis</h5>
              <div style={{ width: "100%", height: "100%" }}>
                <Bar options={options} data={data} />
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default Profile;
