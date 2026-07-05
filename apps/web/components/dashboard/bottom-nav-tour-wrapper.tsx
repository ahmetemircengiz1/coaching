"use client";

import { TourProvider, TourButton } from "./onboarding-tour";

export function BottomNavTourWrapper({ children }: { children: React.ReactNode }) {
  return <TourProvider>{children}</TourProvider>;
}

export function BottomNavTourButton() {
  return <TourButton />;
}
