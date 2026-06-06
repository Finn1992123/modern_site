import Image from "next/image";
import Link from "next/link";
import styles from "../../page.module.css";
import MyCourses from "./MyCourses";

export default function MyCoursesPage() {
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

      <section className={styles.myCoursesPage}>
        <div className={styles.authIntro}>
          <p className={styles.eyebrow}>Τα μαθήματά μου</p>
          <h1>Online μαθήματα</h1>
          <p>Εδώ εμφανίζονται τα On Demand μαθήματα που είναι ενεργά στον λογαριασμό σας.</p>
        </div>
        <MyCourses />
      </section>
    </main>
  );
}
