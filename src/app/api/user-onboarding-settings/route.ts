import { NextResponse } from 'next/server';
import { getUserSettings } from 'src/services/db/user-settings';

export async function GET() {
  const settings = await getUserSettings({
    onboarding: { select: { completedOn: true } },
  });

  return NextResponse.json(settings);
}
