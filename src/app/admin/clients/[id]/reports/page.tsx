import { redirect } from 'next/navigation';

/** Reports for one client now live on the client's Reports tab. */
export default async function ClientReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/clients/${id}`);
}
