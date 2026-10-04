/**
 * Ads lead-gen forms land on the same CRM with source=ad.
 * Sync is wired later; the list and filter already accept reclamă.
 */
export async function syncAdLeads(_input?: {
  userId?: string;
  clientId?: string | null;
}): Promise<{ imported: number }> {
  return { imported: 0 };
}
