import "./NameBox.css";

export const NameBox = ({ dir, children }) => {
  let s = {};
  if (dir === "left") {
    s.backgroundColor = "var(--colorLeft)";
  }
  if (dir === "right") {
    s.backgroundColor = "var(--colorRight)";
  }
  return (
    <span className="nameBox" style={s}>
      {children}
    </span>
  );
};
