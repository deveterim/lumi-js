import { HttpClient } from '../common/client';
import { LumiResponse } from '../common/response';
import { renderReactEmail } from '../render';
import { CreateEmailOptions, CreateEmailResponse } from './interfaces/create-email';
import { GetEmailResponse } from './interfaces/get-email';

export class Emails {
  constructor(private readonly client: HttpClient) {}

  /**
   * Dispara um e-mail transacional
   */
  async send(payload: CreateEmailOptions): Promise<LumiResponse<CreateEmailResponse>> {
    const to = Array.isArray(payload.to)
      ? (payload.to.length === 1 ? payload.to[0] : payload.to)
      : payload.to;
    const cc = payload.cc ? (Array.isArray(payload.cc) ? payload.cc : [payload.cc]) : undefined;
    const bcc = payload.bcc ? (Array.isArray(payload.bcc) ? payload.bcc : [payload.bcc]) : undefined;
    const replyTo = Array.isArray(payload.reply_to || payload.replyTo)
      ? (payload.reply_to || payload.replyTo)?.[0]
      : (payload.reply_to || payload.replyTo);

    let html = payload.html;

    if ('react' in payload && payload.react) {
      html = await renderReactEmail(payload.react);
    }

    const { react: _, replyTo: __, ...cleanPayload } = payload as any;

    return this.client.post<CreateEmailResponse>('/api/v1/send', {
      ...cleanPayload,
      to,
      cc,
      bcc,
      reply_to: replyTo,
      html,
    }).then(async (res) => {
      if (res.error && res.error.name !== 'network_error') {
        // Fallback to /emails for resend-compatible backends
        return this.client.post<CreateEmailResponse>('/emails', {
          ...cleanPayload,
          to,
          cc,
          bcc,
          reply_to: replyTo,
          html,
        });
      }
      return res;
    });
  }

  /**
   * Alias de conveniência idêntico a `send()`
   */
  async create(payload: CreateEmailOptions): Promise<LumiResponse<CreateEmailResponse>> {
    return this.send(payload);
  }

  /**
   * Consulta os detalhes e status de entrega de um e-mail enviado
   */
  async get(id: string): Promise<LumiResponse<GetEmailResponse>> {
    return this.client.get<GetEmailResponse>(`/emails/${id}`);
  }
}
