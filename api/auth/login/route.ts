import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parse } from 'cookie';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const apiRes = await api.post('auth/login', body);

  const cookieStore = await cookies();
  const setCookie = apiRes.headers['set-cookie'];
  if (setCookie) {
    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
    let accessToken = '';
    let refreshToken = '';

    for (const cookieStr of cookieArray) {
      const parsed = parse(cookieStr);
      if (parsed.accessToken) accessToken = parsed.accessToken;
      if (parsed.refreshToken) refreshToken = parsed.refreshToken;
    }

    if (accessToken) cookieStore.set('accessToken', accessToken);
    if (refreshToken) cookieStore.set('refreshToken', refreshToken);

    return NextResponse.json(apiRes.data);
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
