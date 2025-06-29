import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  try {
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    await api.post('auth/logout', null, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    });

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
