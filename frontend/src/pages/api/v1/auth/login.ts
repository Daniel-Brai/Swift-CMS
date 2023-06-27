import type { APIRoute } from "astro";
import { auth } from "@lib/firebase/server";

export const get: APIRoute = async ({ request, cookies, redirect }) => {
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!idToken) {
    return new Response(
      "Unauthorized Request - No token found",
      { status: 401 }
    );
  }

  /* Verify id token */
  let sessionCookie;
  try {
    await auth.verifyIdToken(idToken);
    const fiveDays = 60 * 60 * 24 * 5 * 1000;
    sessionCookie = await auth
      .createSessionCookie(idToken, { expiresIn: fiveDays })
      .catch((error) => {
        return new Response(
          JSON.stringify({
            message: error.message,
          }),
          { status: 401 }
        );
      });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized Request - Invalid token",
      }),
      { status: 401 }
    );
  }

  cookies.set("session", sessionCookie, {
    path: "/",
  });

  return redirect("/dashboard", 302);
};
