import { cookies } from "next/headers";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

const SESSION_COOKIE_NAME = "jobtracker_user";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthUser;

    if (!parsed.id || !parsed.email) {
      return null;
    }

    return parsed;

  } catch (e) {
    return null;
  }
}
