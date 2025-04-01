// Import CSS
import "../css/playGame.css";
import "../css/button.css";

const Button = ({ text, colour, textcolour, background, onClick }) => {
  // Can add different styles here, customisable for each button
  const btnStyle = {
    cursor: "pointer",
    color: textcolour,
    backgroundColor: background,
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
