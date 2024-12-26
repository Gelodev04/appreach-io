import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import { getUserSettingsById } from 'src/services/db/user-settings';

// src/app/api/plan/check-plan/route.ts
export async function GET(req: NextRequest) {
  try {
    // Example: Extract query parameters from the request
    const session = await auth();
    const id = session?.user.id;
    if (!id)
      return NextResponse.json({ error: 'Id is not found or unauthenticated.' }, { status: 500 });
    // Example: Process the request (this could be a database call, etc.)
    const { plan } = await getUserSettingsById(id, { plan: true });

    // Return a successful response
    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    // Handle any errors that occur
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
