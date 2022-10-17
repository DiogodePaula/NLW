import { useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContexts";
import styles from "../styles/components/CompletedChallengers.module.css";

export function CompletedChallengers() {
  const { challengesCompleted } = useContext(ChallengesContext);

  return (
    <div className={styles.completedChallengers}>
      <span>Desafios completos</span>
      <span>{challengesCompleted}</span>
    </div>
  );
}
