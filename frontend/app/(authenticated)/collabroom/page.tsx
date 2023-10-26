"use client";

import { Room } from "@/views/collabroom";
import useAuthenticated from "@/hooks/guards/useAuthenticated";

// karwi: better name?
export default function CollabRoom() {
  // useAuthenticated();
  return <Room />;
}
