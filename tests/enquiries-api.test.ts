import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ApiRequest,
  ApiResponse,
  createEnquiryHandler,
  EnquiryStore,
  LeadRecord,
} from '../server/enquiryHandler.js';

const VALID_BODY = {
  name: '  Test   Visitor  ',
  mobile: '98765 43210',
  email: 'Visitor@Example.com',
  projectId: 'team4-aria',
  projectName: 'Team4 Aria',
  intent: 'Request a call for a site visit',
  context: 'Landing page',
  consent: true,
  website: '',
  source: {
    pagePath: '/',
    referrerHost: 'example.com',
  },
};

const APPROVED_INTENTS = [
  'General enquiry about booking a flat',
  'Request a call for a site visit',
  'Ready to buy in 2–3 weeks',
] as const;

class TestResponse implements ApiResponse {
  headers = new Map<string, string>();
  statusCode = 200;
  body: { success: boolean; referenceId?: string } | null = null;

  setHeader(name: string, value: string) {
    this.headers.set(name, value);
  }

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(value: { success: boolean; referenceId?: string }) {
    this.body = value;
  }
}

function request(body: unknown = VALID_BODY): ApiRequest {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-idempotency-key': '11111111-2222-4333-8444-555555555555',
    },
    body,
  };
}

test('accepts and normalizes a valid submission and returns only the reference', async () => {
  const savedLeads: LeadRecord[] = [];
  const store: EnquiryStore = {
    async save(lead) {
      savedLeads.push(lead);
      return 'lead-reference-1';
    },
  };
  const response = new TestResponse();

  await createEnquiryHandler(store)(request(), response);

  assert.equal(response.statusCode, 201);
  assert.deepEqual(response.body, { success: true, referenceId: 'lead-reference-1' });
  assert.equal(savedLeads[0].name, 'Test Visitor');
  assert.equal(savedLeads[0].mobile, '+919876543210');
  assert.equal(savedLeads[0].email, 'visitor@example.com');
  assert.equal(savedLeads[0].status, 'new');
});

test('accepts each approved enquiry choice', async () => {
  const savedIntents: string[] = [];
  const store: EnquiryStore = {
    async save(lead) {
      savedIntents.push(lead.intent);
      return `lead-reference-${savedIntents.length}`;
    },
  };

  for (const intent of APPROVED_INTENTS) {
    const response = new TestResponse();
    await createEnquiryHandler(store)(request({ ...VALID_BODY, intent }), response);
    assert.equal(response.statusCode, 201);
  }

  assert.deepEqual(savedIntents, APPROVED_INTENTS);
});

test('rejects malformed input and a populated honeypot without writing', async () => {
  let writeCount = 0;
  const store: EnquiryStore = {
    async save() {
      writeCount += 1;
      return 'unexpected';
    },
  };

  for (const body of [
    { ...VALID_BODY, mobile: '123' },
    { ...VALID_BODY, projectName: 'Changed in browser' },
    { ...VALID_BODY, website: 'spam.example' },
    { ...VALID_BODY, intent: 'Site visit' },
  ]) {
    const response = new TestResponse();
    await createEnquiryHandler(store)(request(body), response);
    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.body, { success: false });
  }
  assert.equal(writeCount, 0);
});

test('returns a non-sensitive failure response when the database write fails', async () => {
  const store: EnquiryStore = {
    async save() {
      throw new Error('simulated database failure containing private implementation details');
    },
  };
  const response = new TestResponse();

  await createEnquiryHandler(store)(request(), response);

  assert.equal(response.statusCode, 503);
  assert.deepEqual(response.body, { success: false });
  assert.equal(JSON.stringify(response.body).includes('private implementation details'), false);
});
