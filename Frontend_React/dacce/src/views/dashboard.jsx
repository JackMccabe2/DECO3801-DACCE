import "../css/dashboard.css";
import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Header from "../components/header";

function Dashboard({ onNavigate }) {
  return (
    <>
      <div className="dashboard-wrap">
        <Header />
        <br />
        <br />
        <br />
        <Container fluid className=" d-flex flex-column align-items-center">
          <Row className="w-100 justify-content-center align-items-center gap-3">
            <Col xs={12} md={5} className="justify-content-center">
              <Button
                text="Profile"
                textcolour="var(--black)"
                background="var(--white)"
              />
            </Col>
            <Col xs={12} md={5} className="justify-content-center">
              <Button
                text="Leaderboard"
                textcolour="var(--black)"
                background="var(--white)"
              />
            </Col>
            <Col xs={12} md={5} className="justify-content-center">
              <Button
                text="History"
                textcolour="var(--black)"
                background="var(--white)"
              />
            </Col>
            <Col xs={12} md={10} className="justify-content-center">
              <Button
                text="Play"
                textcolour="var(--white)"
                background="var(--red)"
                onClick={() => onNavigate("playgame")}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Dashboard;
