import { apiFetch } from "@/lib/api";

export interface OnboardingInfo {
  company_name: string;
  email: string;
  expires_at: string;
  already_onboarded: boolean;
}

export async function getOnboardingInfo(token: string): Promise<OnboardingInfo> {
  return apiFetch<OnboardingInfo>(
    `/onboarding/${encodeURIComponent(token)}`,
  );
}

export async function acceptOnboarding(body: {
  token: string;
  name: string;
  password: string;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/onboarding/accept", {
    method: "POST",
    body: JSON.stringify({
      token: body.token,
      name: body.name,
      password: body.password,
    }),
  });
}
