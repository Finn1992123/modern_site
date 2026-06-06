"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import styles from "../../page.module.css";

export default function LoginForm({ backQuery }: { backQuery: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError("Τα στοιχεία σύνδεσης δεν είναι σωστά.");
      return;
    }

    router.push(`/online/dashboard?${backQuery}`);
  }

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label>
        Κωδικός
        <input type="password" name="password" autoComplete="current-password" required />
      </label>
      {error ? <p className={styles.authError}>{error}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Σύνδεση..." : "Σύνδεση"}
      </button>
      <Link href={`/online/register?${backQuery}`}>Δεν έχετε λογαριασμό; Δημιουργία λογαριασμού</Link>
      <Link className={styles.checkoutBackLink} href={`/online/checkout?${backQuery}`}>
        Επιστροφή
      </Link>
    </form>
  );
}
