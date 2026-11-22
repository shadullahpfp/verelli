import { Metadata } from "next";
import VerdictClientContainer from "./VerdictClientContainer";

interface VerdictPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "verelli.lol | Startup Idea Verdict Bento",
  description:
    "Data-backed quantitative feasibility report cross-referenced against 1,740+ deceased YC post-mortems and 12,000+ Stripe-verified MRR feeds.",
};

export default async function VerdictPage({ params }: VerdictPageProps) {
  const { id } = await params;
  return <VerdictClientContainer id={id} />;
}
