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
    answers: ["mother", "father", "brother"],
  },
  {
    question: "Choose the correct sentence.",
    answers: ["This is my family.", "This my is family.", "Family this is my."],
  },
  {
    question: "What does «sister» mean?",
    answers: ["αδερφή", "πατέρας", "οικογένεια"],
  },
];

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<
    "dashboard" | "myCourses" | "packages" | "lesson"
  >("dashboard");
  const [activeLanguage, setActiveLanguage] = useState(onlineLanguages[0]);
  const [profile, setProfile] = useState<Profile>({ full_name: "Μαθητή", email: "" });
  const [courses, setCourses] = useState<CourseAccessRow[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isDashboard = activeView === "dashboard";
  const isMyCourses = activeView === "myCourses";
  const isPackages = activeView === "packages";
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
          <a href="#progress">Πρόοδος</a>
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
                    : "Αγόρασε πακέτο"}
            </h1>
            <p>
              {isDashboard
                ? "Συνέχισε το ταξίδι σου στη γνώση."
                : isMyCourses
                  ? "Δες όλα τα ενεργά μαθήματα και συνέχισε από εκεί που έμεινες."
                  : isLesson
                    ? "Μάθε λεξιλόγιο για την οικογένεια και κάνε ένα σύντομο quiz."
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

  function toggleUnit(index: number) {
    setOpenUnits((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
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
          <h3>Θεωρία</h3>
          <p>
            Χρησιμοποιούμε τη φράση <strong>This is my...</strong> όταν θέλουμε
            να παρουσιάσουμε κάποιον δικό μας άνθρωπο.
          </p>
          <div className={styles.lessonExample}>
            <span>This is my mother.</span>
            <span>Αυτή είναι η μητέρα μου.</span>
          </div>
        </section>

        <section className={styles.lessonBlock}>
          <h3>Λεξιλόγιο</h3>
          <div className={styles.vocabularyGrid}>
            {vocabularyItems.map((item) => (
              <div className={styles.vocabularyCard} key={item.word}>
                <strong>{item.word}</strong>
                <span>{item.translation}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.lessonBlock}>
          <h3>Mini quiz</h3>
          <div className={styles.lessonQuiz}>
            {quizQuestions.map((item, index) => (
              <div className={styles.lessonQuestion} key={item.question}>
                <strong>
                  {index + 1}. {item.question}
                </strong>
                <div>
                  {item.answers.map((answer) => (
                    <button key={answer} type="button">
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

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
