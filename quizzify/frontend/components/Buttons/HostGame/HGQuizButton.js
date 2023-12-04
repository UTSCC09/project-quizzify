import { Flex, Text } from "@chakra-ui/react"

const HGQuizButton = ({
    response,
    answerResponses,
}) => {
    const isAns = answerResponses.some(ansResp => ansResp.response === response.response)
    return (
        <Flex
            borderRadius='20px'
            bg={isAns ? 'correctAccent.400' : 'white'}
            color={isAns ? 'white' : 'primary.400'}
            borderColor={'#CACFDB'}
            borderWidth={0}
            boxShadow={'0px 0.5px 5px 0 rgba(0, 0, 0, 0.2)'}
            overflow='hidden'
            w={'100%'}
            h={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
            >
            <Text fontSize={'18px'} fontWeight={700}>{response.response}</Text>
        </Flex>
    )
}

export default HGQuizButton;