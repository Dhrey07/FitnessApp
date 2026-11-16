import type { Metadata } from 'next';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { getClientsOverview, requireCoach } from '@/lib/coach/data';
import { ClientsTable } from './ClientsTable';

export const metadata: Metadata = { title: 'Clients' };
export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  await requireCoach();
  const clients = await getClientsOverview();
  return (
    <AdminAppShell title="Clients" subtitle={`${clients.length} ${clients.length === 1 ? 'client' : 'clients'} on a plan or trial.`}>
      <ClientsTable clients={clients} />
    </AdminAppShell>
  );
}
