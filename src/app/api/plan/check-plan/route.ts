import { NextResponse } from 'next/server';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { getUser } from 'src/auth/lib/mongodb/get-user';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch the user settings
    const userSettings = await getUser();

    // Check if the plan and trial_end exist and if the trial has expired
    if (userSettings?.plan?.trial_end) {
      const now = new Date();
      const trialEndDate = new Date(userSettings.plan.trial_end);

      if (trialEndDate < now) {
        // Update the plan status to 'trial_expired' if the trial has ended
        await db.collection('userSettings').updateOne(
          { _id: userSettings._id }, // Ensure _id is the correct identifier for your userSettings document
          { $set: { 'plan.status': 'trial_expired' } }
        );

        // Update the local userSettings object to reflect this change
        userSettings.plan.status = 'trial_expired';
      }
    }

    // Always return the plan status, reflecting updates if necessary
    return NextResponse.json(
      { plan: userSettings.plan },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      {
        status: error.statusCode || 500,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    );
  }
}
