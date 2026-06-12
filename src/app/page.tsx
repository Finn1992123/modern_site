import Image from "next/image";
import Link from "next/link";
import ReviewsCarousel from "./ReviewsCarousel";
import styles from "./page.module.css";

const isOnlineEnabled = process.env.NEXT_PUBLIC_ENABLE_ONLINE === "true";

const offers = [
  "Δωρεάν test αξιολόγησης επιπέδου",
  "Δωρεάν Pre-Junior",
  "Δωρεάν εγγραφή στην εφαρμογή μας",
  "Προσιτές τιμές και ξεκάθαρα τμήματα",
];

const contactAddress = "Αγίου Νεκταρίου 20, Γέρακας";
const contactMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  contactAddress,
)}`;

function ContactIcon({ type }: { type: "phone" | "mail" | "map" }) {
  return (
    <svg
      className={styles.contactIcon}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {type === "phone" ? (
        <path
          d="M7.1 4.6 9.2 4c.7-.2 1.4.2 1.7.9l.9 2.2c.2.6.1 1.2-.4 1.6l-1.2 1c.9 1.8 2.3 3.2 4.1 4.1l1-1.2c.4-.5 1.1-.7 1.6-.4l2.2.9c.7.3 1.1 1 .9 1.7l-.6 2.1c-.2.8-.9 1.3-1.7 1.3C10.2 18.2 4 11.8 4 6.3c0-.8.5-1.5 1.3-1.7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      {type === "mail" ? (
        <>
          <path
            d="M4.5 6.5h15v11h-15v-11Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="m5.2 7.3 6.8 5.2 6.8-5.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
      {type === "map" ? (
        <>
          <path
            d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </>
      ) : null}
    </svg>
  );
}

const strengths = [
  {
    title: "Modern Language App",
    text: (
      <>
        Μπορείτε να βλέπετε <strong>την πρόοδό</strong> σας,{" "}
        <strong>τα σχόλια</strong> του καθηγητή, να{" "}
        <strong>παρακολουθείτε βίντεο</strong> ή και να{" "}
        <strong>παίζετε</strong>. Όλα απλά και εύκολα, από το κινητό σας.
      </>
    ),
    image: "/assets/mobileapp.png",
    imageAlt: "Modern Language App σε κινητό",
    imageClass: "appVisual",
    imageSide: "right",
  },
  {
    title: "Πιστοποιήσεις",
    text: (
      <>
        Οι μαθητές μας ξεκινάνε να δίνουν <strong>πιστοποιήσεις</strong> από{" "}
        <strong>μικρή ηλικία</strong>, μαθαίνουν να{" "}
        <strong>διαχειρίζονται το άγχος</strong>, εξοικειώνονται με τη
        διαδικασία και το πιο σημαντικό <strong>χτίζουν</strong> την{" "}
        <strong>αυτοπεποίθησή</strong> τους βήμα-βήμα.
      </>
    ),
    image: "/assets/ptyxia.png",
    imageAlt: "Μαθητές με πιστοποιήσεις Modern Language",
    imageClass: "certificateVisual",
    imageSide: "left",
  },
  {
    title: "Καινοτομούμε - Διασκεδάζουμε",
    text: (
      <>
        Συνδυάσαμε την <strong>παραδοσιακή διδασκαλία</strong> με την{" "}
        <strong>τεχνολογία</strong> για τα <strong>μέγιστα αποτελέσματα</strong>.
        Μαθαίνουμε <strong>παίζοντας</strong>, βλέπουμε{" "}
        <strong>VR βίντεο</strong> και δίνουμε κίνητρα με{" "}
        <strong> ψηφιακά επιτεύγματα</strong> που τα παιδιά{" "}
        <strong>λατρεύουν</strong>. Γιατί η χρήση της τεχνολογίας στην
        εκπαίδευση <strong>δεν είναι επιλογή</strong> πλέον αλλά{" "}
        <strong>ανάγκη!</strong>
      </>
    ),
    image: "/assets/vrr.png",
    imageAlt: "Μαθητής με VR και δραστηριότητες",
    imageClass: "vrVisual",
    imageSide: "right",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="Modern Language">
          <Image
            src="/assets/logoTransp.png"
            alt="Modern Language"
            width={243}
            height={140}
            priority
          />
        </a>
        <nav className={styles.nav} aria-label="Κύρια πλοήγηση">
          <a className={styles.activeTab} href="#top">
            Δια ζώσης
          </a>
          {isOnlineEnabled ? <Link href="/online">Online Ξένες Γλώσσες</Link> : null}
        </nav>
        {isOnlineEnabled ? (
          <Link className={styles.headerLogin} href="/online/login">
            Σύνδεση
          </Link>
        ) : null}
      </header>

      <section id="top" className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Κέντρο ξένων γλωσσών στον Γέρακα</p>
          <h1>Modern Language</h1>
          <p className={styles.lead}>
            Μοντέρνα, καθαρή και ζεστή εκπαίδευση ξένων γλωσσών με
            οργανωμένη παρακολούθηση, τεχνολογία και προετοιμασία για
            πιστοποιήσεις.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="tel:+302121030052">
              Μιλήστε μαζί μας
            </a>
            <a className={styles.secondaryButton} href="#why">
              Δείτε τα δυνατά μας σημεία
            </a>
          </div>
        </div>
      </section>

      <section id="why" className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Γιατί Modern Language;</p>
          <h2>Τα δυνατά μας σημεία φαίνονται στην καθημερινότητα</h2>
          <p>
            Θέλουμε ο μαθητής να βλέπει πρόοδο και ο γονιός να έχει καθαρή
            εικόνα. Γι&apos; αυτό η διδασκαλία δεν μένει μόνο στο βιβλίο.
          </p>
        </div>
        <div className={styles.flyerStrengths}>
          {strengths.map((strength) => (
            <article
              className={`${styles.flyerStrength} ${
                strength.imageSide === "left" ? styles.imageLeft : ""
              }`}
              key={strength.title}
            >
              <Image
                className={`${styles.flyerVisual} ${
                  styles[strength.imageClass as keyof typeof styles]
                }`}
                src={strength.image}
                alt={strength.imageAlt}
                width={520}
                height={520}
              />
              <div className={styles.flyerText}>
                <h3>{strength.title}</h3>
                <p>{strength.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ReviewsCarousel />

      <section className={styles.offerBand}>
        <div>
          <p className={styles.eyebrow}>Ξεκινήστε σωστά</p>
          <h2>Δωρεάν αξιολόγηση και προσφορά γνωριμίας</h2>
        </div>
        <ul>
          {offers.map((offer) => (
            <li key={offer}>{offer}</li>
          ))}
        </ul>
      </section>

      <section id="contact" className={styles.contact}>
        <div>
          <p className={styles.eyebrow}>Επικοινωνία</p>
          <h2>Κλείστε δωρεάν αξιολόγηση επιπέδου</h2>
          <p>
            Μιλήστε μαζί μας για τα τμήματα, τις τιμές και την κατάλληλη
            διαδρομή για τον μαθητή.
          </p>
        </div>
        <div className={styles.contactActions}>
          <a href="tel:+302121030052">
            <ContactIcon type="phone" />
            <span>212 103 0052</span>
          </a>
          <a href="mailto:info@modernlanguage.gr">
            <ContactIcon type="mail" />
            <span>info@modernlanguage.gr</span>
          </a>
          <a href={contactMapUrl} target="_blank" rel="noreferrer">
            <ContactIcon type="map" />
            <span>{contactAddress}</span>
          </a>
        </div>
      </section>
    </main>
  );
}
