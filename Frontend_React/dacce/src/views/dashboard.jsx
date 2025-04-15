import "../css/dashboard.css";
import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { IoPersonCircleOutline } from "react-icons/io5";

function Dashboard({ onNavigate }) {

  return (
    <>
      <div className="dashboard-wrap w-75">
        {/* Update: Moved the header to conditional in App.jsx */}
        {/* Set current view to dashboard and send the prop to navbar/header */}
        {/* <Header currentView="dashboard" onNavigate={onNavigate} /> */}
        <Container fluid className=" d-flex flex-column align-items-center">
          <Row className="w-100 justify-content-center align-items-center gap-3">
            <Col xs={12} md={5} className="justify-content-center">
              <Button
                btnHover={"dashboard-btn-hover"}
                text="Profile"
                textcolour="var(--black)"
                background="var(--white)"
              />
            </Col>
          </Row>
          <Row className="w-100 justify-content-center align-items-center">
            <Col xs={12} md={6} className="justify-content-center">
              <Button
                btnHover={"dashboard-btn-hover"}
                text="Leaderboard"
                textcolour="var(--black)"
                background="var(--white)"
                onClick={() => {
                  onNavigate("leaderboard");
                }}
              />
            </Col>
            <Col xs={12} md={6} className="justify-content-center">
              <Button
                btnHover={"dashboard-btn-hover"}
                text="History"
                textcolour="var(--black)"
                background="var(--white)"
              />
            </Col>
          </Row>
          <Row className="w-100 justify-content-center align-items-center gap-3">
            <Col xs={12} md={12} className="justify-content-center">
              <Button
                btnHover={"play-btn-hover"}
                text="Play"
                textcolour="var(--white)"
                background="var(--red)"
                onClick={() => {
                  onNavigate("playgame");
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Dashboard;
