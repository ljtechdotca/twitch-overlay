import { Footer, Meta } from "@components";
import styles from "./Layout.module.scss";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.root}>
      <Meta
        title="ljtechdotca Overlay"
        description="This overlay is used for ljtecdotca's Twitch stream."
      />
      <main className={styles.container}>{children}</main>
      <Footer />
    </div>
  );
};
