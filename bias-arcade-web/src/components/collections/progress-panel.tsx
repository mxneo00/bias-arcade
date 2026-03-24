import styles from "./page.module.css";

export function ProgressPanel() {
	return (
		<section className={styles.progressPanel} aria-label="Collection progress">
            <h2>Collection Progress</h2>
            <p>
                Track your journey as you unlock new biases and cards. Your progress will be displayed here, showing how close you are to completing your collection.
            </p>
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: "40%" }}></div>
            </div>
            <span className={styles.progressText}>40% Complete</span>
        </section>
	);
}
