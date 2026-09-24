import { createEnquiryHandler } from '../server/enquiryHandler.js';
import { getFirebaseFirestore } from '../server/firebaseAdmin.js';
import { createFirestoreEnquiryStore } from '../server/firestoreEnquiryStore.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '16kb',
    },
  },
};

export default async function handler(
  request: Parameters<ReturnType<typeof createEnquiryHandler>>[0],
  response: Parameters<ReturnType<typeof createEnquiryHandler>>[1],
) {
  try {
    const enquiryHandler = createEnquiryHandler(createFirestoreEnquiryStore(getFirebaseFirestore()));
    await enquiryHandler(request, response);
  } catch {
    response.setHeader('Cache-Control', 'no-store');
    response.status(503).json({ success: false });
  }
}
