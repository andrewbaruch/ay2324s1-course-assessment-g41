"use client";

import { MatchingForm } from "@/views/matching";
import useAuthenticated from "@/hooks/guards/useAuthenticated";

// karwi: better name?
export default function Matching() {
  // useAuthenticated();
  return <MatchingForm />;
}
