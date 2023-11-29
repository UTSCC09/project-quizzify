import CustomIconButton from "@/components/Buttons/CustomIconButton";
import HGQuizButton from "@/components/Buttons/HostGame/HGQuizButton";
import { Leaderboard } from "@/components/Leaderboard";
import { Button, Grid, Flex, Box, Progress, Image, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { FaCirclePause, FaCirclePlay, FaCircleStop } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { MdLeaderboard } from "react-icons/md";

export default function HostGameLive({
    socket,
    question,
    questionLive,
    timerSeconds,
    timerPause,
    toggleTimer,
    endTimer,
    moveNextQuestion,
    answerResponses,
    players
}) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Flex flexDirection={'column'} padding={8}>
            <Flex gap={2} alignItems={'center'} justifyContent={'center'}>
                <CustomIconButton color={'secondary.400'} icon={<IoMdCloseCircle size={20} />} href='/' isExternal={false}/>
                <Progress w={'100%'} borderRadius={'full'} height={2} value={(timerSeconds/28)*100} colorScheme={'brand'} bgColor={'#d8dbe2'}/>
                <CustomIconButton color={'brand.400'} icon={<MdLeaderboard size={20}/>} onClick={onOpen}/>
                {questionLive &&
                    <>
                        <CustomIconButton color={'brand.400'}
                            icon={!timerPause ? <FaCirclePause size={20}/> : <FaCirclePlay size={20}/>} 
                            onClick={toggleTimer} />
                        <CustomIconButton color={'brand.400'} icon={<FaCircleStop size={20}/>} onClick={() => { endTimer(); moveNextQuestion(); }}/>
                    </>
                }
            </Flex>
            <Flex flexDirection={'column'} alignItems={'center'} padding={4} gap={4}>
                <Text fontSize={24}>{question?.question}</Text>
                <Image borderRadius={'15px'} objectFit={'cover'} width={'600px'} src={`https://picsum.photos/id/${Math.floor(Math.random() * (100 - 1) ) + 1}/600/300`}/>
                <Grid
                    marginTop={5}
                    h={'300px'}
                    w={{base: '100%', md: '600px'}}
                    gridGap={'20px'}
                    templateColumns={{base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)'}}>
                    {question?.responses.map((resp, i) => (
                        <HGQuizButton key={i} response={resp} answerResponses={answerResponses} />
                    ))}
                </Grid>
            </Flex>
            <Leaderboard socket={socket} isOpen={isOpen} onClose={onClose} players={players}/>
        </Flex>
    )
}