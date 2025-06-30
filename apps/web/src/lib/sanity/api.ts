import { validateSanityEnv } from '@workspace/env-config';

// Validate Sanity environment variables
const sanityEnv = validateSanityEnv();

export const dataset = sanityEnv.NEXT_PUBLIC_SANITY_DATASET;
export const projectId = sanityEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;

/**
 * see https://www.sanity.io/docs/api-versioning for how versioning works
 */
export const apiVersion = sanityEnv.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-10";

/**
 * Used to configure edit intent links, for Presentation Mode, as well as to configure where the Studio is mounted in the router.
 */
export const studioUrl = sanityEnv.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";
