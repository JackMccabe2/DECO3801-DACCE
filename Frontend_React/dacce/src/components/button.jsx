// Import CSS
import "../css/playGame.css";
import "../css/button.css";

// Import Sound
import btnClickSound from "../assets/music/button_click_2_pop.mp3";

const Button = ({
  text,
  colour,
  btnHover,
  textcolour,
  background,
  onClick,
  fontsize,
  padding,
  margin,
  disabled,
}) => {
  // Can add different styles here, customisable for each button
  const btnStyle = {
    cursor: disabled ? "not-allowed" : "pointer",
    pointerEvents: disabled ? "none" : "auto",
    color: textcolour,
    backgroundColor: background,
    fontSize: fontsize,
    padding: padding,
    margin: margin,
    textAlign: "center",
  };

  const handleClick = () => {
    if (!disabled) {
      const audio = new Audio(btnClickSound);
      audio.play();

      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <>
      <div
        className={`${btnHover} custom-universal-btn custom-playgame-btn btn-${colour} ${
          disabled ? "disabled-button" : ""
        }`}
        style={btnStyle}
        onClick={handleClick}
      >
        {text}
      </div>
    </>
  );
};

export default Button;
