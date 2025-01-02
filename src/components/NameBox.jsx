import "./NameBox.css";

export const NameBox = ({ dir, children, title = null }) => {
  let cn = [];
  cn.push("nameBox greyTheme");

  if (dir === "left") {
    cn.push("leftTheme");
  }
  if (dir === "right") {
    cn.push("rightTheme");
  }

  return (
    <span className={cn.join(" ")} title={title}>
      {children}
    </span>
  );
};
