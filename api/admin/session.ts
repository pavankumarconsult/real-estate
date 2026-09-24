import { getFirebaseAuth } from '../../server/firebaseAdmin.js';
import { adminErrorResponse, authorizeAdminRequest } from '../../server/adminAuth.js';
import { AdminApiRequest, AdminApiResponse, prepareAdminResponse } from '../../server/adminApi.js';

export default async function handler(request: AdminApiRequest, response: AdminApiResponse) {
  prepareAdminResponse(response);
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).json({ success: false, error: 'method-not-allowed' });
    return;
  }

  try {
    const token = await authorizeAdminRequest(request, getFirebaseAuth());
    response.status(200).json({
      authorized: true,
      email: typeof token.email === 'string' ? token.email : null,
    });
  } catch (error) {
    const failure = adminErrorResponse(error);
    response.status(failure.status).json(failure.body);
  }
}
