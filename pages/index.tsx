import { Chat } from "@components";
import styles from "@styles/Home.module.scss";
import type { NextPage } from "next";

interface HomeProps {
  badges: Record<string, any>;
}

const Home: NextPage<HomeProps> = ({ badges }) => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Chat />
      </div>
    </div>
  );
};

export default Home;
