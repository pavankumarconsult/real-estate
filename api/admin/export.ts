import { getFirebaseAuth, getFirebaseFirestore } from '../../server/firebaseAdmin.js';
import { adminErrorResponse, authorizeAdminRequest } from '../../server/adminAuth.js';
import {
  AdminApiRequest,
  AdminApiResponse,
  hasValidJsonBody,
  parseExportRequest,
  prepareAdminResponse,
} from '../../server/adminApi.js';
import { createLeadsCsv, getLeadsForExport } from '../../server/adminLeads.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '32kb',
    },
  },
};

export default async function handler(request: AdminApiRequest, response: AdminApiResponse) {
  prepareAdminResponse(response);
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ success: false, error: 'method-not-allowed' });
    return;
  }
  if (!hasValidJsonBody(request)) {
    response.status(400).json({ success: false, error: 'invalid-request' });
    return;
  }

  try {
    await authorizeAdminRequest(request, getFirebaseAuth());
    const exportRequest = parseExportRequest(request.body);
    if (!exportRequest) {
      response.status(400).json({ success: false, error: 'invalid-request' });
      return;
    }

    const leads = await getLeadsForExport(
      getFirebaseFirestore(),
      exportRequest.filters,
      exportRequest.selectedIds,
    );
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader('Content-Disposition', 'attachment; filename="team4-aria-enquiries.csv"');
    response.status(200).send(createLeadsCsv(leads));
  } catch (error) {
    const failure = adminErrorResponse(error);
    response.status(failure.status).json(failure.body);
  }
}
