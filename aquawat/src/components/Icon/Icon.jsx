import React from "react";
import styles from "../../components/Icon/Icon.module.css";

const Icon = ({ show, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.eyeIconButton}
      aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
    >
      <svg
        width="36"
        height="35"
        viewBox="0 0 36 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.eyeIcon}
      >
        <path
          d="M22.995 17.5327C22.995 20.3707 20.7017 22.664 17.8637 22.664C15.0257 22.664 12.7324 20.3707 12.7324 17.5327C12.7324 14.6947 15.0257 12.4014 17.8637 12.4014C20.7017 12.4014 22.995 14.6947 22.995 17.5327Z"
          stroke="#CCCCCC"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.8637 29.3863C22.9234 29.3863 27.639 26.405 30.9213 21.2451C32.2113 19.2241 32.2113 15.8271 30.9213 13.8061C27.639 8.64611 22.9234 5.66479 17.8637 5.66479C12.8041 5.66479 8.08844 8.64611 4.80612 13.8061C3.51612 15.8271 3.51612 19.2241 4.80612 21.2451C8.08844 26.405 12.8041 29.3863 17.8637 29.3863Z"
          stroke="#CCCCCC"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default Icon;
