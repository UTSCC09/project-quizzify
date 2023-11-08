import { Flex, Text } from "@chakra-ui/react"

const QuizButton = ({
    selected = false,
    text,
    onClick
}) => {
    return (
        <Flex
            borderRadius='20px'
            bg={selected ? 'brand.400' : 'white'}
            color={selected ? 'white' : 'primary.400'}
            borderColor={'#CACFDB'}
            borderWidth={selected ? 0 : '1.5px'}
            boxShadow={selected ? '0px 0px 0px 5px #6e5cec5c' :'0px 0.5px 5px 0 rgba(0, 0, 0, 0.2)'}
            overflow='hidden'
            w={'100%'}
            h={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
            _hover={{ bg: !selected && '#6e5cec5c', borderColor: !selected && 'brand.400',
                cursor: 'pointer', 
                transform: 'translateY(-3px)',
                transitionDuration: '0.5s',
                transitionTimingFunction: "ease-in-out"
            }}
            onClick={() => {
                if (onClick) onClick();
            }}>
            <Text fontSize={'18px'} fontWeight={700}>{text}</Text>
        </Flex>
    )
}

export default QuizButton;