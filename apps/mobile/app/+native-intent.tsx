import { handleURLCallback } from '@stripe/stripe-react-native';

// Stripe sends the member back here after a bank or 3-D Secure page. The payment sheet picks the
// link up, so the router stays on the current screen instead of looking for a route.
export async function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  if (!path.includes('stripe-redirect')) return path;
  try {
    await handleURLCallback(path);
  } catch {}
  return null;
}
