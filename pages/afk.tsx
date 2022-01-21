import styles from "@styles/Afk.module.scss";
import type { NextPage } from "next";

const Afk: NextPage = () => {
  return (
    <div className={styles.root}>
      <div className={styles.container}></div>
    </div>
  );
};

export default Afk;
