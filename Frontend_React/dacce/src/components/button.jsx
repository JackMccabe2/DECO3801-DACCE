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
}) => {
  // Can add different styles here, customisable for each button
  const btnStyle = {
    cursor: "pointer",
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
        className={`${btnHover} custom-universal-btn custom-playgame-btn btn-${colour}`}
        style={btnStyle}
        onClick={onClick}
      >
        {text}
      </div>
    </>
  );
};

export default Button;
