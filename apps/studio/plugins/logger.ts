import { definePlugin } from 'sanity';
import logger from '@workspace/logger';

export const studioLogger = definePlugin(() => {
  // Log studio initialization
  logger.info('Sanity Studio initializing', {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    nodeEnv: process.env.NODE_ENV,
  });

  return {
    name: 'studio-logger',
    // Hook into document actions
    document: {
      actions: (prev, context) => {
        // Log when document actions are loaded
        logger.debug('Document actions loaded', {
          documentId: context.documentId,
          documentType: context.schemaType,
          actionCount: prev.length,
        });
        return prev;
      },
    },
  };
});