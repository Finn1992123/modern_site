"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../page.module.css";

const onlineLanguages = [
  {
    slug: "english",
    name: "Αγγλικά",
    flag: "/assets/uk.png",
    alt: "Σημαία Ηνωμένου Βασιλείου",
    onDemandTitle: "Μαθήματα αγγλικών On Demand",
    onDemandText:
      "Μάθετε αγγλικά από την άνεση του σπιτιού σας, στο γραφείο, στο διάλειμμά σας ή όπου εσείς θέλετε. Επιλέξτε ένα επίπεδο και ξεκινήστε σήμερα κιόλας.",
  },
  {
    slug: "french",
    name: "Γαλλικά",
    flag: "/assets/french.png",
    alt: "Σημαία Γαλλίας",
    onDemandTitle: "Μαθήματα γαλλικών On Demand",
    onDemandText:
      "Μάθετε γαλλικά από την άνεση του σπιτιού σας, στο γραφείο, στο διάλειμμά σας ή όπου εσείς θέλετε. Επιλέξτε ένα επίπεδο και ξεκινήστε σήμερα κιόλας.",
  },
  {
    slug: "german",
    name: "Γερμανικά",
    flag: "/assets/germany.png",
    alt: "Σημαία Γερμανίας",
    onDemandTitle: "Μαθήματα γερμανικών On Demand",
    onDemandText:
      "Μάθετε γερμανικά από την άνεση του σπιτιού σας, στο γραφείο, στο διάλειμμά σας ή όπου εσείς θέλετε. Επιλέξτε ένα επίπεδο και ξεκινήστε σήμερα κιόλας.",
  },
  {
    slug: "spanish",
    name: "Ισπανικά",
    flag: "/assets/spanish.png",
    alt: "Σημαία Ισπανίας",
    onDemandTitle: "Μαθήματα ισπανικών On Demand",
    onDemandText:
      "Μάθετε ισπανικά από την άνεση του σπιτιού σας, στο γραφείο, στο διάλειμμά σας ή όπου εσείς θέλετε. Επιλέξτε ένα επίπεδο και ξεκινήστε σήμερα κιόλας.",
  },
];

const onDemandLevels = [
  {
    level: "A1",
    title: "Beginner",
    description: "Τα πρώτα βήματα στη γλώσσα με βασικό λεξιλόγιο και απλές φράσεις.",
    price: "150,00€",
    duration: "για 1 χρόνο",
  },
  {
    level: "A2",
    title: "Elementary",
    description: "Σταθερή βάση για καθημερινή επικοινωνία και κατανόηση απλών κειμένων.",
    price: "150,00€",
    duration: "για 1 χρόνο",
  },
  {
    level: "B1",
    title: "Intermediate",
    description: "Πιο άνετη χρήση της γλώσσας σε πρακτικές καταστάσεις και οργανωμένο λόγο.",
    price: "150,00€",
    duration: "για 1 χρόνο",
  },
  {
    level: "B2",
    title: "Upper Intermediate",
    description: "Ενίσχυση λεξιλογίου, γραμματικής και παραγωγής λόγου για υψηλότερη αυτονομία.",
    price: "150,00€",
    duration: "για 1 χρόνο",
  },
  {
    level: "C1",
    title: "Advanced",
    description: "Προχωρημένη χρήση της γλώσσας με έμφαση στην ακρίβεια και την ευχέρεια.",
    price: "150,00€",
    duration: "για 1 χρόνο",
  },
  {
    level: "C2",
    title: "Proficiency",
    description: "Ολοκληρωμένη κατάκτηση της γλώσσας για απαιτητική επικοινωνία και πιστοποίηση.",
    price: "150,00€",
    duration: "για 1 χρόνο",
  },
];

export default function OnlinePage() {
  const [activeLanguage, setActiveLanguage] = useState(onlineLanguages[0]);

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
        <Link className={styles.headerLogin} href="/online/login">
          Σύνδεση
        </Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Online Ξένες Γλώσσες</p>
          <div className={styles.onlineLanguageTabs} role="tablist" aria-label="Online γλώσσες">
            {onlineLanguages.map((language) => {
              const isActive = activeLanguage.name === language.name;

              return (
                <button
                  className={`${styles.onlineLanguageTab} ${
                    isActive ? styles.onlineLanguageTabActive : ""
                  }`}
                  key={language.name}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={language.name}
                  onClick={() => setActiveLanguage(language)}
                >
                  <Image src={language.flag} alt={language.alt} width={76} height={54} />
                  <span>{language.name}</span>
                </button>
              );
            })}
          </div>
          <div className={styles.onDemandIntro}>
            <h2>{activeLanguage.onDemandTitle}</h2>
            <p>{activeLanguage.onDemandText}</p>
          </div>
          <p className={styles.onDemandLevelsTitle}>ΕΠΙΠΕΔΑ</p>
          <div className={styles.onDemandLevels} aria-label="Επίπεδα On Demand">
            {onDemandLevels.map((item) => (
              <article className={styles.onDemandLevelCard} key={item.level}>
                <div>
                  <span className={styles.onDemandLevel}>{item.level}</span>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.description}</p>
                <div className={styles.onDemandPrice}>
                  <strong>{item.price}</strong>
                  <span>{item.duration}</span>
                </div>
                <Link
                  className={styles.onDemandLevelButton}
                  href={`/online/checkout?language=${activeLanguage.slug}&level=${item.level}`}
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
