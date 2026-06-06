import Image from "next/image";
import Link from "next/link";
import styles from "../../page.module.css";
import LoginForm from "./LoginForm";

type AuthSearchParams = Promise<{
  language?: string;
  level?: string;
}>;

export default async function LoginPage({
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
          <p className={styles.eyebrow}>Σύνδεση</p>
          <h1>Σύνδεση λογαριασμού</h1>
          <p>Συνδεθείτε για να συνεχίσετε στην πληρωμή και να ενεργοποιηθούν τα μαθήματά σας.</p>
        </div>

        <LoginForm backQuery={backQuery} />
      </section>
    </main>
  );
}
