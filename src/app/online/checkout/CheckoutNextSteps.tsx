"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import styles from "../../page.module.css";

export default function CheckoutNextSteps({ selectionQuery }: { selectionQuery: string }) {
  const [email, setEmail] = useState<string | null>(null);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const selected = new URLSearchParams(selectionQuery);
  const language = selected.get("language") ?? "english";
  const level = selected.get("level") ?? "A1";

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      setEmail(data.user?.email ?? null);
      setIsLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleCreatePendingOrder() {
    setOrderMessage("");
    setOrderError("");
    setIsCreatingOrder(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setOrderError("Πρέπει να συνδεθείτε πριν προχωρήσετε.");
      setIsCreatingOrder(false);
      return;
    }

    const { data: course, error: courseError } = await supabase
      .from("on_demand_courses")
      .select("id, price_cents, currency")
      .eq("language_code", language)
      .eq("level", level)
      .eq("is_active", true)
      .single();

    if (courseError || !course) {
      setOrderError("Δεν βρέθηκε το συγκεκριμένο επίπεδο. Δοκιμάστε ξανά.");
      setIsCreatingOrder(false);
      return;
    }

    const { error: orderInsertError } = await supabase.from("orders").insert({
      user_id: user.id,
      course_id: course.id,
      status: "pending",
      amount_cents: course.price_cents,
      currency: course.currency,
    });

    setIsCreatingOrder(false);

    if (orderInsertError) {
      setOrderError("Δεν μπορέσαμε να δημιουργήσουμε την παραγγελία. Δοκιμάστε ξανά.");
      return;
    }

    setOrderMessage("Η παραγγελία δημιουργήθηκε. Το επόμενο βήμα είναι η σύνδεση της πληρωμής.");
  }

  if (isLoading) {
    return (
      <section className={styles.checkoutNextSteps} aria-label="Επόμενα βήματα">
        <p className={styles.eyebrow}>Επόμενο βήμα</p>
        <h2>Έλεγχος λογαριασμού</h2>
        <p>Ελέγχουμε αν είστε ήδη συνδεδεμένοι.</p>
      </section>
    );
  }

  if (email) {
    return (
      <section className={styles.checkoutNextSteps} aria-label="Επόμενα βήματα">
        <p className={styles.eyebrow}>Επόμενο βήμα</p>
        <h2>Ολοκλήρωση αγοράς</h2>
        <p>
          Είστε συνδεδεμένοι ως <strong>{email}</strong>. Προχωρήστε στην πληρωμή
          για να ενεργοποιηθούν τα μαθήματά σας.
        </p>
        {orderError ? <p className={styles.authError}>{orderError}</p> : null}
        {orderMessage ? <p className={styles.authMessage}>{orderMessage}</p> : null}
        <button type="button" disabled={isCreatingOrder} onClick={handleCreatePendingOrder}>
          {isCreatingOrder ? "Δημιουργία παραγγελίας..." : "Πληρωμή"}
        </button>
        <Link className={styles.checkoutSecondaryButton} href="/online/my-courses">
          Τα μαθήματά μου
        </Link>
        <button
          className={styles.checkoutSecondaryButton}
          type="button"
          onClick={() => supabase.auth.signOut()}
        >
          Αποσύνδεση
        </button>
        <Link className={styles.checkoutBackLink} href="/online">
          Επιστροφή
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.checkoutNextSteps} aria-label="Επόμενα βήματα">
      <p className={styles.eyebrow}>Επόμενο βήμα</p>
      <h2>Σύνδεση ή δημιουργία λογαριασμού</h2>
      <p>
        Συνδεθείτε ή φτιάξτε έναν λογαριασμό για να ενεργοποιηθούν τα μαθήματά
        σας.
      </p>
      <Link className={styles.checkoutPrimaryButton} href={`/online/login?${selectionQuery}`}>
        Σύνδεση
      </Link>
      <Link
        className={styles.checkoutSecondaryButton}
        href={`/online/register?${selectionQuery}`}
      >
        Δημιουργία λογαριασμού
      </Link>
      <Link className={styles.checkoutBackLink} href="/online">
        Επιστροφή
      </Link>
    </section>
  );
}
