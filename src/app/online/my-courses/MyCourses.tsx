"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import styles from "../../page.module.css";

type CourseAccessRow = {
  id: string;
  starts_at: string;
  expires_at: string;
  on_demand_courses: {
    language_name: string;
    level: string;
    title: string;
  } | null;
};

type SupabaseCourseAccessRow = Omit<CourseAccessRow, "on_demand_courses"> & {
  on_demand_courses:
    | {
        language_name: string;
        level: string;
        title: string;
      }
    | {
        language_name: string;
        level: string;
        title: string;
      }[]
    | null;
};

export default function MyCourses() {
  const [courses, setCourses] = useState<CourseAccessRow[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setIsLoading(false);
        return;
      }

      setEmail(user.email ?? "");

      const { data, error: accessError } = await supabase
        .from("course_access")
        .select(
          `
          id,
          starts_at,
          expires_at,
          on_demand_courses (
            language_name,
            level,
            title
          )
        `,
        )
        .eq("user_id", user.id)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (accessError) {
        setError("Δεν μπορέσαμε να φορτώσουμε τα μαθήματά σας.");
      } else {
        const normalizedCourses = ((data ?? []) as SupabaseCourseAccessRow[]).map((item) => ({
          ...item,
          on_demand_courses: Array.isArray(item.on_demand_courses)
            ? item.on_demand_courses[0] ?? null
            : item.on_demand_courses,
        }));

        setCourses(normalizedCourses);
      }

      setIsLoading(false);
    }

    loadCourses();
  }, []);

  if (isLoading) {
    return <p className={styles.authMessage}>Φορτώνουμε τα μαθήματά σας...</p>;
  }

  if (!email) {
    return (
      <div className={styles.myCoursesEmpty}>
        <p>Συνδεθείτε για να δείτε τα μαθήματά σας.</p>
        <Link className={styles.checkoutPrimaryButton} href="/online/login">
          Σύνδεση
        </Link>
      </div>
    );
  }

  if (error) {
    return <p className={styles.authError}>{error}</p>;
  }

  if (courses.length === 0) {
    return (
      <div className={styles.myCoursesEmpty}>
        <p>Δεν υπάρχει ακόμα ενεργό μάθημα στον λογαριασμό {email}.</p>
        <Link className={styles.checkoutPrimaryButton} href="/online">
          Επιλογή μαθήματος
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.myCoursesGrid}>
      {courses.map((item) => {
        const course = item.on_demand_courses;
        const expiresAt = new Intl.DateTimeFormat("el-GR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(item.expires_at));

        return (
          <article className={styles.myCourseCard} key={item.id}>
            <span>{course?.language_name}</span>
            <h2>{course?.title}</h2>
            <p>Επίπεδο {course?.level}</p>
            <strong>Ενεργό έως {expiresAt}</strong>
            <button type="button">Άνοιγμα μαθήματος</button>
          </article>
        );
      })}
    </div>
  );
}
