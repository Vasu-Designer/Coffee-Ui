/**
 * Mock "backend" for the UI-only build: forms and checkout resolve locally
 * after a short, realistic delay. Nothing is sent anywhere.
 */
export const wait = (ms = 700) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Simulates a successful form submission (contact, newsletter). */
export async function mockSubmit(ms?: number): Promise<{ ok: true }> {
  await wait(ms);
  return { ok: true };
}

/** Creates a fake order number like KP-24817. */
export async function mockPlaceOrder(total: number): Promise<{ number: string; total: number }> {
  await wait(1100);
  return { number: `KP-${Math.floor(10000 + Math.random() * 90000)}`, total };
}
