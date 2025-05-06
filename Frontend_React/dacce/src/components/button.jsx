// Import CSS
import "../css/playGame.css";
import "../css/button.css";

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
    // cursor: "pointer",
    cursor: disabled ? "not-allowed" : "pointer",
    pointerEvents: disabled ? "none" : "auto",
    color: textcolour,
    backgroundColor: background,
    fontSize: fontsize,
    padding: padding,
    margin: margin,
    textAlign: "center",
  };

  return (
    <>
      <div
        className={`${btnHover} custom-universal-btn custom-playgame-btn btn-${colour} ${
          disabled ? "disabled-button" : ""
        }`}
        style={btnStyle}
        // onClick={onClick}
        onClick={!disabled ? onClick : undefined}
      >
        {text}
      </div>
    </>
  );
};

export default Button;