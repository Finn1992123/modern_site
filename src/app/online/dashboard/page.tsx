"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import styles from "../../page.module.css";

type Profile = {
  full_name: string;
  email: string;
};

type CourseAccessRow = {
  id: string;
  expires_at: string;
  on_demand_courses: {
    language_code: string;
    language_name: string;
    level: string;
    title: string;
  } | null;
};

type SupabaseCourseAccessRow = Omit<CourseAccessRow, "on_demand_courses"> & {
  on_demand_courses:
    | {
        language_code: string;
        language_name: string;
        level: string;
        title: string;
      }
    | {
        language_code: string;
        language_name: string;
        level: string;
        title: string;
      }[]
    | null;
};

const baseDashboardStats = [
  {
    icon: "book",
    tone: "purple",
    label: "Ενεργά μαθήματα",
    value: "2",
    note: "Συνέχισε τη μάθηση!",
  },
  {
    icon: "trend",
    tone: "green",
    label: "Συνολική πρόοδος",
    value: "35%",
    note: "Μπράβο! Πάμε ακόμα πιο ψηλά!",
  },
  {
    icon: "flame",
    tone: "orange",
    label: "Ημέρες σερί",
    value: "7",
    note: "Απίστευτη συνέπεια!",
  },
  {
    icon: "trophy",
    tone: "blue",
    label: "Πιστοποιητικά",
    value: "0",
    note: "Ξεκλείδωσε τα πρώτα σου!",
  },
];

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

function DashboardStatIcon({ type }: { type: string }) {
  return (
    <svg
      className={styles.dashboardStatIcon}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {type === "book" ? (
        <path
          d="M5 5.5c0-1 .8-1.8 1.8-1.8H10c1.1 0 2 .9 2 2v15c0-1.1-.9-2-2-2H6.8c-1 0-1.8-.8-1.8-1.8V5.5Zm14 0c0-1-.8-1.8-1.8-1.8H14c-1.1 0-2 .9-2 2v15c0-1.1.9-2 2-2h3.2c1 0 1.8-.8 1.8-1.8V5.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      ) : null}
      {type === "trend" ? (
        <>
          <path
            d="M4 17h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="m6 14 4-4 3 3 5-7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 6h3v3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
      {type === "flame" ? (
        <path
          d="M12 21c3.4 0 6-2.4 6-5.9 0-2.8-1.5-4.9-3.7-7.1-.3 1.7-1 2.8-2 3.5.2-2.4-.7-5-3.1-7.5-.2 3.2-2.6 5.4-3.4 7.8-.3.8-.5 1.7-.5 2.6C5.3 18.3 8.3 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      ) : null}
      {type === "trophy" ? (
        <>
          <path
            d="M8 4h8v4.5a4 4 0 1 1-8 0V4Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8 6H5v1.5A3.5 3.5 0 0 0 8.5 11M16 6h3v1.5A3.5 3.5 0 0 1 15.5 11M12 12.5V17M9 20h6M10 17h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
    </svg>
  );
}

const packages = [
  { title: "Αγγλικά A2", subtitle: "Επίπεδο A2", price: "150,00€" },
  { title: "B2 Cambridge Preparation", subtitle: "Προετοιμασία για το πτυχίο", price: "150,00€" },
  { title: "IELTS Preparation", subtitle: "Προετοιμασία για IELTS", price: "150,00€" },
  { title: "Business English", subtitle: "Επαγγελματική Αγγλική", price: "150,00€" },
];

const quizzes = [
  { title: "Unit 3 Quiz", course: "Αγγλικά A1", score: "85%", points: "17/20" },
  { title: "Grammar Test 2", course: "Αγγλικά A1", score: "90%", points: "18/20" },
  { title: "Reading Practice 1", course: "B2 Cambridge", score: "65%", points: "13/20" },
];

const progressPrograms = [
  {
    id: "english-a1",
    title: "Αγγλικά A1",
    progress: 35,
    completedLessons: 4,
    totalLessons: 24,
    averageGrade: 82,
    vocabulary: 35,
    streak: 7,
    studyTime: "2ώ 45λ",
    nextGoal: "Unit 1 review",
    nextStep: "Κάνε ξανά την ακουστική άσκηση και μετά προχώρα στο επόμενο μάθημα.",
    recentGrades: [
      { label: "Λεξιλόγιο", value: 80 },
      { label: "Πολλαπλής επιλογής", value: 67 },
      { label: "Άκου και διάλεξε", value: 100 },
    ],
    weakSpots: [
      { label: "father", value: 48 },
      { label: "sister", value: 58 },
      { label: "This is my...", value: 64 },
    ],
  },
  {
    id: "french-b2",
    title: "Γαλλικά B2",
    progress: 62,
    completedLessons: 15,
    totalLessons: 24,
    averageGrade: 76,
    vocabulary: 128,
    streak: 4,
    studyTime: "1ώ 30λ",
    nextGoal: "Compréhension orale",
    nextStep: "Κάνε επανάληψη στην ακουστική κατανόηση και γράψε μία σύντομη περίληψη.",
    recentGrades: [
      { label: "Vocabulaire", value: 74 },
      { label: "Compréhension", value: 81 },
      { label: "Grammaire", value: 70 },
    ],
    weakSpots: [
      { label: "subjonctif", value: 52 },
      { label: "connecteurs", value: 60 },
      { label: "écoute rapide", value: 46 },
    ],
  },
];

const lessonUnits = [
  {
    title: "Unit 1",
    progress: 80,
    lessons: [
      "Lesson 1: Hello!",
      "Lesson 2: Numbers and colours",
      "Lesson 3: My classroom",
      "Lesson 4: This is my family",
      "Lesson 5: At home",
    ],
  },
  {
    title: "Unit 2",
    progress: 45,
    lessons: ["Lesson 1: Daily routines", "Lesson 2: My day", "Lesson 3: Present simple"],
  },
  {
    title: "Unit 3",
    progress: 20,
    lessons: ["Lesson 1: Food", "Lesson 2: At the cafe", "Lesson 3: I like / I don't like"],
  },
  {
    title: "Unit 4",
    progress: 0,
    lessons: ["Lesson 1: Animals", "Lesson 2: Describing pets", "Lesson 3: Mini review"],
  },
  {
    title: "Unit 5",
    progress: 0,
    lessons: ["Lesson 1: Places", "Lesson 2: Directions", "Lesson 3: Around town"],
  },
  {
    title: "Unit 6",
    progress: 0,
    lessons: ["Lesson 1: Clothes", "Lesson 2: Shopping", "Lesson 3: Prices"],
  },
  {
    title: "Unit 7",
    progress: 0,
    lessons: ["Lesson 1: Hobbies", "Lesson 2: Free time", "Lesson 3: Can / can't"],
  },
  {
    title: "Unit 8",
    progress: 0,
    lessons: ["Lesson 1: Revision", "Lesson 2: Practice test", "Lesson 3: Final quiz"],
  },
];

const vocabularyItems = [
  { word: "mother", translation: "μητέρα" },
  { word: "father", translation: "πατέρας" },
  { word: "sister", translation: "αδερφή" },
  { word: "brother", translation: "αδερφός" },
  { word: "family", translation: "οικογένεια" },
];

const quizQuestions = [
  {
    question: "How do we say «μητέρα» in English?",
    answers: ["mother", "father", "brother", "sister"],
  },
  {
    question: "Choose the correct sentence.",
    answers: ["This is my family.", "This my is family.", "Family this is my.", "My family this is."],
  },
  {
    question: "What does «sister» mean?",
    answers: ["αδερφή", "πατέρας", "οικογένεια", "αδερφός"],
  },
];

const fillWordQuestions = [
  {
    sentence: "This is my _____.",
    hint: "μητέρα",
    answer: "mother",
  },
  {
    sentence: "This is my _____.",
    hint: "πατέρας",
    answer: "father",
  },
  {
    sentence: "This is my _____.",
    hint: "αδερφή",
    answer: "sister",
  },
];

const listeningQuestions = [
  {
    word: "mother",
    answers: ["mother", "father", "sister", "family"],
  },
  {
    word: "brother",
    answers: ["brother", "mother", "father", "sister"],
  },
  {
    word: "family",
    answers: ["family", "father", "brother", "mother"],
  },
];

type ExerciseMode = "multipleChoice" | "fillWord" | "listening";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<
    "dashboard" | "myCourses" | "packages" | "progress" | "lesson"
  >("dashboard");
  const [activeLanguage, setActiveLanguage] = useState(onlineLanguages[0]);
  const [profile, setProfile] = useState<Profile>({ full_name: "Μαθητή", email: "" });
  const [courses, setCourses] = useState<CourseAccessRow[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isDashboard = activeView === "dashboard";
  const isMyCourses = activeView === "myCourses";
  const isPackages = activeView === "packages";
  const isProgress = activeView === "progress";
  const isLesson = activeView === "lesson";
  const displayName = profile.full_name.trim() || "Μαθητή";
  const userInitial = displayName.charAt(0).toUpperCase();
  const dashboardStats = useMemo(
    () =>
      baseDashboardStats.map((item) =>
        item.label === "Ενεργά μαθήματα"
          ? { ...item, value: String(courses.length) }
          : item,
      ),
    [courses.length],
  );

  useEffect(() => {
    async function loadDashboard() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setIsLoading(false);
        return;
      }

      const [{ data: profileData }, { data: accessData, error: accessError }] = await Promise.all([
        supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle(),
        supabase
          .from("course_access")
          .select(
            `
            id,
            expires_at,
            on_demand_courses (
              language_code,
              language_name,
              level,
              title
            )
          `,
          )
          .eq("user_id", user.id)
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false }),
      ]);

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || user.user_metadata.full_name || "Μαθητή",
          email: profileData.email || user.email || "",
        });
      } else {
        setProfile({
          full_name: String(user.user_metadata.full_name ?? "Μαθητή"),
          email: user.email ?? "",
        });
      }

      if (accessError) {
        setError("Δεν μπορέσαμε να φορτώσουμε τα μαθήματά σας.");
      } else {
        const normalizedCourses = ((accessData ?? []) as SupabaseCourseAccessRow[]).map(
          (item) => ({
            ...item,
            on_demand_courses: Array.isArray(item.on_demand_courses)
              ? item.on_demand_courses[0] ?? null
              : item.on_demand_courses,
          }),
        );

        setCourses(normalizedCourses);
      }

      setIsLoading(false);
    }

    loadDashboard();
  }, []);

  return (
    <main className={styles.dashboardShell}>
      <aside className={styles.dashboardSidebar}>
        <Link className={styles.dashboardBrand} href="/online">
          <Image src="/assets/logoTransp.png" alt="Modern Language" width={152} height={88} />
        </Link>
        <nav className={styles.dashboardMenu} aria-label="Dashboard navigation">
          <button
            className={isDashboard ? styles.dashboardMenuActive : ""}
            type="button"
            onClick={() => setActiveView("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={isMyCourses ? styles.dashboardMenuActive : ""}
            type="button"
            onClick={() => setActiveView("myCourses")}
          >
            Τα μαθήματά μου
          </button>
          <button
            className={isPackages ? styles.dashboardMenuActive : ""}
            type="button"
            onClick={() => setActiveView("packages")}
          >
            Αγόρασε πακέτο
          </button>
          <button
            className={isProgress ? styles.dashboardMenuActive : ""}
            type="button"
            onClick={() => setActiveView("progress")}
          >
            Πρόοδος
          </button>
          <a href="#quizzes">Quizzes / Tests</a>
          <a href="#certificates">Πιστοποιητικά</a>
          <a href="#settings">Ρυθμίσεις</a>
        </nav>
        <div className={styles.dashboardCodeBox}>
          <strong>Έχεις κωδικό;</strong>
          <p>Ενεργοποίησε τον κωδικό σου για έκπτωση.</p>
          <button type="button">Ενεργοποίηση</button>
        </div>
        <div className={styles.dashboardUser}>
          <div className={styles.dashboardAvatar}>{userInitial}</div>
          <div>
            <strong>{displayName}</strong>
            <span>{profile.email || "Δεν έχει συνδεθεί"}</span>
          </div>
        </div>
      </aside>

      <section className={styles.dashboardMain}>
        <header className={styles.dashboardTopbar}>
          <div>
            <h1>
              {isDashboard
                ? `Καλώς ήρθες πίσω, ${displayName}!`
                : isMyCourses
                  ? "Τα μαθήματά μου"
                : isLesson
                  ? "Lesson 4: This is my family"
                  : isProgress
                    ? "Πρόοδος"
                    : "Αγόρασε πακέτο"}
            </h1>
            <p>
              {isDashboard
                ? "Συνέχισε το ταξίδι σου στη γνώση."
                : isMyCourses
                  ? "Δες όλα τα ενεργά μαθήματα και συνέχισε από εκεί που έμεινες."
                  : isLesson
                    ? "Μάθε λεξιλόγιο για την οικογένεια και κάνε ένα σύντομο quiz."
                    : isProgress
                      ? "Δες την πορεία σου, τους βαθμούς και τι χρειάζεται επανάληψη."
                      : "Διάλεξε νέο On Demand πακέτο χωρίς να φύγεις από το dashboard."}
            </p>
          </div>
          <div className={styles.dashboardTopActions}>
            <span>3</span>
            <div>{userInitial}</div>
          </div>
        </header>

        {isDashboard ? (
          <>
            <div className={styles.dashboardStats}>
              {dashboardStats.map((item) => (
                <article className={styles.dashboardStatCard} key={item.label}>
                  <span
                    className={`${styles.dashboardStatIconWrap} ${
                      styles[`dashboardStatIcon${item.tone}` as keyof typeof styles]
                    }`}
                  >
                    <DashboardStatIcon type={item.icon} />
                  </span>
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p>{item.note}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.dashboardContentGrid}>
              <section className={styles.dashboardPanel}>
                <div className={styles.dashboardPanelHeader}>
                  <h2>Τα μαθήματά μου</h2>
                  <button type="button" onClick={() => setActiveView("myCourses")}>
                    Προβολή όλων
                  </button>
                </div>
                <DashboardCourses
                  courses={courses}
                  error={error}
                  isLoading={isLoading}
                  onContinue={() => setActiveView("lesson")}
                />
              </section>

              <aside className={styles.dashboardPanel}>
                <div className={styles.dashboardPanelHeader}>
                  <h2>Αγόρασε νέο πακέτο</h2>
                  <button type="button" onClick={() => setActiveView("packages")}>
                    Προβολή όλων
                  </button>
                </div>
                <DashboardPackages />
              </aside>
            </div>

            <div className={styles.dashboardContentGrid}>
              <DashboardQuizzes />
              <DashboardCalendar />
            </div>
          </>
        ) : isMyCourses ? (
          <section className={styles.dashboardPanel}>
            <div className={styles.dashboardPanelHeader}>
              <h2>Όλα τα μαθήματα</h2>
              <button type="button" onClick={() => setActiveView("dashboard")}>
                Πίσω στο Dashboard
              </button>
            </div>
            <DashboardCourses
              courses={courses}
              error={error}
              isLoading={isLoading}
              onContinue={() => setActiveView("lesson")}
            />
          </section>
        ) : isLesson ? (
          <LessonPlayer onBack={() => setActiveView("dashboard")} />
        ) : isProgress ? (
          <DashboardProgress />
        ) : (
          <section className={styles.dashboardPackageView}>
            <div className={styles.dashboardPanelHeader}>
              <h2>Διαθέσιμα πακέτα</h2>
              <button type="button" onClick={() => setActiveView("dashboard")}>
                Πίσω στο Dashboard
              </button>
            </div>
            <DashboardPackages
              activeLanguage={activeLanguage}
              onLanguageChange={setActiveLanguage}
              variant="cards"
            />
          </section>
        )}
      </section>
    </main>
  );
}

function DashboardCourses({
  courses,
  error,
  isLoading,
  onContinue,
}: {
  courses: CourseAccessRow[];
  error: string;
  isLoading: boolean;
  onContinue: () => void;
}) {
  if (isLoading) {
    return <p className={styles.authMessage}>Φορτώνουμε τα μαθήματά σας...</p>;
  }

  if (error) {
    return <p className={styles.authError}>{error}</p>;
  }

  if (courses.length === 0) {
    return (
      <div className={styles.myCoursesEmpty}>
        <p>Δεν υπάρχει ακόμα ενεργό μάθημα στον λογαριασμό σας.</p>
        <Link className={styles.checkoutPrimaryButton} href="/online">
          Επιλογή μαθήματος
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.dashboardCourseList}>
      {courses.map((item, index) => {
        const course = item.on_demand_courses;
        const progress = `${index === 0 ? 20 : 12}%`;
        const lesson =
          index === 0 ? "Lesson 4: This is my family" : "Reading & Use of English - Part 2";
        const image = getLanguageFlag(course?.language_code);

        return (
          <article className={styles.dashboardCourseCard} key={item.id}>
            <Image src={image} alt="" width={96} height={68} />
            <div className={styles.dashboardCourseBody}>
              <h3>{course?.title ?? "Online μάθημα"}</h3>
              <p>
                {course?.language_name ?? "Γλώσσα"} · Επίπεδο {course?.level ?? "-"} · 32 Μαθήματα
              </p>
              <div className={styles.dashboardProgressRow}>
                <span style={{ width: progress }} />
              </div>
              <div className={styles.dashboardLessonRow}>
                <span>{lesson}</span>
                <button type="button" onClick={onContinue}>
                  Συνέχισε
                </button>
              </div>
            </div>
            <strong>{progress}</strong>
          </article>
        );
      })}
    </div>
  );
}

function LessonPlayer({ onBack }: { onBack: () => void }) {
  const [openUnits, setOpenUnits] = useState([0]);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedPracticeAnswer, setSelectedPracticeAnswer] = useState<string | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceFinished, setPracticeFinished] = useState(false);
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [exerciseMode, setExerciseMode] = useState<ExerciseMode>("multipleChoice");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedExerciseAnswer, setSelectedExerciseAnswer] = useState<string | null>(null);
  const [fillWordAnswer, setFillWordAnswer] = useState("");
  const [exerciseScore, setExerciseScore] = useState(0);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false);
  const currentPracticeItem = vocabularyItems[practiceIndex];
  const practiceOptions = currentPracticeItem
    ? [
        currentPracticeItem.translation,
        ...vocabularyItems
          .filter((item) => item.word !== currentPracticeItem.word)
          .map((item) => item.translation)
          .slice(0, 3),
      ].map((_, index, options) => options[(index + practiceIndex) % options.length])
    : [];
  const currentExerciseTotal =
    exerciseMode === "multipleChoice"
      ? quizQuestions.length
      : exerciseMode === "fillWord"
        ? fillWordQuestions.length
        : listeningQuestions.length;
  const currentQuizQuestion = quizQuestions[exerciseIndex];
  const currentFillQuestion = fillWordQuestions[exerciseIndex];
  const currentListeningQuestion = listeningQuestions[exerciseIndex];
  const practiceGrade = Math.round((practiceScore / vocabularyItems.length) * 100);
  const exerciseGrade = Math.round((exerciseScore / currentExerciseTotal) * 100);

  function toggleUnit(index: number) {
    setOpenUnits((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  }

  function speakWord(word: string) {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  function startPractice() {
    setPracticeIndex(0);
    setSelectedPracticeAnswer(null);
    setPracticeScore(0);
    setPracticeFinished(false);
    setPracticeOpen(true);
  }

  function closePractice() {
    setPracticeOpen(false);
  }

  function choosePracticeAnswer(answer: string) {
    if (selectedPracticeAnswer || !currentPracticeItem) {
      return;
    }

    setSelectedPracticeAnswer(answer);

    if (answer === currentPracticeItem.translation) {
      setPracticeScore((score) => score + 1);
    }
  }

  function goToNextPracticeWord() {
    if (practiceIndex === vocabularyItems.length - 1) {
      setPracticeFinished(true);
      return;
    }

    setPracticeIndex((index) => index + 1);
    setSelectedPracticeAnswer(null);
  }

  function startExercise(mode: ExerciseMode) {
    setExerciseMode(mode);
    setExerciseIndex(0);
    setSelectedExerciseAnswer(null);
    setFillWordAnswer("");
    setExerciseScore(0);
    setExerciseFinished(false);
    setExerciseSubmitted(false);
    setExerciseOpen(true);
  }

  function closeExercise() {
    setExerciseOpen(false);
  }

  function chooseExerciseAnswer(answer: string) {
    if (exerciseSubmitted) {
      return;
    }

    const correctAnswer =
      exerciseMode === "multipleChoice"
        ? currentQuizQuestion?.answers[0]
        : currentListeningQuestion?.answers[0];

    if (!correctAnswer) {
      return;
    }

    setSelectedExerciseAnswer(answer);
    setExerciseSubmitted(true);

    if (answer === correctAnswer) {
      setExerciseScore((score) => score + 1);
    }
  }

  function submitFillWordAnswer() {
    if (exerciseSubmitted || exerciseMode !== "fillWord" || !currentFillQuestion) {
      return;
    }

    const normalizedAnswer = fillWordAnswer.trim().toLowerCase();
    setExerciseSubmitted(true);

    if (normalizedAnswer === currentFillQuestion.answer.toLowerCase()) {
      setExerciseScore((score) => score + 1);
    }
  }

  function goToNextExerciseQuestion() {
    if (exerciseIndex === currentExerciseTotal - 1) {
      setExerciseFinished(true);
      return;
    }

    setExerciseIndex((index) => index + 1);
    setSelectedExerciseAnswer(null);
    setFillWordAnswer("");
    setExerciseSubmitted(false);
  }

  return (
    <section className={styles.lessonPlayer}>
      <aside className={styles.lessonSidebar}>
        <div className={styles.dashboardPanelHeader}>
          <h2>Περιεχόμενα</h2>
          <button type="button" onClick={onBack}>
            Πίσω
          </button>
        </div>
        <div className={styles.lessonUnitList}>
          {lessonUnits.map((unit, unitIndex) => {
            const isOpen = openUnits.includes(unitIndex);

            return (
              <div className={styles.lessonUnit} key={unit.title}>
                <button
                  className={isOpen ? styles.lessonUnitOpen : ""}
                  type="button"
                  onClick={() => toggleUnit(unitIndex)}
                >
                  <span
                    className={styles.lessonUnitProgress}
                    style={{ "--progress": `${unit.progress}%` } as React.CSSProperties}
                  >
                    {unit.progress}%
                  </span>
                  <strong>{unit.title}</strong>
                  <em>{isOpen ? "−" : "+"}</em>
                </button>
                {isOpen ? (
                  <div className={styles.lessonList}>
                    {unit.lessons.map((item, lessonIndex) => {
                      const isActive = unitIndex === 0 && lessonIndex === 3;

                      return (
                        <button
                          className={isActive ? styles.lessonListActive : ""}
                          key={item}
                          type="button"
                        >
                          <span>{lessonIndex + 1}</span>
                          {item}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </aside>

      <article className={styles.lessonContent}>
        <div className={styles.lessonHero}>
          <p className={styles.eyebrow}>Αγγλικά A1</p>
          <h2>This is my family</h2>
          <p>
            Σε αυτό το μάθημα μαθαίνουμε βασικές λέξεις για την οικογένεια και
            πώς να παρουσιάζουμε απλά τα μέλη της.
          </p>
        </div>

        <section className={styles.lessonBlock}>
          <video className={styles.lessonVideo} controls preload="metadata">
            <source src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4" type="video/mp4" />
          </video>
        </section>

        <section className={styles.lessonBlock}>
          <div className={styles.lessonBlockHeader}>
            <h3>Λεξιλόγιο</h3>
            <button type="button" onClick={startPractice}>
              Εξάσκηση
            </button>
          </div>
          <div className={styles.vocabularyGrid}>
            {vocabularyItems.map((item) => (
              <div className={styles.vocabularyCard} key={item.word}>
                <div className={styles.vocabularyWordRow}>
                  <strong>{item.word}</strong>
                  <button
                    aria-label={`Play pronunciation for ${item.word}`}
                    className={styles.vocabularyAudioButton}
                    onClick={() => speakWord(item.word)}
                    title={`Play pronunciation for ${item.word}`}
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      fill="none"
                      height="17"
                      viewBox="0 0 24 24"
                      width="17"
                    >
                      <path
                        d="M4 9v6h4l5 4V5L8 9H4Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M16 9.5a4 4 0 0 1 0 5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M18.5 7a7 7 0 0 1 0 10"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
                <span>{item.translation}</span>
              </div>
            ))}
          </div>
        </section>

        {practiceOpen ? (
          <div
            aria-labelledby="vocabulary-practice-title"
            aria-modal="true"
            className={styles.practiceOverlay}
            role="dialog"
          >
            <div className={styles.practiceDialog}>
              <div className={styles.practiceHeader}>
                <div>
                  <span>
                    {practiceFinished
                      ? "Ολοκληρώθηκε"
                      : `${practiceIndex + 1}/${vocabularyItems.length}`}
                  </span>
                  <h3 id="vocabulary-practice-title">Εξάσκηση λεξιλογίου</h3>
                </div>
                <button aria-label="Κλείσιμο" type="button" onClick={closePractice}>
                  ×
                </button>
              </div>

              {practiceFinished ? (
                <div className={styles.practiceResult}>
                  <div
                    aria-label={`Βαθμός ${practiceGrade}%`}
                    className={styles.gradeRing}
                    style={{ "--grade": `${practiceGrade * 3.6}deg` } as React.CSSProperties}
                  >
                    <strong>{practiceGrade}%</strong>
                  </div>
                  <button type="button" onClick={startPractice}>
                    Ξανά
                  </button>
                </div>
              ) : currentPracticeItem ? (
                <>
                  <div className={styles.practicePrompt}>
                    <span>Βρες τη σωστή μετάφραση</span>
                    <div className={styles.practiceWordRow}>
                      <strong>{currentPracticeItem.word}</strong>
                      <button
                        aria-label={`Play pronunciation for ${currentPracticeItem.word}`}
                        className={styles.vocabularyAudioButton}
                        onClick={() => speakWord(currentPracticeItem.word)}
                        title={`Play pronunciation for ${currentPracticeItem.word}`}
                        type="button"
                      >
                        <svg
                          aria-hidden="true"
                          fill="none"
                          height="17"
                          viewBox="0 0 24 24"
                          width="17"
                        >
                          <path
                            d="M4 9v6h4l5 4V5L8 9H4Z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M16 9.5a4 4 0 0 1 0 5"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M18.5 7a7 7 0 0 1 0 10"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className={styles.practiceOptions}>
                    {practiceOptions.map((answer) => {
                      const isSelected = selectedPracticeAnswer === answer;
                      const isCorrect = answer === currentPracticeItem.translation;
                      const showCorrect = selectedPracticeAnswer && isCorrect;
                      const showWrong = isSelected && !isCorrect;

                      return (
                        <button
                          className={`${showCorrect ? styles.practiceOptionCorrect : ""} ${
                            showWrong ? styles.practiceOptionWrong : ""
                          }`}
                          disabled={Boolean(selectedPracticeAnswer)}
                          key={answer}
                          onClick={() => choosePracticeAnswer(answer)}
                          type="button"
                        >
                          {answer}
                        </button>
                      );
                    })}
                  </div>

                  {selectedPracticeAnswer ? (
                    <div className={styles.practiceFeedback}>
                      {selectedPracticeAnswer === currentPracticeItem.translation
                        ? "Σωστά"
                        : `Λάθος. Σωστή απάντηση: ${currentPracticeItem.translation}`}
                    </div>
                  ) : null}

                  <div className={styles.practiceFooter}>
                    <span>
                      Score: {practiceScore}/{vocabularyItems.length}
                    </span>
                    <button
                      disabled={!selectedPracticeAnswer}
                      onClick={goToNextPracticeWord}
                      type="button"
                    >
                      {practiceIndex === vocabularyItems.length - 1 ? "Τέλος" : "Επόμενο"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <section className={styles.lessonBlock}>
          <h3>Ασκήσεις</h3>
          <div className={styles.exerciseGrid}>
            <article className={styles.exerciseCard}>
              <div>
                <strong>Πολλαπλής επιλογής</strong>
                <span>Διάλεξε τη σωστή απάντηση.</span>
              </div>
              <button type="button" onClick={() => startExercise("multipleChoice")}>
                Έναρξη
              </button>
            </article>

            <article className={styles.exerciseCard}>
              <div>
                <strong>Συμπλήρωσε τη λέξη</strong>
                <span>Γράψε τη λέξη που λείπει.</span>
              </div>
              <button type="button" onClick={() => startExercise("fillWord")}>
                Έναρξη
              </button>
            </article>

            <article className={styles.exerciseCard}>
              <div>
                <strong>Άκου και διάλεξε</strong>
                <span>Άκου τη λέξη και βρες τη σωστή.</span>
              </div>
              <button type="button" onClick={() => startExercise("listening")}>
                Έναρξη
              </button>
            </article>
          </div>
        </section>

        {exerciseOpen ? (
          <div
            aria-labelledby="exercise-title"
            aria-modal="true"
            className={styles.practiceOverlay}
            role="dialog"
          >
            <div className={styles.practiceDialog}>
              <div className={styles.practiceHeader}>
                <div>
                  <span>
                    {exerciseFinished ? "Ολοκληρώθηκε" : `${exerciseIndex + 1}/${currentExerciseTotal}`}
                  </span>
                  <h3 id="exercise-title">
                    {exerciseMode === "multipleChoice"
                      ? "Πολλαπλής επιλογής"
                      : exerciseMode === "fillWord"
                        ? "Συμπλήρωσε τη λέξη"
                        : "Άκου και διάλεξε"}
                  </h3>
                </div>
                <button aria-label="Κλείσιμο" type="button" onClick={closeExercise}>
                  ×
                </button>
              </div>

              {exerciseFinished ? (
                <div className={styles.practiceResult}>
                  <div
                    aria-label={`Βαθμός ${exerciseGrade}%`}
                    className={styles.gradeRing}
                    style={{ "--grade": `${exerciseGrade * 3.6}deg` } as React.CSSProperties}
                  >
                    <strong>{exerciseGrade}%</strong>
                  </div>
                  <button type="button" onClick={() => startExercise(exerciseMode)}>
                    Ξανά
                  </button>
                </div>
              ) : exerciseMode === "multipleChoice" && currentQuizQuestion ? (
                <>
                  <div className={styles.practicePrompt}>
                    <span>Διάλεξε τη σωστή απάντηση</span>
                    <strong>{currentQuizQuestion.question}</strong>
                  </div>

                  <div className={styles.practiceOptions}>
                    {currentQuizQuestion.answers.map((answer) => {
                      const isSelected = selectedExerciseAnswer === answer;
                      const isCorrect = answer === currentQuizQuestion.answers[0];
                      const showCorrect = exerciseSubmitted && isCorrect;
                      const showWrong = isSelected && !isCorrect;

                      return (
                        <button
                          className={`${showCorrect ? styles.practiceOptionCorrect : ""} ${
                            showWrong ? styles.practiceOptionWrong : ""
                          }`}
                          disabled={exerciseSubmitted}
                          key={answer}
                          onClick={() => chooseExerciseAnswer(answer)}
                          type="button"
                        >
                          {answer}
                        </button>
                      );
                    })}
                  </div>

                  {exerciseSubmitted ? (
                    <div className={styles.practiceFeedback}>
                      {selectedExerciseAnswer === currentQuizQuestion.answers[0]
                        ? "Σωστά"
                        : `Λάθος. Σωστή απάντηση: ${currentQuizQuestion.answers[0]}`}
                    </div>
                  ) : null}

                  <div className={styles.practiceFooter}>
                    <span>
                      Score: {exerciseScore}/{currentExerciseTotal}
                    </span>
                    <button
                      disabled={!exerciseSubmitted}
                      onClick={goToNextExerciseQuestion}
                      type="button"
                    >
                      {exerciseIndex === currentExerciseTotal - 1 ? "Τέλος" : "Επόμενο"}
                    </button>
                  </div>
                </>
              ) : exerciseMode === "fillWord" && currentFillQuestion ? (
                <>
                  <div className={styles.practicePrompt}>
                    <span>Συμπλήρωσε τη λέξη για: {currentFillQuestion.hint}</span>
                    <strong>{currentFillQuestion.sentence}</strong>
                  </div>

                  <div className={styles.fillWordForm}>
                    <input
                      disabled={exerciseSubmitted}
                      onChange={(event) => setFillWordAnswer(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          submitFillWordAnswer();
                        }
                      }}
                      placeholder="Γράψε εδώ"
                      type="text"
                      value={fillWordAnswer}
                    />
                    <button
                      disabled={exerciseSubmitted || !fillWordAnswer.trim()}
                      onClick={submitFillWordAnswer}
                      type="button"
                    >
                      Έλεγχος
                    </button>
                  </div>

                  {exerciseSubmitted ? (
                    <div className={styles.practiceFeedback}>
                      {fillWordAnswer.trim().toLowerCase() === currentFillQuestion.answer.toLowerCase()
                        ? "Σωστά"
                        : `Λάθος. Σωστή απάντηση: ${currentFillQuestion.answer}`}
                    </div>
                  ) : null}

                  <div className={styles.practiceFooter}>
                    <span>
                      Score: {exerciseScore}/{currentExerciseTotal}
                    </span>
                    <button
                      disabled={!exerciseSubmitted}
                      onClick={goToNextExerciseQuestion}
                      type="button"
                    >
                      {exerciseIndex === currentExerciseTotal - 1 ? "Τέλος" : "Επόμενο"}
                    </button>
                  </div>
                </>
              ) : exerciseMode === "listening" && currentListeningQuestion ? (
                <>
                  <div className={styles.practicePrompt}>
                    <span>Πάτησε το ηχείο και διάλεξε τη λέξη που άκουσες</span>
                    <button
                      aria-label="Άκου τη λέξη"
                      className={styles.listeningButton}
                      onClick={() => speakWord(currentListeningQuestion.word)}
                      type="button"
                    >
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="28"
                        viewBox="0 0 24 24"
                        width="28"
                      >
                        <path
                          d="M4 9v6h4l5 4V5L8 9H4Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                        <path
                          d="M16 9.5a4 4 0 0 1 0 5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="2"
                        />
                        <path
                          d="M18.5 7a7 7 0 0 1 0 10"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className={styles.practiceOptions}>
                    {currentListeningQuestion.answers.map((answer) => {
                      const isSelected = selectedExerciseAnswer === answer;
                      const isCorrect = answer === currentListeningQuestion.answers[0];
                      const showCorrect = exerciseSubmitted && isCorrect;
                      const showWrong = isSelected && !isCorrect;

                      return (
                        <button
                          className={`${showCorrect ? styles.practiceOptionCorrect : ""} ${
                            showWrong ? styles.practiceOptionWrong : ""
                          }`}
                          disabled={exerciseSubmitted}
                          key={answer}
                          onClick={() => chooseExerciseAnswer(answer)}
                          type="button"
                        >
                          {answer}
                        </button>
                      );
                    })}
                  </div>

                  {exerciseSubmitted ? (
                    <div className={styles.practiceFeedback}>
                      {selectedExerciseAnswer === currentListeningQuestion.answers[0]
                        ? "Σωστά"
                        : `Λάθος. Σωστή απάντηση: ${currentListeningQuestion.answers[0]}`}
                    </div>
                  ) : null}

                  <div className={styles.practiceFooter}>
                    <span>
                      Score: {exerciseScore}/{currentExerciseTotal}
                    </span>
                    <button
                      disabled={!exerciseSubmitted}
                      onClick={goToNextExerciseQuestion}
                      type="button"
                    >
                      {exerciseIndex === currentExerciseTotal - 1 ? "Τέλος" : "Επόμενο"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className={styles.lessonActions}>
          <button type="button">Ολοκλήρωση μαθήματος</button>
          <button type="button">Επόμενο μάθημα</button>
        </div>
      </article>
    </section>
  );
}

function getLanguageFlag(languageCode: string | undefined) {
  if (languageCode === "french") {
    return "/assets/french.png";
  }

  if (languageCode === "german") {
    return "/assets/germany.png";
  }

  if (languageCode === "spanish") {
    return "/assets/spanish.png";
  }

  return "/assets/uk.png";
}

function DashboardPackages({
  activeLanguage = onlineLanguages[0],
  onLanguageChange,
  variant = "list",
}: {
  activeLanguage?: (typeof onlineLanguages)[number];
  onLanguageChange?: (language: (typeof onlineLanguages)[number]) => void;
  variant?: "list" | "cards";
}) {
  if (variant === "cards") {
    return (
      <div className={styles.dashboardPackageFlow}>
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
                onClick={() => onLanguageChange?.(language)}
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
    );
  }

  return (
    <div className={styles.dashboardPackageList}>
      {packages.map((item) => (
        <Link className={styles.dashboardPackageItem} href="/online" key={item.title}>
          <Image src="/assets/uk.png" alt="" width={34} height={24} />
          <div>
            <strong>{item.title}</strong>
            <span>{item.subtitle}</span>
          </div>
          <em>{item.price}</em>
        </Link>
      ))}
    </div>
  );
}

function DashboardProgress() {
  const [selectedProgramId, setSelectedProgramId] = useState(progressPrograms[0].id);
  const selectedProgram =
    progressPrograms.find((program) => program.id === selectedProgramId) ?? progressPrograms[0];
  const progressStats = [
    {
      icon: "progress",
      tone: "purple",
      label: "Συνολική πρόοδος",
      value: `${selectedProgram.progress}%`,
      note: selectedProgram.title,
    },
    {
      icon: "lessons",
      tone: "blue",
      label: "Μαθήματα",
      value: `${selectedProgram.completedLessons}/${selectedProgram.totalLessons}`,
      note: "ολοκληρωμένα μαθήματα",
    },
    {
      icon: "grade",
      tone: "green",
      label: "Μέσος βαθμός",
      value: `${selectedProgram.averageGrade}%`,
      note: "από ασκήσεις και tests",
    },
    {
      icon: "vocabulary",
      tone: "orange",
      label: "Λεξιλόγιο",
      value: String(selectedProgram.vocabulary),
      note: "λέξεις εξασκημένες",
    },
    {
      icon: "streak",
      tone: "orange",
      label: "Streak",
      value: String(selectedProgram.streak),
      note: "συνεχόμενες ημέρες",
    },
    {
      icon: "time",
      tone: "blue",
      label: "Χρόνος μελέτης",
      value: selectedProgram.studyTime,
      note: "αυτή την εβδομάδα",
    },
  ];

  return (
    <section className={styles.progressView} id="progress">
      <div className={styles.progressProgramTabs} role="tablist" aria-label="Προγράμματα">
        {progressPrograms.map((program) => {
          const isActive = program.id === selectedProgram.id;

          return (
            <button
              aria-selected={isActive}
              className={isActive ? styles.progressProgramTabActive : ""}
              key={program.id}
              onClick={() => setSelectedProgramId(program.id)}
              role="tab"
              type="button"
            >
              <strong>{program.title}</strong>
              <span>{program.progress}% πρόοδος</span>
            </button>
          );
        })}
      </div>

      <div className={styles.progressStatGrid}>
        {progressStats.map((item) => (
          <article className={styles.progressCard} key={item.label}>
            <span
              className={`${styles.dashboardStatIconWrap} ${
                styles[`dashboardStatIcon${item.tone}` as keyof typeof styles]
              }`}
            >
              <ProgressIcon type={item.icon} />
            </span>
            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.note}</p>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.progressContentGrid}>
        <section className={styles.progressPanel}>
          <div className={styles.dashboardPanelHeader}>
            <h2>Συνολική πρόοδος</h2>
            <span>{selectedProgram.progress}%</span>
          </div>
          <div className={styles.progressCourseChart}>
            <div
              className={styles.progressCourseRing}
              style={{ "--progress": `${selectedProgram.progress * 3.6}deg` } as React.CSSProperties}
            >
              <strong>{selectedProgram.progress}%</strong>
            </div>
            <div>
              <strong>{selectedProgram.title}</strong>
              <p>
                {selectedProgram.completedLessons} από {selectedProgram.totalLessons} μαθήματα
                ολοκληρώθηκαν. Επόμενος στόχος: {selectedProgram.nextGoal}.
              </p>
              <div className={styles.dashboardProgressRow}>
                <span style={{ width: `${selectedProgram.progress}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.progressPanel}>
          <div className={styles.dashboardPanelHeader}>
            <h2>Τελευταίες βαθμολογίες</h2>
            <span>Μέσος {selectedProgram.averageGrade}%</span>
          </div>
          <div className={styles.progressBarChart}>
            {selectedProgram.recentGrades.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <div>
                  <i style={{ width: `${item.value}%` }} />
                </div>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className={styles.progressContentGrid}>
        <section className={styles.progressPanel}>
          <div className={styles.dashboardPanelHeader}>
            <h2>Χρειάζεται επανάληψη</h2>
            <span>Αδύναμα σημεία</span>
          </div>
          <div className={styles.weakSpotList}>
            {selectedProgram.weakSpots.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <div className={styles.dashboardProgressRow}>
                  <span style={{ width: `${item.value}%` }} />
                </div>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.progressPanel}>
          <div className={styles.progressNextStep}>
            <span
              className={`${styles.dashboardStatIconWrap} ${styles.dashboardStatIconpurple}`}
            >
              <ProgressIcon type="target" />
            </span>
            <div>
              <h2>Επόμενο βήμα</h2>
              <p>{selectedProgram.nextStep}</p>
            </div>
            <button type="button">Συνέχεια</button>
          </div>
        </section>
      </div>
    </section>
  );
}

function ProgressIcon({ type }: { type: string }) {
  return (
    <svg
      aria-hidden="true"
      className={styles.progressIcon}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {type === "progress" ? (
        <>
          <path d="M4 19V5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M4 19h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="m7 15 3-4 3 2 4-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </>
      ) : null}
      {type === "lessons" ? (
        <path d="M5 5.5c0-1 .8-1.8 1.8-1.8H10c1.1 0 2 .9 2 2v15c0-1.1-.9-2-2-2H6.8c-1 0-1.8-.8-1.8-1.8V5.5Zm14 0c0-1-.8-1.8-1.8-1.8H14c-1.1 0-2 .9-2 2v15c0-1.1.9-2 2-2h3.2c1 0 1.8-.8 1.8-1.8V5.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      ) : null}
      {type === "grade" ? (
        <>
          <path d="M12 3.5 14.6 9l5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.8 1-5.8-4.2-4.1L9.4 9 12 3.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </>
      ) : null}
      {type === "vocabulary" ? (
        <>
          <path d="M5 6h14M5 12h14M5 18h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M8 4v16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </>
      ) : null}
      {type === "streak" ? (
        <path d="M12 21c3.4 0 6-2.4 6-5.9 0-2.8-1.5-4.9-3.7-7.1-.3 1.7-1 2.8-2 3.5.2-2.4-.7-5-3.1-7.5-.2 3.2-2.6 5.4-3.4 7.8-.3.8-.5 1.7-.5 2.6C5.3 18.3 8.3 21 12 21Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      ) : null}
      {type === "time" ? (
        <>
          <path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 8v4l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </>
      ) : null}
      {type === "target" ? (
        <>
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" stroke="currentColor" strokeWidth="1.8" />
        </>
      ) : null}
    </svg>
  );
}

function DashboardQuizzes() {
  return (
    <section className={styles.dashboardPanel} id="quizzes">
      <div className={styles.dashboardPanelHeader}>
        <h2>Πρόσφατα Quizzes / Tests</h2>
        <a href="#quizzes">Προβολή όλων</a>
      </div>
      <div className={styles.dashboardQuizGrid}>
        {quizzes.map((quiz) => (
          <article className={styles.dashboardQuizCard} key={quiz.title}>
            <div>
              <strong>{quiz.title}</strong>
              <span>{quiz.course}</span>
            </div>
            <em>
              {quiz.score}
              <small>{quiz.points}</small>
            </em>
          </article>
        ))}
      </div>
    </section>
  );
}

function DashboardCalendar() {
  return (
    <aside className={styles.dashboardPanel}>
      <div className={styles.dashboardPanelHeader}>
        <h2>Ημερολόγιο μάθησης</h2>
        <a href="#calendar">Προβολή όλων</a>
      </div>
      <div className={styles.dashboardCalendar}>
        <div>
          <span>Δε</span>
          <span>Τρ</span>
          <span>Τε</span>
          <span>Πε</span>
          <span>Πα</span>
          <span>Σα</span>
          <span>Κυ</span>
          <strong>20</strong>
          <strong>21</strong>
          <strong>22</strong>
          <strong>23</strong>
          <strong>24</strong>
          <strong>25</strong>
          <strong>26</strong>
        </div>
        <p>Στόχος: 30 λεπτά την ημέρα</p>
        <div className={styles.dashboardProgressRow}>
          <span style={{ width: "66%" }} />
        </div>
      </div>
    </aside>
  );
}
