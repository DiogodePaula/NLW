import { useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContexts";
import styles from "../styles/components/Profile.module.css";

export function Profile() {
  const { level } = useContext(ChallengesContext);

  return (
    <div className={styles.profileContainer}>
      <img
        src="https://avatars.githubusercontent.com/u/60752809?v=4"
        alt="avatar"
      />
      <div>
        <strong>Diogo de Paula</strong>
        <p>
          <img src="icons/up.svg" alt="flecha para cima" />
          Level {level}
        </p>
      </div>
    </div>
  );
}
