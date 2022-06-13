import { styled } from "@mui/system";
import { ReactNode } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

type Props = {
  drawerOpen: boolean;
  children: ReactNode;
  className?: string;
};

const styles = {
  open: {
    marginLeft: 250,
  },
  closed: {
    marginLeft: 0,
  },
};

export default function ContentAlignmentContainer({ drawerOpen, children, className }: Props) {
  const [searchParams] = useSearchParams();

  const hidden = searchParams.get("hideDrawer") === "true";

  if (hidden) {
    return <>{children}</>;
  }

  return (
    <div className={className} style={drawerOpen ? styles.open : styles.closed}>
      {children}
    </div>
  );
}
