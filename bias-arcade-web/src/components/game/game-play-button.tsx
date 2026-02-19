"use client";

import { useRouter } from "next/navigation";

import styles from "./page.module.css";

type GamePlayButtonProps = {
    href: string;
    isLoggedIn: boolean;
};

export function GamePlayButton({ href, isLoggedIn }: GamePlayButtonProps) {
    const router = useRouter();

    function handlePlay() {
        if (isLoggedIn) {
            router.push(href);
            return;
        }

        window.alert("You need to log in first.");
        router.push(`/login?callbackUrl=${encodeURIComponent(href)}`);
    }

    return (
        <button type="button" className={styles.playButton} onClick={handlePlay}>
            Play
        </button>
    );
}