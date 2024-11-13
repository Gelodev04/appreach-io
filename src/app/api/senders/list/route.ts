import { getUserSettings, updateUserSettings } from 'src/services/db/userSettings';

export async function GET() {
  try {
    const { hosts, senders } = await getUserSettings({ hosts: true, senders: true });
    if (hosts.length !== senders?.usedCount) {
      // update the senders.useCount
      const updatedSendersUsedCount = await updateUserSettings(
        {
          senders: {
            usedCount: hosts?.length,
            assignedCount: senders?.assignedCount ?? 0,
          },
        },
        { senders: true }
      );

      return Response.json({ updatedSendersUsedCount });
    }
    return Response.json({ senders });
  } catch (error) {
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
