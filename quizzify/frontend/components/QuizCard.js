import { Box, Flex, Text, Tooltip, chakra, useDisclosure } from "@chakra-ui/react";
import EditQuestionForm from "./EditQuestionForm";
import { EditIcon } from "@chakra-ui/icons";
import { stringToColorHex } from "@/constants";

export default function QuizCard({
    index,
    question,
    onEditQuestion
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
        <Flex
            maxW="100%"
            maxH="100%"
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
            <Box w={'200px'} bgSize="cover" style={{backgroundColor: stringToColorHex(question.question) }} />
            <Box w={2 / 3} p={4}>
            <chakra.h1 fontSize="lg" fontWeight="600">{question.question}</chakra.h1>
            <Box mt={2} fontSize="sm" color="gray.600">
                {
                    question.responses.map((resp, i) => (
                        <Text key={i}>{resp.response}{resp.isAnswer && ' ✅'}</Text>
                    ))
                }
            </Box>
            <Tooltip label="Edit">
                <EditIcon cursor={'pointer'} onClick={onOpen} />
            </Tooltip>
            </Box>
            <EditQuestionForm
                index={index}
                onEditQuestion={onEditQuestion}
                data={{question: question.question, type: question.type, responses: question.responses}} 
                isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
        </Flex>
    </>
  )
}