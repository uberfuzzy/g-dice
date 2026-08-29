export const Emoji = ({ children, style, cssclass }) => {
  return <span className={cssclass} style={style}>{children}&#xfe0f;</span>;
};
