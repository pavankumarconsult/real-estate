import { createHash } from 'node:crypto';
import { FieldValue, Firestore } from 'firebase-admin/firestore';
import { EnquiryStore, LeadRecord } from './enquiryHandler.js';

export const ENQUIRIES_COLLECTION = 'enquiries';
export const ENQUIRY_IDEMPOTENCY_COLLECTION = 'enquiryIdempotency';

export function createFirestoreEnquiryStore(database: Firestore): EnquiryStore {
  return {
    async save(lead: LeadRecord, idempotencyKey: string) {
      const markerId = createHash('sha256').update(idempotencyKey).digest('hex');
      const markerReference = database.collection(ENQUIRY_IDEMPOTENCY_COLLECTION).doc(markerId);

      return database.runTransaction(async (transaction) => {
        const existingMarker = await transaction.get(markerReference);
        if (existingMarker.exists) {
          const existingLeadId = existingMarker.get('leadId');
          if (typeof existingLeadId !== 'string' || !existingLeadId) {
            throw new Error('Invalid idempotency marker.');
          }
          return existingLeadId;
        }

        const leadReference = database.collection(ENQUIRIES_COLLECTION).doc();
        const createdAt = FieldValue.serverTimestamp();
        transaction.create(leadReference, {
          ...lead,
          createdAt,
        });
        transaction.create(markerReference, {
          leadId: leadReference.id,
          createdAt,
        });
        return leadReference.id;
      });
    },
  };
}
