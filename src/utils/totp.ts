import { TOTP } from 'otpauth';

export function generateTotpPublic(secret: string, period: number = 10): string {
  const totp = new TOTP({
    issuer: 'PorgUNC',
    label: 'Poll',
    algorithm: 'SHA1',
    digits: 10,
    period: period,
    secret: secret,
  });

  return totp.generate();
}
