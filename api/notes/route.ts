import { NextRequest, NextResponse } from 'next/server';
import { api } from '../api';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const search = request.nextUrl.searchParams.get('search') ?? '';
  const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
  const rawTag = request.nextUrl.searchParams.get('tag') ?? '';
  const tag = rawTag === 'All' ? '' : rawTag;

  const { data } = await api('/notes', {
    params: {
      ...(search !== '' && { search }),
      page,
      perPage: 12,
      ...(tag && { tag }),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  if (data) {
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  try {
    const body = await request.json();

    const { data } = await api.post('/notes', body, {
      headers: {
        Cookie: cookieStore.toString(),
        'Content-Type': 'application/json',
      },
    });

    if (data) {
      return NextResponse.json(data, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating note:', error);
  }

  return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
}
