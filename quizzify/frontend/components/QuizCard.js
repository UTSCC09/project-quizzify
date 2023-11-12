import { Box, Flex, Text, chakra } from "@chakra-ui/react";

export default function QuizCard({
    index,
    question,
    img,
}) {
  return (
    <>
        <Flex
            maxW="100%"
            maxH="200px"
            bg="white"
            shadow="sm"
            rounded="lg"
            overflow="hidden"
        >
            <Flex 
                borderTopLeftRadius="lg"
                borderBottomRightRadius="lg"
                position={'absolute'}
                bg={'brand.400'}
                justifyContent={'center'}
                alignItems={'center'}
                textAlign={'center'}
                color={'white'}
                w={8} h={8}
            >
                {index+1}
            </Flex>
            <Box w={'200px'} bgSize="cover" style={{backgroundImage: `url(${img})` }} />
            <Box w={2 / 3} p={4}>
            <chakra.h1 fontSize="lg" fontWeight="600">{question.question}</chakra.h1>
            <chakra.p mt={2} fontSize="sm" color="gray.600">
                {
                    question.responses.map((resp, i) => (
                        <Text key={i}>{resp.response}{resp.isAnswer && ' ✅'}</Text>
                    ))
                }
            </chakra.p>
            </Box>
        </Flex>
    </>
  )
}