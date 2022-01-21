import styles from "./Footer.module.scss";
export interface FooterProps {}

export const Footer = ({}: FooterProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <svg
          width="43"
          height="43"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 0L29.8564 8V24L16 32L2.14355 24V8L16 0Z" fill="white" />
          <path
            d="M16 0L29.8564 8V24L16 32L2.14355 24V8L16 0Z"
            className={styles.color}
            fillOpacity="0.5"
          />
          <path
            d="M16 0V32L2.14355 24V8L16 0Z"
            className={styles.color}
            fillOpacity="0.5"
          />
          <path
            d="M16 0L2.14355 24V8L16 0Z"
            className={styles.color}
            fillOpacity="0.5"
          />
          <path
            d="M16 0L29.8564 8V24L16 0Z"
            className={styles.color}
            fillOpacity="0.5"
          />
          <path
            d="M2.14355 24H29.8564L16 32L2.14355 24Z"
            className={styles.color}
            fillOpacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
};
