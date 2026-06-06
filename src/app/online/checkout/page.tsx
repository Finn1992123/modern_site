import Image from "next/image";
import Link from "next/link";
import styles from "../../page.module.css";
import CheckoutNextSteps from "./CheckoutNextSteps";

const checkoutLanguages = {
  english: "Αγγλικά",
  french: "Γαλλικά",
  german: "Γερμανικά",
  spanish: "Ισπανικά",
} as const;

const checkoutLanguageKeys = ["english", "french", "german", "spanish"] as const;
const checkoutLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

type CheckoutSearchParams = Promise<{
  language?: string;
  level?: string;
}>;

function getCheckoutValue<const T extends readonly string[]>(
  value: string | undefined,
  options: T,
): T[number] {
  return options.includes(value as T[number]) ? (value as T[number]) : options[0];
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: CheckoutSearchParams;
}) {
  const params = await searchParams;
  const languageKey = getCheckoutValue(params.language, checkoutLanguageKeys);
  const level = getCheckoutValue(params.level, checkoutLevels);
  const language = checkoutLanguages[languageKey];
  const price = "150,00€";
  const selectionQuery = `language=${languageKey}&level=${level}`;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Modern Language">
          <Image
            src="/assets/logoTransp.png"
            alt="Modern Language"
            width={243}
            height={140}
            priority
          />
        </Link>
        <nav className={styles.nav} aria-label="Κύρια πλοήγηση">
          <Link href="/">Δια ζώσης</Link>
          <Link className={styles.activeTab} href="/online">
            Online Ξένες Γλώσσες
          </Link>
        </nav>
      </header>

      <section className={styles.checkout}>
        <div className={styles.checkoutIntro}>
          <p className={styles.eyebrow}>Σύνοψη αγοράς</p>
          <h1>Επιβεβαίωση επιπέδου</h1>
          <p>
            Ελέγξτε την επιλογή σας. Στο επόμενο βήμα θα συνδεθείτε ή θα
            δημιουργήσετε λογαριασμό πριν την πληρωμή.
          </p>
        </div>

        <div className={styles.checkoutGrid}>
          <section className={styles.checkoutSummary} aria-label="Σύνοψη επιλογής">
            <div>
              <span>Γλώσσα</span>
              <strong>{language}</strong>
            </div>
            <div>
              <span>Επίπεδο</span>
              <strong>{level}</strong>
            </div>
            <div>
              <span>Πακέτο</span>
              <strong>On Demand</strong>
            </div>
            <div>
              <span>Διάρκεια</span>
              <strong>1 χρόνος</strong>
            </div>
            <div className={styles.checkoutTotal}>
              <span>Σύνολο</span>
              <strong>{price}</strong>
            </div>
          </section>

          <CheckoutNextSteps selectionQuery={selectionQuery} />
        </div>
      </section>
    </main>
  );
}
