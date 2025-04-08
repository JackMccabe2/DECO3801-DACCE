// Import React rnd (draggable & resizable window)
import { Rnd } from "react-rnd";
import "../css/xterm.css";

// Import CSS
import "../css/appWindow.css";

const AppWindow = ({ positionx, positiony, width, height, icon, title, content }) => {
  return (
    <Rnd
      default={{
        x: positionx,
        y: positiony,
        width: width,
        height: height,
      }}
    >
      <div className="custom-window-box">
        <div className="custom-title-bar gap-2">
          {icon}
          <span className="custom-window-title">{title}</span>
        </div>
        <div className="window-content">{content}</div>
      </div>
    </Rnd>
  );
};

export default AppWindow;
