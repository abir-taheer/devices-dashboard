import { NavLink, NavLinkProps } from "react-router-dom";

export default function UnstyledLink(props: NavLinkProps) {
  return <NavLink {...props} style={{ textDecoration: "none", ...props.style }} />;
}
