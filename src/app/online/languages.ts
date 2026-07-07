export const onlineLanguages = [
  {
    slug: "agglika",
    checkoutSlug: "english",
    name: "Αγγλικά",
    genitive: "αγγλικών",
    flag: "/assets/uk.png",
    alt: "Σημαία Ηνωμένου Βασιλείου",
    title: "Online Μαθήματα Αγγλικών",
  },
  {
    slug: "gallika",
    checkoutSlug: "french",
    name: "Γαλλικά",
    genitive: "γαλλικών",
    flag: "/assets/french.png",
    alt: "Σημαία Γαλλίας",
    title: "Online Μαθήματα Γαλλικών",
  },
  {
    slug: "germanika",
    checkoutSlug: "german",
    name: "Γερμανικά",
    genitive: "γερμανικών",
    flag: "/assets/germany.png",
    alt: "Σημαία Γερμανίας",
    title: "Online Μαθήματα Γερμανικών",
  },
  {
    slug: "ispanika",
    checkoutSlug: "spanish",
    name: "Ισπανικά",
    genitive: "ισπανικών",
    flag: "/assets/spanish.png",
    alt: "Σημαία Ισπανίας",
    title: "Online Μαθήματα Ισπανικών",
  },
] as const;

export type OnlineLanguage = (typeof onlineLanguages)[number];

export function getOnlineLanguage(slug: string) {
  return onlineLanguages.find((language) => language.slug === slug);
}

export const onDemandLevels = [
  { level: "A1", title: "Beginner", description: "Τα πρώτα βήματα στη γλώσσα με βασικό λεξιλόγιο και απλές φράσεις." },
  { level: "A2", title: "Elementary", description: "Σταθερή βάση για καθημερινή επικοινωνία και κατανόηση απλών κειμένων." },
  { level: "B1", title: "Intermediate", description: "Πιο άνετη χρήση της γλώσσας σε πρακτικές καταστάσεις και οργανωμένο λόγο." },
  { level: "B2", title: "Upper Intermediate", description: "Ενίσχυση λεξιλογίου, γραμματικής και παραγωγής λόγου για υψηλότερη αυτονομία." },
  { level: "C1", title: "Advanced", description: "Προχωρημένη χρήση της γλώσσας με έμφαση στην ακρίβεια και την ευχέρεια." },
  { level: "C2", title: "Proficiency", description: "Ολοκληρωμένη κατάκτηση της γλώσσας για απαιτητική επικοινωνία και πιστοποίηση." },
] as const;
