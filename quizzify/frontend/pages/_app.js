import { ChakraProvider } from '@chakra-ui/react'
import theme from '../lib/theme'
import Head from 'next/head'
import '@fontsource-variable/manrope';

import '../styles/globals.css';

export default function App({ Component, pageProps }) {
    return (
        <div>
        <Head>
            <title>Quizzify</title>
        </Head>
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
        </div>
    )
}
