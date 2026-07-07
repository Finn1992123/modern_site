import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import { onlineLanguages, onDemandLevels, type OnlineLanguage } from "./languages";

export default function OnlineLanguagePage({ language }: { language: OnlineLanguage }) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Modern Language">
          <Image src="/assets/logoTransp.png" alt="Modern Language" width={243} height={140} priority />
        </Link>
        <nav className={styles.nav} aria-label="Κύρια πλοήγηση">
          <Link href="/">Δια ζώσης</Link>
          <Link className={styles.activeTab} href={`/online/${language.slug}`}>
            Online Ξένες Γλώσσες
          </Link>
        </nav>
        <Link className={styles.headerLogin} href="/online/login">Σύνδεση</Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Online Ξένες Γλώσσες</p>
          <nav className={styles.onlineLanguageTabs} aria-label="Online γλώσσες">
            {onlineLanguages.map((item) => {
              const isActive = item.slug === language.slug;
              return (
                <Link
                  className={`${styles.onlineLanguageTab} ${isActive ? styles.onlineLanguageTabActive : ""}`}
                  key={item.slug}
                  href={`/online/${item.slug}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Image src={item.flag} alt={item.alt} width={76} height={54} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className={styles.onDemandIntro}>
            <h1>{language.title}</h1>
            <p>
              Online μαθήματα, σχεδιασμένα από καθηγητές για εσάς που θέλετε να
              μαθαίνετε όπου και όποτε σας βολεύει.
            </p>
            <p>
              Μάθετε τη γλώσσα που επιθυμείτε βήμα-βήμα, καλύπτοντας όλες τις
              βασικές γλωσσικές δεξιότητες:
            </p>
            <ul className={styles.onDemandSkills}>
              <li>Λεξιλόγιο</li>
              <li>Γραμματική</li>
              <li>Γραπτός λόγος</li>
              <li>Προφορικός λόγος</li>
            </ul>
            <p>
              Τα μαθήματα είναι ιδανικά τόσο για προετοιμασία για πτυχία όσο και
              για εσάς που θέλετε να ξεκινήσετε ένα νέο χόμπι από την άνεση του
              σπιτιού σας. Επιλέξτε το επίπεδο που σας ταιριάζει και ξεκινήστε
              τώρα κιόλας να μαθαίνετε.
            </p>
          </div>
          <p className={styles.onDemandLevelsTitle}>ΕΠΙΠΕΔΑ</p>
          <div className={styles.onDemandLevels} aria-label={`Επίπεδα online ${language.genitive}`}>
            {onDemandLevels.map((item) => (
              <article className={styles.onDemandLevelCard} key={item.level}>
                <div>
                  <span className={styles.onDemandLevel}>{item.level}</span>
                  <h2>{item.title}</h2>
                </div>
                <p>{item.description}</p>
                <div className={styles.onDemandPrice}>
                  <strong>150,00€</strong>
                  <span>για 1 χρόνο</span>
                </div>
                <Link
                  className={styles.onDemandLevelButton}
                  href={`/online/checkout?language=${language.checkoutSlug}&level=${item.level}`}
                >
                  Επιλογή επιπέδου
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
