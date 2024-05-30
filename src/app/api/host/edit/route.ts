export async function POST(request: Request) {
  const formData = await request.json();
  const {host} = formData;
  const {timezone} = formData;

  return Response.json({ host, timezone });
}
