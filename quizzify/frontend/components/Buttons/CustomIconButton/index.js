import { Box } from '@chakra-ui/react'
import ButtonLinkWrapper from '../ButtonLinkWrapper';

export default function CustomIconButton({
    display,
    isExternal = true,
    px,
    py,
    fontSize,
    fontWeight,
    color,
    bg,
    text,
    lineHeight,
    icon,
    href,
    ...otherProps
}) {
    return (
        <ButtonLinkWrapper display={display} href={href} isExternal={isExternal}>
            <Box
                as='button'
                px={px ? px : '8px'}
                py={py ? py : '8px'}
                borderRadius={'full'}
                color={color? color : 'background.400'}
                {...otherProps} // other props can be passed into here
            >
                {icon}
            </Box>
        </ButtonLinkWrapper>
    );
}