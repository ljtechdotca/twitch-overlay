import { Chat } from "@components";
import styles from "@styles/Home.module.scss";
import type { GetStaticProps, NextPage } from "next";

export const getStaticProps: GetStaticProps = async () => {
  let badges: any = null;
  try {
    const response = await fetch(
      "https://badges.twitch.tv/v1/badges/global/display"
    );
    const { badge_sets } = await response.json();
    badges = badge_sets;
  } catch (error) {
    console.error(error);
  }
  return {
    props: { badges },
  };
};

interface HomeProps {
  badges: Record<string, any>;
}

const Home: NextPage<HomeProps> = ({ badges }) => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Chat badges={badges} />
      </div>
    </div>
  );
};

export default Home;
