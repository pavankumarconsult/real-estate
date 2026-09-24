import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test, { after, before, beforeEach } from 'node:test';
import { deleteApp, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { assertFails, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { createFirestoreEnquiryStore, ENQUIRIES_COLLECTION } from '../server/firestoreEnquiryStore.js';
import { LeadRecord } from '../server/enquiryHandler.js';

const PROJECT_ID = 'team4aria-77f44';
const adminApp = initializeApp({ projectId: PROJECT_ID }, 'firestore-integration-tests');
const adminDatabase = getFirestore(adminApp);
let rulesEnvironment: RulesTestEnvironment;

const LEAD: LeadRecord = {
  name: 'Rules Test Visitor',
  mobile: '+919876543210',
  email: 'rules-test@example.com',
  projectId: 'team4-aria',
  projectName: 'Team4 Aria',
  intent: 'General enquiry',
  context: null,
  consent: true,
  status: 'new',
  source: {
    channel: 'website',
    pagePath: '/',
    referrerHost: null,
  },
};

before(async () => {
  rulesEnvironment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: await readFile('firestore.rules', 'utf8'),
    },
  });
});

beforeEach(async () => {
  await rulesEnvironment.clearFirestore();
});

after(async () => {
  await rulesEnvironment.cleanup();
  await deleteApp(adminApp);
});

test('repeated concurrent server submissions create one lead and return one reference', async () => {
  const store = createFirestoreEnquiryStore(adminDatabase);
  const key = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';

  const [firstReference, secondReference] = await Promise.all([
    store.save(LEAD, key),
    store.save(LEAD, key),
  ]);

  assert.equal(firstReference, secondReference);
  const leads = await adminDatabase.collection(ENQUIRIES_COLLECTION).get();
  assert.equal(leads.size, 1);
  assert.equal(leads.docs[0].id, firstReference);
  assert.equal(leads.docs[0].get('status'), 'new');
  assert.ok(leads.docs[0].get('createdAt'));
});

test('an unauthenticated public client cannot read, list, or create leads', async () => {
  const serverLead = adminDatabase.collection(ENQUIRIES_COLLECTION).doc();
  await serverLead.set({ ...LEAD, createdAt: new Date() });

  const publicDatabase = rulesEnvironment.unauthenticatedContext().firestore();
  await assertFails(publicDatabase.collection(ENQUIRIES_COLLECTION).doc(serverLead.id).get());
  await assertFails(publicDatabase.collection(ENQUIRIES_COLLECTION).get());
  await assertFails(publicDatabase.collection(ENQUIRIES_COLLECTION).doc('public-write').set(LEAD));
});
