import "./NameBox.css";

export const NameBox = ({ dir, children, title = null }) => {
  let s = {};
  if (dir === "left") {
    s.backgroundColor = "var(--colorLeft)";
    s.color = "var(--textLeft)";
  }
  if (dir === "right") {
    s.backgroundColor = "var(--colorRight)";
  }
  return (
    <span className="nameBox" style={s} title={title}>
      {children}
    </span>
  );
};
