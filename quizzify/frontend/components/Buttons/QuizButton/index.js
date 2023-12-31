import { Flex, Text } from "@chakra-ui/react"
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";

const QuizButton = ({
    showAns = false, // this becomes true when timer runs up. will be changed dynamically
    response,
    index,
    actualAnswers, // will be empty list in the beginning until showAns == true
    selectedAnswers,
    onSelect,
    onClick
}) => {
    const theme = useTheme();
    const [selected, setSelected] = useState(false);

    const selectedBSParams = '0px 0px 0px 5px ';
    const selectedStyle = {
        BG: 'brand.400',
        BS: selectedBSParams + '#6e5cec5c',
    }

    const defaultBSParams = '0px 0.5px 5px 0 ';
    const defaultStyle = {
        BG: 'white',
        BS: defaultBSParams + 'rgba(0, 0, 0, 0.2)',
    }

    const correctStyle = {
        BG: theme.colors.correctAccent[400],
        BS: theme.colors.correctAccent[100],
    }
    const wrongStyle = {
        BG: theme.colors.wrongAccent[400],
        BS: theme.colors.wrongAccent[100],
    }

    let resultBG = selected ? selectedStyle.BG : defaultStyle.BG
    let resultBS = selected ? selectedStyle.BS : defaultStyle.BS
    let resultColor = selected ? 'white' : 'primary.400'

    // TODO: convert to useEffect
    // override colors if answer should be shown
    if (showAns && actualAnswers.length > 0) {
        // this button is the actual answer, so mark as correct
        if (actualAnswers.includes(index)){
            resultBG = correctStyle.BG
            resultBS = selected ? selectedBSParams + correctStyle.BS : resultBS
            resultColor = 'white'
        }
        // this button is not the actual answer but is selected, so mark as wrong
        else if (selected && !actualAnswers.includes(index)){
            resultBG = wrongStyle.BG
            resultBS = selected ? selectedBSParams + wrongStyle.BS : resultBS
            resultColor = 'white'
        }
    }

    useEffect(() => {
        setSelected(selectedAnswers.includes(index));
    }, [selectedAnswers])

    return (
        <Flex
            borderRadius='20px'
            bg={resultBG}
            color={resultColor}
            borderColor={'#CACFDB'}
            borderWidth={selected ? 0 : '1.5px'}
            boxShadow={resultBS}
            overflow='hidden'
            w={'100%'}
            h={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
            _hover={!showAns && { bg: !selected && !showAns && '#6e5cec5c', borderColor: !selected && !showAns && 'brand.400',
                cursor: 'pointer', 
                transform: 'translateY(-3px)',
                transitionDuration: '0.5s',
                transitionTimingFunction: "ease-in-out"
            }}
            onClick={() => {
                if (!showAns) {
                    onSelect(response, index)
                    if (onClick) onClick()
                }
            }}>
            <Text fontSize={'18px'} fontWeight={700}>{response.response}</Text>
        </Flex>
    )
}

export default QuizButton;