import { NextRequest, NextResponse } from 'next/server';
import { getUserSettingsByEmail } from 'src/services/db/user-settings';

// src/app/api/plan/check-plan/route.ts
export async function GET(req: NextRequest) {
  try {
    // Example: Extract query parameters from the request
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email'); // Replace 'param' with your actual query parameter name

    if (!email) return NextResponse.json({ error: 'Email is not found.' }, { status: 500 });
    // Example: Process the request (this could be a database call, etc.)
    const userSettings = await getUserSettingsByEmail(email, { plan: true });

    // Return a successful response
    return NextResponse.json(userSettings?.plan, { status: 200 });
  } catch (error) {
    // Handle any errors that occur
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
