import { ChakraProvider } from '@chakra-ui/react'
import theme from '../lib/theme'
import Head from 'next/head';

import { Auth0Provider } from '@auth0/auth0-react';

import '@fontsource-variable/manrope';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Quizzify</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <Auth0Provider
        domain={`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}`}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
        authorizationParams={{
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          redirect_uri: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL
        }}
      >
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Auth0Provider>
    </>
  );
}
