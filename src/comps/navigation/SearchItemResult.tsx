import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ReactNode } from "react";
import { NavLinkProps, useLocation } from "react-router-dom";
import UnstyledLink from "../ui/UnstyledLink";

type SearchItemResultProps =
  | {
      onClick?: NavLinkProps["onClick"];
      href: string;
      icon?: ReactNode;
      primary?: ReactNode;
      secondary?: ReactNode;
    }
  | {
      onClick: NavLinkProps["onClick"];
      href?: string;
      icon?: ReactNode;
      primary?: ReactNode;
      secondary?: ReactNode;
    };

export default function SearchItemResult({
  href,
  icon,
  primary,
  secondary,
  onClick,
}: SearchItemResultProps) {
  const location = useLocation();
  return (
    <UnstyledLink to={href || location.pathname} onClick={onClick}>
      <ListItemButton>
        {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={primary} secondary={secondary} />
      </ListItemButton>
    </UnstyledLink>
  );
}
