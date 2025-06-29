import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import logger from '@workspace/logger';

export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  const redirectUrl = params.get("slug") || "/";

  logger.info('Disabling draft mode', {
    redirectUrl,
    userAgent: request.headers.get('user-agent'),
  });

  (await draftMode()).disable();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  logger.debug('Draft mode disabled, redirecting', { redirectUrl });
  redirect(redirectUrl);
}
