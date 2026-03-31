import styles from "./page.module.css";

type BadgeCardProps = {
	title: string;
	description: string;
};

export function BadgeCard({ title, description }: BadgeCardProps) {
	return (
		<article className={styles.card}>
			<h2>{title}</h2>
			<p>{description}</p>
			<span className={styles.badge}>Template Placeholder</span>
		</article>
	);
}
