// 🧃
// modules/webapp/src/api/auth.ts
export async function getSession(): Promise<{ user: any } | null> {
    const res = await fetch("/api/session", {
    credentials: "include",
});
    if (!res.ok) return null;
    return res.json();
}

export function signIn(provider: string) {
    window.location.href = `/auth/signin/${provider}`;
}

export function signOut() {
    window.location.href = `/auth/signout`;
}
