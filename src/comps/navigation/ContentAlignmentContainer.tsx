import { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  drawerOpen: boolean;
  children: ReactNode;
  className?: string;
  width: number;
};

const getStyles = ({ width }) => ({
  open: {
    marginLeft: width,
  },
  closed: {
    marginLeft: 0,
  },
});

export default function ContentAlignmentContainer({
  drawerOpen,
  children,
  className,
  width,
}: Props) {
  const [searchParams] = useSearchParams();
  const styles = getStyles({ width });

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
