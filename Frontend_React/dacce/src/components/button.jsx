// Import CSS
import "../css/playGame.css";
import "../css/button.css";

const Button = ({ text, colour, onClick }) => {
  const btnStyle = {
    cursor: "pointer",
  };

  return (
    <>
      <div
        className={`custom-universal-btn custom-playgame-btn mt-5 btn-${colour}`}
        style={btnStyle}
        onClick={onClick}
      >
        {text}
      </div>
    </>
  );
};

export default Button;
