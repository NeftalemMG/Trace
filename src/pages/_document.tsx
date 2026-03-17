import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23111'/%3E%3Ccircle cx='16' cy='18' r='9' fill='none' stroke='%23A8D8EA' stroke-width='1.4'/%3E%3Ccircle cx='9' cy='14' r='6' fill='none' stroke='%23ffffff' stroke-width='1.3'/%3E%3Ccircle cx='23' cy='14' r='6' fill='none' stroke='%23ffffff' stroke-width='1.3'/%3E%3Ccircle cx='16' cy='9' r='6' fill='none' stroke='%23A8D8EA' stroke-width='1.3'/%3E%3C/svg%3E" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}