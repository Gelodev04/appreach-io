import axios from 'axios';
import { NextResponse } from 'next/server';
import { env } from 'src/data/env/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
  }

  if (!state) {
    return NextResponse.json({ error: 'State parameter is missing' }, { status: 400 });
  }

  try {
    const { host } = JSON.parse(decodeURIComponent(state));

    if (!host) {
      return NextResponse.json({ error: 'Host parameter is missing' }, { status: 400 });
    }

    const response = await axios.post(
      `${env.HUBSPOT_OAUTH_FUNCTION}?code=${code}&host=${host}`,
      {
        code,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.status !== 200) {
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }

    return NextResponse.redirect(new URL('/hubspot', req.url));
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
