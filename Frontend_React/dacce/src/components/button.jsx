// Import CSS
import "../css/playGame.css";

const Button = ({ text, colour }) => {
  return (
    <>
      <div className={`custom-playgame-btn mt-5 btn-${colour}`}>{text}</div>
    </>
  );
};

export default Button;
