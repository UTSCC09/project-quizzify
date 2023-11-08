import {
    Button, useBreakpointValue
} from '@chakra-ui/react';

export default function TextButton({
    display,
    px,
    py,
    fontSize,
    fontWeight,
    color,
    bg,
    text,
    lineHeight,
    ...otherProps
}) {
    return (
        <Button
            display={display ? display : 'inline-flex'}
            px={px ? px : useBreakpointValue({ base: '30px', lg: '35px' })}
            py={py ? py : useBreakpointValue({ base: '3.5px', lg: '5.5px' })}
            fontSize={fontSize ? fontSize : useBreakpointValue({ base: '11px', lg: '12px' })}
            fontWeight={fontWeight ? fontWeight : 500}
            color={color ? color : '#F2F2F2'}
            border={'1px solid #F2F2F2'}
            borderRadius={'full'}
            _focus={{ outline: 0 }}
            lineHeight={lineHeight ? lineHeight : '1'}
            {...otherProps} // other props can be passed into here
        >
            {text}
        </Button>
    );
}