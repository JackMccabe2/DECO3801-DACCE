// Import CSS
import "../css/playGame.css";

const button = (text, colour) => {
  return (
    <>
      <div className="custom-playgame-btn" color={colour}>
        {text}
      </div>
    </>
  );
};

export default button;
