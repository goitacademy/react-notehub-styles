import { NextRequest, NextResponse } from 'next/server';
import { api, ApiError } from '../api';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const searchText = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);

    const { data } = await api.get('/notes', {
      params: {
        ...(searchText !== '' && { search: searchText }),
        page,
        perPage: 12,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as ApiError).response?.data?.error ?? (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data } = await api.post('/notes', body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as ApiError).response?.data?.error ?? (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }
}
