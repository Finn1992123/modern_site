import type { Metadata } from "next";
import Link from "next/link";
import PrivacyPolicyTabs from "./PrivacyPolicyTabs";
import styles from "./privacy-policy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Modern Language",
  description:
    "Privacy Policy and Πολιτική Απορρήτου for the Modern Language app.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          Modern Language
        </Link>
        <Link className={styles.homeLink} href="/">
          Home
        </Link>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Privacy Policy</p>
        <h1>Modern Language</h1>
        <p>
          Public privacy information for students, parents/guardians, teachers,
          and app users.
        </p>
      </section>

      <PrivacyPolicyTabs />
    </main>
  );
}
