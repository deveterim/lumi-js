import { Lumi, lumi, Mailifica, mailifica } from './lumi';

export { Lumi, lumi, Mailifica, mailifica };
export default Lumi;

// Interfaces & Tipos
export * from './common/interfaces';
export * from './common/response';
export * from './common/error';
export * from './emails/interfaces/create-email';
export * from './emails/interfaces/get-email';
export * from './domains/interfaces/domain';
export * from './api-keys/interfaces/api-key';
export * from './webhooks/interfaces/webhook-events';

// Serviços
export { Emails } from './emails/emails';
export { Batch } from './batch/batch';
export { Domains } from './domains/domains';
export { ApiKeys } from './api-keys/api-keys';
export { Webhooks } from './webhooks/webhooks';
export { renderReactEmail } from './render';
