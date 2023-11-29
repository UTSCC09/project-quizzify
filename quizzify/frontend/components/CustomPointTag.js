import { Text } from "@chakra-ui/react";

export default function CustomPointTag({
    size,
    text
}) {
    return (
        <Text 
            w={size} h={size}
            fontSize={20} fontWeight={900} px={'10px'} py={'1px'} bg={'white'} borderRadius={'10px'} color={'brand.400' }>
            {text}
        </Text> 
    )
}

