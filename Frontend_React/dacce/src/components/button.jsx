// Import Bootstrap components


// Import CSS
import "../css/button.css";

const button = (text, color) => {
  return (
    <>
      <div className="custom-playgame-btn" color={color}>
        {text}
      </div>
    </>
  )
}