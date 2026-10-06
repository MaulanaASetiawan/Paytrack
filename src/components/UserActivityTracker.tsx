"use client";

import { useEffect, useRef } from "react";
import { updateLastActive } from "@/lib/actions/users";

export default function UserActivityTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      hasTracked.current = true;
      updateLastActive().catch(console.error);
    }
  }, []);

  return null;
}
