import clientPromise from 'src/auth/lib/mongodb/db-mongo';

const types = [
  'googleBusiness',
  'googlePersonal',
  'microsoftBusiness',
  'microsoftPersonal',
  'yahooPersonal',
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);

    // Count all email accounts for each seed account type
    const seedAccounts = await Promise.all(
      types.map(async (name) => {
        const amount = await db.collection('emailAccounts').countDocuments({
          espCamelCase: name,
          'webMail.status': 'ready',
          'webMail.routine': 'engagementAccount',
        });
        return { name, amount };
      })
    );

    return Response.json({ seedAccounts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
