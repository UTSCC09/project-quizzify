import { useAuth0 } from '@auth0/auth0-react'
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import {
  FiMenu,
  FiChevronDown,
} from 'react-icons/fi'

import { AiFillApi, AiFillCompass, AiFillHome, AiFillStar } from 'react-icons/ai'
import { FaUser } from 'react-icons/fa'
import { IoIosCreate } from 'react-icons/io'
import LoginButton from './Buttons/Auth/LoginButton'

const LinkItems = [
  { name: 'Home', icon: AiFillHome, href: "/" },
  { name: 'Play', icon: AiFillApi, href: "/join" },
  { name: 'Host', icon: AiFillStar, href: "/host", authenticated: true },
  { name: 'Discover', icon: AiFillCompass, href: "/discover"},
  { name: 'Create', icon: IoIosCreate, href: "/create", authenticated: true},
  { name: 'Profile', icon: FaUser, href: "/profile", authenticated: true },
]

const SidebarContent = ({ onClose, ...rest }) => {
  const {
    isAuthenticated,
  } = useAuth0();

  return (
    <Box
      transition="3s ease"
      bg={'white'}
      borderRight="1px"
      borderRightColor={'gray.200'}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Quizzify
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        (!link.authenticated || (link.authenticated && isAuthenticated)) ? 
          <NavItem key={link.name} icon={link.icon} href={link.href}>
            {link.name}
          </NavItem> : null
      ))}
    </Box>
  )
}

const NavItem = ({ href, icon, children, ...rest }) => {
  return (
    <Box
      as="a"
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        px="4"
        py={8}
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color="#1c2025"
        _hover={{
            color: 'brand.100',
        }}
        {...rest}>
        {icon && (
            <Flex
                mr={4}
                bg={'brand.100'}
                alignItems={'center'}
                justifyContent={'center'}
                w="30px"
                h="30px"
                borderRadius={'full'}>
                <Icon
                  fontSize={16}
                  color={'brand.400'}
                  as={icon}
                />
            </Flex>
        )}
        {children}
      </Flex>
    </Box>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth0();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Quizzify
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          {!isAuthenticated ? <LoginButton/> :
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                  <HStack>
                    <Avatar
                      size={'sm'}
                      src={user.picture}
                    />
                    <VStack
                      display={{ base: 'none', md: 'flex' }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2">
                      <Text fontSize="sm">{user.name}</Text>
                      <Text fontSize="xs" color="gray.600">
                        {user.email}
                      </Text>
                    </VStack>
                    <Box display={{ base: 'none', md: 'flex' }}>
                      <FiChevronDown />
                    </Box>
                  </HStack>
              </MenuButton>
              <MenuList
                bg={'white'}
                borderColor={'gray.200'}>
                <MenuItem onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log out</MenuItem>
              </MenuList>
            </Menu>}
        </Flex>
      </HStack>
    </Flex>
  )
}

const MainNavBar = ({
    ...otherProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh">
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {otherProps.children}
      </Box>
    </Box>
  )
}

export default MainNavBar