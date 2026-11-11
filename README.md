This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Configuração da API e autenticação

Copie `.env.example` para `.env.local` e configure `NEXT_PUBLIC_API_URL` com a URL da API.

O frontend usa cookies HTTP-only emitidos pelo backend. As chamadas autenticadas enviam cookies com `credentials: 'include'`. Quando uma chamada protegida retorna HTTP 401, o cliente tenta `POST /auth/refresh` e repete a chamada original uma única vez.

O dashboard valida a sessão chamando `GET /users/me`; a presença de um cookie no navegador, isoladamente, não é considerada prova de autenticação.

### Cookies entre domínios

Se frontend e API estiverem em sites diferentes em produção, configure no backend:

- `URL_FRONTEND`: origem exata do frontend.
- `COOKIE_SAME_SITE=none`: permite cookies em requisições cross-site.
- HTTPS obrigatório para cookies `SameSite=None` (o backend também configura `Secure`).

Se frontend e API estiverem no mesmo site, mantenha `COOKIE_SAME_SITE=lax`.
