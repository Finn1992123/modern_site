"use client";

import { useState } from "react";
import styles from "./privacy-policy.module.css";

type PolicySection = {
  title?: string;
  paragraphs?: string[];
  list?: string[];
};

const greekSections: PolicySection[] = [
  {
    paragraphs: [
      "Τελευταία ενημέρωση: 9 Ιουνίου 2026",
      "Η εφαρμογή Modern Language χρησιμοποιείται για την πρόσβαση μαθητών, γονέων/κηδεμόνων και καθηγητών σε εκπαιδευτικές πληροφορίες, ασκήσεις, λεξιλόγιο, βιβλιοθήκη, ανακοινώσεις, πληρωμές και στοιχεία προόδου.",
    ],
  },
  {
    title: "Υπεύθυνος Επεξεργασίας",
    paragraphs: [
      "Modern Language",
      "Website: https://www.modernlanguage.gr",
      "Email επικοινωνίας: info@modernlanguage.gr",
    ],
  },
  {
    title: "Δεδομένα που συλλέγουμε",
    paragraphs: ["Η εφαρμογή μπορεί να επεξεργάζεται:"],
    list: [
      "στοιχεία λογαριασμού, όπως email και στοιχεία σύνδεσης,",
      "στοιχεία μαθητή, γονέα, κηδεμόνα ή καθηγητή που απαιτούνται για τη λειτουργία της εκπαιδευτικής υπηρεσίας,",
      "εκπαιδευτικά δεδομένα, όπως τάξεις, μαθήματα, λεξιλόγιο, εργασίες, απουσίες, βαθμοί και πρόοδος,",
      "πληροφορίες πληρωμών που εμφανίζονται στην εφαρμογή για ενημέρωση,",
      "φωτογραφίες προφίλ που επιλέγει ο χρήστης,",
      "τεχνικά δεδομένα απαραίτητα για σύνδεση, ασφάλεια και λειτουργία της εφαρμογής.",
    ],
  },
  {
    title: "Δικαιώματα συσκευής",
    paragraphs: [
      "Η εφαρμογή ζητά πρόσβαση:",
      "Η πρόσβαση σε αυτά τα δικαιώματα χρησιμοποιείται μόνο για τις παραπάνω λειτουργίες.",
    ],
    list: [
      "στη βιβλιοθήκη φωτογραφιών, μόνο όταν ο χρήστης επιλέγει φωτογραφία προφίλ,",
      "στο μικρόφωνο, για προφορικές ασκήσεις λεξιλογίου,",
      "στην αναγνώριση ομιλίας, για έλεγχο προφορικών απαντήσεων,",
      "στο διαδίκτυο, για σύνδεση με τις υπηρεσίες της εφαρμογής.",
    ],
  },
  {
    title: "Υπηρεσίες τρίτων",
    paragraphs: [
      "Η εφαρμογή χρησιμοποιεί Supabase για authentication, βάση δεδομένων και αποθήκευση αρχείων. Η σύνδεση μπορεί να γίνει με email/password και, όπου είναι διαθέσιμο, με Google sign-in.",
    ],
  },
  {
    title: "Κοινοποίηση δεδομένων",
    paragraphs: [
      "Δεν πουλάμε προσωπικά δεδομένα. Δεδομένα κοινοποιούνται μόνο όταν είναι απαραίτητο για:",
    ],
    list: [
      "τη λειτουργία της εφαρμογής και των υποδομών της,",
      "την παροχή εκπαιδευτικών υπηρεσιών,",
      "τη συμμόρφωση με νόμιμες υποχρεώσεις.",
    ],
  },
  {
    title: "Διατήρηση δεδομένων",
    paragraphs: [
      "Τα δεδομένα διατηρούνται όσο είναι απαραίτητα για την παροχή της υπηρεσίας, για εκπαιδευτικούς ή διοικητικούς σκοπούς και για νόμιμες υποχρεώσεις. Όταν δεν χρειάζονται πλέον, διαγράφονται ή ανωνυμοποιούνται όπου είναι δυνατό.",
    ],
  },
  {
    title: "Διαγραφή λογαριασμού και δεδομένων",
    paragraphs: [
      "Ο χρήστης μπορεί να υποβάλει αίτημα διαγραφής λογαριασμού μέσα από την εφαρμογή, από την ενότητα:",
      "Προφίλ > Αίτημα διαγραφής λογαριασμού",
      "Το αίτημα ελέγχεται από την ομάδα του Modern Language ώστε να διαγραφούν ή να ανωνυμοποιηθούν τα δεδομένα που μπορούν να διαγραφούν νόμιμα.",
      "Ο χρήστης μπορεί επίσης να ζητήσει διαγραφή ή ενημέρωση προσωπικών δεδομένων στέλνοντας email στο:",
      "info@modernlanguage.gr",
    ],
  },
  {
    title: "Ασφάλεια",
    paragraphs: [
      "Χρησιμοποιούμε τεχνικά και οργανωτικά μέτρα για την προστασία των δεδομένων, όπως authentication, πολιτικές πρόσβασης ανά χρήστη και περιορισμένη πρόσβαση σε δεδομένα ανά ρόλο χρήστη.",
    ],
  },
  {
    title: "Παιδιά και μαθητές",
    paragraphs: [
      "Η εφαρμογή αφορά εκπαιδευτικό περιβάλλον. Η πρόσβαση μαθητών και σχετικών στοιχείων γίνεται στο πλαίσιο της εκπαιδευτικής υπηρεσίας του Modern Language και των αντίστοιχων λογαριασμών πρόσβασης.",
    ],
  },
  {
    title: "Αλλαγές στην πολιτική",
    paragraphs: [
      "Η πολιτική μπορεί να ενημερώνεται όταν αλλάζουν οι λειτουργίες της εφαρμογής ή οι νομικές απαιτήσεις. Η πιο πρόσφατη έκδοση θα είναι διαθέσιμη στο:",
      "https://www.modernlanguage.gr/privacy-policy",
    ],
  },
  {
    title: "Επικοινωνία",
    paragraphs: [
      "Για ερωτήσεις σχετικά με την παρούσα Πολιτική Απορρήτου ή τη διαχείριση προσωπικών δεδομένων, επικοινωνήστε στο:",
      "info@modernlanguage.gr",
    ],
  },
];

const englishSections: PolicySection[] = [
  {
    paragraphs: [
      "Last updated: June 9, 2026",
      "The Modern Language app is used by students, parents/guardians, and teachers to access educational information, exercises, vocabulary practice, library content, announcements, payment information, and progress data.",
    ],
  },
  {
    title: "Data Controller",
    paragraphs: [
      "Modern Language",
      "Website: https://www.modernlanguage.gr",
      "Contact email: info@modernlanguage.gr",
    ],
  },
  {
    title: "Data We Collect",
    paragraphs: ["The app may process:"],
    list: [
      "account information, such as email address and login details,",
      "student, parent/guardian, or teacher information required to provide the educational service,",
      "educational data, such as classes, lessons, vocabulary, homework, absences, grades, and progress,",
      "payment information displayed in the app for informational purposes,",
      "profile photos selected by the user,",
      "technical data required for login, security, and app functionality.",
    ],
  },
  {
    title: "Device Permissions",
    paragraphs: [
      "The app may request access to:",
      "These permissions are used only for the features described above.",
    ],
    list: [
      "the photo library, only when the user chooses a profile photo,",
      "the microphone, for spoken vocabulary exercises,",
      "speech recognition, to check spoken answers,",
      "internet access, to connect to the app services.",
    ],
  },
  {
    title: "Third-Party Services",
    paragraphs: [
      "The app uses Supabase for authentication, database services, and file storage. Users may sign in using email/password and, where available, Google sign-in.",
    ],
  },
  {
    title: "Data Sharing",
    paragraphs: [
      "We do not sell personal data. Data may be shared only when necessary for:",
    ],
    list: [
      "operating the app and its infrastructure,",
      "providing educational services,",
      "complying with legal obligations.",
    ],
  },
  {
    title: "Data Retention",
    paragraphs: [
      "Data is retained for as long as necessary to provide the service, for educational or administrative purposes, and to comply with legal obligations. When data is no longer required, it is deleted or anonymized where possible.",
    ],
  },
  {
    title: "Account and Data Deletion",
    paragraphs: [
      "Users can submit an account deletion request inside the app from:",
      "Profile > Account deletion request",
      "The request is reviewed by the Modern Language team so that data that can legally be deleted is deleted or anonymized.",
      "Users may also request deletion or correction of their personal data by contacting:",
      "info@modernlanguage.gr",
    ],
  },
  {
    title: "Security",
    paragraphs: [
      "We use technical and organizational measures to protect data, including authentication, user-based access controls, and role-based access restrictions.",
    ],
  },
  {
    title: "Children and Students",
    paragraphs: [
      "The app is intended for an educational environment. Access to student-related information is provided as part of the Modern Language educational service and the corresponding user access accounts.",
    ],
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "This policy may be updated when app features or legal requirements change. The latest version will be available at:",
      "https://www.modernlanguage.gr/privacy-policy",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "For questions about this Privacy Policy or personal data management, contact:",
      "info@modernlanguage.gr",
    ],
  },
];

function PolicyContent({
  sections,
  title,
}: {
  sections: PolicySection[];
  title: string;
}) {
  return (
    <article className={styles.policyArticle}>
      <h2>{title}</h2>
      {sections.map((section, index) => (
        <section className={styles.policySection} key={`${section.title}-${index}`}>
          {section.title ? <h3>{section.title}</h3> : null}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.list ? (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  );
}

export default function PrivacyPolicyTabs() {
  const [activeTab, setActiveTab] = useState<"el" | "en">("el");

  return (
    <section className={styles.policyShell} aria-label="Privacy policy language tabs">
      <div className={styles.tabList} role="tablist" aria-label="Language">
        <button
          aria-controls="privacy-policy-el"
          aria-selected={activeTab === "el"}
          className={activeTab === "el" ? styles.activeTab : ""}
          id="privacy-policy-tab-el"
          onClick={() => setActiveTab("el")}
          role="tab"
          type="button"
        >
          Ελληνικά
        </button>
        <button
          aria-controls="privacy-policy-en"
          aria-selected={activeTab === "en"}
          className={activeTab === "en" ? styles.activeTab : ""}
          id="privacy-policy-tab-en"
          onClick={() => setActiveTab("en")}
          role="tab"
          type="button"
        >
          English
        </button>
      </div>

      <div
        aria-labelledby="privacy-policy-tab-el"
        hidden={activeTab !== "el"}
        id="privacy-policy-el"
        role="tabpanel"
      >
        <PolicyContent
          sections={greekSections}
          title="Πολιτική Απορρήτου Modern Language"
        />
      </div>
      <div
        aria-labelledby="privacy-policy-tab-en"
        hidden={activeTab !== "en"}
        id="privacy-policy-en"
        role="tabpanel"
      >
        <PolicyContent
          sections={englishSections}
          title="Privacy Policy for Modern Language"
        />
      </div>
    </section>
  );
}
