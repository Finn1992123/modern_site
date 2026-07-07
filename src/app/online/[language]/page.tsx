import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OnlineLanguagePage from "../OnlineLanguagePage";
import { getOnlineLanguage, onlineLanguages } from "../languages";

type Props = {
  params: Promise<{ language: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return onlineLanguages.map(({ slug }) => ({ language: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language: slug } = await params;
  const language = getOnlineLanguage(slug);
  if (!language) return {};

  const title = `${language.title} | Modern Language`;
  const description = `${language.title} On Demand για επίπεδα A1 έως C2. Πρόσβαση για έναν χρόνο και μελέτη από όπου θέλετε.`;

  return {
    title,
    description,
    alternates: { canonical: `/online/${language.slug}` },
    openGraph: {
      title,
      description,
      url: `/online/${language.slug}`,
      siteName: "Modern Language",
      locale: "el_GR",
      type: "website",
      images: [{ url: "/assets/logoTransp.png", alt: "Modern Language" }],
    },
  };
}

export default async function LanguagePage({ params }: Props) {
  const { language: slug } = await params;
  const language = getOnlineLanguage(slug);
  if (!language) notFound();

  return <OnlineLanguagePage language={language} />;
}
