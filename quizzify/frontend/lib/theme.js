import { extendTheme } from '@chakra-ui/react'

const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
}

const styles = {
    global: props => ({
        body: {
            bg: 'background.400',
            overflow: "overlay",
            color: "primary.400",
        },
        '*': {
            fontWeight: 600,
            fontFamily: 'Manrope Variable'
        }
    })
}

const colors = {
    primary: {
        400: "#111213",
    },
    secondary: {
        400: "#676c77",
    },
    background:{
        400: "#F7F8FC",
    },
    brand: {
        100: "#6E5CEC5c",
        400: "#6E5CEC",
        500: "#6E5CEC",
    },
    wrongAccent: {
        100: "#EA38395c",
        400: "#EA3839",
    },
    correctAccent: {
        100: "#4ABA575c",
        400: "#4ABA57",
    },
}

const breakpoints = {
    sm: '320px',
    md: '768px',
    lg: '1060px',
    xl: '1200px',
    '2xl': '1536px',
}

const theme = extendTheme({ config, styles, colors, breakpoints })

export default theme