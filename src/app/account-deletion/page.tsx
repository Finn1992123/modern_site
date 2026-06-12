import type { Metadata } from "next";
import Link from "next/link";
import styles from "../privacy-policy/privacy-policy.module.css";

export const metadata: Metadata = {
  title: "Account Deletion | Modern Language",
  description:
    "How Modern Language app users can request account and personal data deletion.",
};

export default function AccountDeletionPage() {
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
        <p className={styles.eyebrow}>Account Deletion</p>
        <h1>Διαγραφή Λογαριασμού / Account Deletion</h1>
        <p>
          Instructions for requesting account deletion and related personal data
          deletion in the Modern Language app.
        </p>
      </section>

      <section className={styles.policyShell}>
        <article className={styles.policyArticle}>
          <section className={styles.policySection}>
            <h2>Ελληνικά</h2>
            <p>
              Οι χρήστες της εφαρμογής Modern Language μπορούν να ζητήσουν
              διαγραφή λογαριασμού και των σχετικών προσωπικών δεδομένων μέσα
              από την εφαρμογή:
            </p>
            <p>Προφίλ &gt; Αίτημα διαγραφής λογαριασμού</p>
            <p>
              Το αίτημα θα ελεγχθεί από την ομάδα του Modern Language. Τα
              δεδομένα που μπορούν να διαγραφούν νόμιμα θα διαγραφούν ή θα
              ανωνυμοποιηθούν.
            </p>
            <p>
              Οι χρήστες μπορούν επίσης να ζητήσουν διαγραφή λογαριασμού ή
              προσωπικών δεδομένων στέλνοντας email στο:
            </p>
            <p>info@modernlanguage.gr</p>
            <p>
              Παρακαλούμε να συμπεριλάβετε το email που χρησιμοποιείται για τον
              λογαριασμό στην εφαρμογή.
            </p>
            <p>
              Κάποια δεδομένα μπορεί να διατηρηθούν όπου απαιτείται από νόμο ή
              για νόμιμες διοικητικές υποχρεώσεις.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>English</h2>
            <p>
              Users of the Modern Language app can request deletion of their
              account and related personal data directly from the app:
            </p>
            <p>Profile &gt; Account deletion request</p>
            <p>
              The request will be reviewed by the Modern Language team. Data
              that can legally be deleted will be deleted or anonymized.
            </p>
            <p>
              Users may also request account or personal data deletion by
              contacting:
            </p>
            <p>info@modernlanguage.gr</p>
            <p>Please include the email address used for the app account.</p>
            <p>
              Some data may be retained where required by law or for legitimate
              administrative obligations.
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}
