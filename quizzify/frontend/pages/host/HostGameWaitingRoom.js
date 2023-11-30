import { Button, MenuItem, Menu, MenuButton, MenuList, Text, Grid, GridItem, Flex } from "@chakra-ui/react";
import BubbleWrapper from "./BubbleWrapper";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { LuCopy } from "react-icons/lu";
import CustomIconButton from "@/components/Buttons/CustomIconButton";
import { convertBEtoFEMode } from "@/constants";

export default function HostGameWaitingRoom({
    quizInfo,
    question,
    selectedQuizId,
    setSelectedQuizId,
    quizzes,
    gameCode,
    startGame,
    players,
}) {
    return (
        <>
            <BubbleWrapper>
                {
                    question && Object.keys(question).length === 0 &&
                    <Flex gap={'10px'} mb={2}>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} transition="all 0.3s">
                                {selectedQuizId ? quizzes.find((e) => e._id === selectedQuizId).name : "Click to select quiz"}
                            </MenuButton>
                            <MenuList
                                bg={'white'}
                                color={'primary.400'}
                                borderColor={'gray.200'}>
                                {quizzes.map((quiz, i) => <MenuItem key={i} onClick={() => setSelectedQuizId(quiz._id)}>{quiz.name}</MenuItem>)}
                            </MenuList>
                        </Menu>
                        {
                            gameCode &&
                            <Button onClick={startGame} isDisabled={players.length <= 0}>Start Game</Button>
                        }
                    </Flex>
                }

                {/* TODO: Style the leaderboard */}
                {
                    gameCode &&
                    <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4}>
                        <Flex alignItems={'center'} justifyContent={'center'} gap={2}>
                            <Text>Game PIN: {gameCode.toUpperCase()}</Text>
                            <CustomIconButton variant={'unstyled'} color={'white'} icon={<LuCopy />}
                                onClick={() => navigator.clipboard.writeText(gameCode.toLowerCase())} />
                        </Flex>
                        <Text>Mode: {convertBEtoFEMode(quizInfo.mode)}</Text>
                        <h1>{players.length} Players</h1>
                        <Grid>
                            {players.map((player, i) =>
                                <GridItem key={i}>
                                    {player.displayName} ({player.points} points)
                                </GridItem>
                            )}
                        </Grid>
                    </Flex>
                }
            </BubbleWrapper>
        </>
    )
}