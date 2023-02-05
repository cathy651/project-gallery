import React from "react"
import styles from './winModal.module.css'

const WinModal = ({handleClickReset, answer}) => {
  return (
    <div className={styles.container}>
      <div>Answer is : {answer}</div>
      <div>Win! Click reset to start next run</div>
      <button onClick={handleClickReset}>reset</button>
    </div>
  )
}
export default WinModal;
