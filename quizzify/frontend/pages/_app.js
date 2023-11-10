import { ChakraProvider } from '@chakra-ui/react'
import theme from '../lib/theme'

import { Auth0Provider } from '@auth0/auth0-react';
import { usePathname } from 'next/navigation'

import '@fontsource-variable/manrope';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL + usePathname()
      }}
    >
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Auth0Provider>
  );
}
