"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import styles from "../../page.module.css";

export default function RegisterForm({ backQuery }: { backQuery: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setIsSubmitting(false);

    if (signUpError) {
      setError("Δεν μπορέσαμε να δημιουργήσουμε τον λογαριασμό. Δοκιμάστε ξανά.");
      return;
    }

    if (data.session) {
      router.push(`/online/checkout?${backQuery}`);
      return;
    }

    setMessage("Ο λογαριασμός δημιουργήθηκε. Ελέγξτε το email σας για επιβεβαίωση.");
  }

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <label>
        Ονοματεπώνυμο
        <input type="text" name="name" autoComplete="name" required />
      </label>
      <label>
        Email
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label>
        Κωδικός
        <input type="password" name="password" autoComplete="new-password" required />
      </label>
      {error ? <p className={styles.authError}>{error}</p> : null}
      {message ? <p className={styles.authMessage}>{message}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Δημιουργία..." : "Δημιουργία λογαριασμού"}
      </button>
      <Link href={`/online/login?${backQuery}`}>Έχετε ήδη λογαριασμό; Σύνδεση</Link>
      <Link className={styles.checkoutBackLink} href={`/online/checkout?${backQuery}`}>
        Επιστροφή
      </Link>
    </form>
  );
}
