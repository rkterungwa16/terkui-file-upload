import { FC, ReactNode } from "react";

import styles from "./styles.module.css";

export type LayoutProps = {
  children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => (
  <div className={styles.StyledPageWrapper}>
    <div className={styles.StyledPageComponentsWrapper}>{children}</div>
  </div>
);
