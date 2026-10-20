import { Nitrosend } from '@nitrosend/sdk';

const key = process.env.NITROSEND_API_KEY;
if (!key) throw new Error('NITROSEND_API_KEY is not set');

const ns = new Nitrosend(key);

async function main(): Promise<void> {
  const msg = await ns.messages.send(
    {
      channel: 'email',
      to: 'proof@dogfood.nitrosend.net',
      subject: 'Frantic bounty #140 - first SDK send',
      body:
        'This is my first send with @nitrosend/sdk 0.11.6, made from a ' +
        '30-line TypeScript file to complete Frantic bounty #140. ' +
        'Runtime Node v22.23.1, compiled with tsc --strict.',
    },
    `frantic-140-${Date.now()}`,
  );
  console.log('id:', msg.id, 'status:', msg.status, 'to:', msg.to);
}

main().catch((err: unknown) => {
  console.error('send failed:', err);
  process.exitCode = 1;
});
