import { Chat } from "@components";
import styles from "@styles/Home.module.scss";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Chat />
      </div>
    </div>
  );
};

export default Home;
