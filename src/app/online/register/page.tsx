import Image from "next/image";
import Link from "next/link";
import styles from "../../page.module.css";
import RegisterForm from "./RegisterForm";

type AuthSearchParams = Promise<{
  language?: string;
  level?: string;
}>;

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: AuthSearchParams;
}) {
  const params = await searchParams;
  const backQuery = new URLSearchParams({
    language: params.language ?? "english",
    level: params.level ?? "A1",
  }).toString();

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

      <section className={styles.authPage}>
        <div className={styles.authIntro}>
          <p className={styles.eyebrow}>Δημιουργία λογαριασμού</p>
          <h1>Νέος λογαριασμός μαθητή</h1>
          <p>Φτιάξτε έναν λογαριασμό για να ολοκληρώσετε την αγορά και να αποκτήσετε πρόσβαση στα μαθήματα.</p>
        </div>

        <RegisterForm backQuery={backQuery} />
      </section>
    </main>
  );
}
