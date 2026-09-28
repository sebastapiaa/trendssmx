// "Buy" button target (plain form POST — works without JS). Creates a
// Storefront cart for one in-stock variant and 303s to Shopify checkout.
// If the variant sold out in the meantime or checkout isn't reachable
// (primary-domain issue, see lib/shopify.ts), falls back to IG DM.
import { NextResponse, type NextRequest } from 'next/server';
import { DM_URL } from '@/lib/i18n';
import { createCheckout } from '@/lib/shopify';

const VARIANT_ID = /^gid:\/\/shopify\/ProductVariant\/\d+$/;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const variant = String(form.get('variant') ?? '');
  const backRaw = String(form.get('back') ?? '/tienda');
  // same-origin paths only (no open redirect via //evil.com)
  const back = backRaw.startsWith('/') && !backRaw.startsWith('//') ? backRaw : '/tienda';

  if (!VARIANT_ID.test(variant)) return NextResponse.redirect(new URL(back, req.url), 303);

  const checkoutUrl = await createCheckout(variant);
  if (checkoutUrl) return NextResponse.redirect(checkoutUrl, 303);
  // createCheckout returns null for sold out AND for unreachable checkout;
  // DM always works, so send them there rather than into a loop.
  return NextResponse.redirect(DM_URL, 303);
}
