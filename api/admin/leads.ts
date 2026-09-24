import { getFirebaseAuth, getFirebaseFirestore } from '../../server/firebaseAdmin.js';
import { adminErrorResponse, authorizeAdminRequest } from '../../server/adminAuth.js';
import {
  AdminApiRequest,
  AdminApiResponse,
  hasValidJsonBody,
  parseDeleteRequest,
  parseLeadQuery,
  prepareAdminResponse,
} from '../../server/adminApi.js';
import { deleteAdminLead, queryAdminLeads } from '../../server/adminLeads.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '32kb',
    },
  },
};

export default async function handler(request: AdminApiRequest, response: AdminApiResponse) {
  prepareAdminResponse(response);
  if (request.method !== 'POST' && request.method !== 'DELETE') {
    response.setHeader('Allow', 'POST, DELETE');
    response.status(405).json({ success: false, error: 'method-not-allowed' });
    return;
  }
  if (!hasValidJsonBody(request)) {
    response.status(400).json({ success: false, error: 'invalid-request' });
    return;
  }

  try {
    await authorizeAdminRequest(request, getFirebaseAuth());
    const database = getFirebaseFirestore();

    if (request.method === 'DELETE') {
      const leadId = parseDeleteRequest(request.body);
      if (!leadId) {
        response.status(400).json({ success: false, error: 'invalid-request' });
        return;
      }
      const deleted = await deleteAdminLead(database, leadId);
      if (!deleted) {
        response.status(404).json({ success: false, error: 'not-found' });
        return;
      }
      response.status(200).json({ success: true });
      return;
    }

    const query = parseLeadQuery(request.body);
    if (!query) {
      response.status(400).json({ success: false, error: 'invalid-request' });
      return;
    }
    response.status(200).json(await queryAdminLeads(database, query));
  } catch (error) {
    const failure = adminErrorResponse(error);
    response.status(failure.status).json(failure.body);
  }
}
