import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  Spinner,
  Center,
  Button,
} from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';

import WalletConnectButton from 'components/WalletConnectButton';
import { HorizonLogo } from 'components/icons/Icons';
import Card from 'components/card/Card.js';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from 'utils/firebase';
import axios from 'axios';

function SignIn() {
  const { connected, isLoading } = {};

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const logoColor = useColorModeValue('navy.700', 'white');
  const authBg = useColorModeValue('white', 'navy.900');
  const handleLogin = async () => {
    try {
      console.log('login');
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const user = result.user;
      console.log('Logged in user:', user);

      const idToken = await user.getIdToken();

      const response = await axios.post(
        'http://localhost:3001/api/auth',
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

      const userData = response.data;

      localStorage.setItem(
        'authUser',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          token: idToken,
        }),
      );

      window.location.href = '/admin/default';
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  if (connected) {
    return <Navigate to="/admin/default" replace />;
  }
  return (
    <Flex
      minH="100vh"
      w="100%"
      bg={authBg}
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Card p="40px" w={{ base: '90%', md: '450px' }} boxShadow="lg">
        <VStack spacing={6} align="center">
          <HorizonLogo h="26px" w="175px" my="24px" color={logoColor} />
          <Box textAlign="center">
            <Heading color={textColor} fontSize="32px" mb="10px">
              Welcome
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColorSecondary}
              fontWeight="400"
              fontSize="md"
            >
              Connect your wallet to access the dashboard.
            </Text>
          </Box>
          <WalletConnectButton />
          <Button onClick={handleLogin}>Sign in with Google</Button>
        </VStack>
      </Card>
    </Flex>
  );
}

export default SignIn;
