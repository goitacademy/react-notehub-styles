import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { parse } from "cookie";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const apiRes = await api.post("auth/login", body);

  const cookieStore = await cookies();
  const setCookie = apiRes.headers["set-cookie"];

  if (setCookie) {
    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
    for (const cookieStr of cookieArray) {
      const parsed = parse(cookieStr);
      const options = {
        expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
        path: parsed.Path,
        maxAge: Number(parsed["Max-Age"]),
      };
      if (parsed.accessToken)
        cookieStore.set("accessToken", parsed.accessToken, options);
      if (parsed.refreshToken)
        cookieStore.set("refreshToken", parsed.refreshToken, options);
    }

    return NextResponse.json(apiRes.data);
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
