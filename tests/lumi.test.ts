import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Lumi } from '../src/lumi';
import { Webhooks } from '../src/webhooks/webhooks';
import * as crypto from 'crypto';

describe('Lumi JS SDK (Resend-like)', () => {
  const apiKey = 'lu_live_1234567890abcdef';
  let lumi: Lumi;

  beforeEach(() => {
    lumi = new Lumi(apiKey, { baseUrl: 'https://api.lumi.email/v1' });
    vi.restoreAllMocks();
  });

  describe('Emails', () => {
    it('should send email with correct headers and payload', async () => {
      const mockResponse = { id: 'email_123', status: 'sent' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const response = await lumi.emails.send({
        from: 'onboarding@empresa.com',
        to: 'cliente@gmail.com',
        subject: 'Boas-vindas ao Lumi',
        html: '<p>Olá mundo</p>',
      });

      expect(response.data).toEqual(mockResponse);
      expect(response.error).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.lumi.email/v1/emails',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          }),
        }),
      );
    });

    it('should retrieve email details by id', async () => {
      const mockEmail = {
        id: 'email_123',
        from: 'onboarding@empresa.com',
        to: ['cliente@gmail.com'],
        subject: 'Boas-vindas ao Lumi',
        status: 'delivered',
        created_at: '2026-10-16T12:00:00Z',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockEmail,
      });

      const response = await lumi.emails.get('email_123');
      expect(response.data).toEqual(mockEmail);
      expect(response.error).toBeNull();
    });
  });

  describe('Batch', () => {
    it('should send batch emails', async () => {
      const mockResponse = {
        data: [
          { id: 'email_1', status: 'sent' },
          { id: 'email_2', status: 'sent' },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const response = await lumi.batch.send([
        {
          from: 'onboarding@empresa.com',
          to: 'cliente1@gmail.com',
          subject: 'Promoção 1',
          html: '<p>Promoção 1</p>',
        },
        {
          from: 'onboarding@empresa.com',
          to: 'cliente2@gmail.com',
          subject: 'Promoção 2',
          html: '<p>Promoção 2</p>',
        },
      ]);

      expect(response.data).toEqual(mockResponse);
      expect(response.error).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.lumi.email/v1/emails/batch',
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });
  });

  describe('Webhooks', () => {
    it('should verify signature correctly', () => {
      const webhooks = new Webhooks();
      const secret = 'whsec_secret_key_123456';
      const payload = JSON.stringify({ event: 'email.delivered', id: 'evt_123' });
      const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

      const isValid = webhooks.verifySignature({
        payload,
        signature,
        secret,
      });

      expect(isValid).toBe(true);
    });
  });
});
