import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";
import FollowDalnFooter from "~~/components/FollowDalnFooter";

import OnBoardingCenteredCard from "~~/components/OnBoardingCenteredCard";
import OnBoardingContentPiece from "~~/components/OnBoardingContentPiece";

const BurntToken = () => {
  return (
    <>
      <Head>
        <title>DALN - Onboarding</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box p={4} pos="fixed">
        <Link as={NextLink} href="/">
          <Box cursor="pointer">
            <Image src="/logo.png" alt="logo" height={32} width={116} />
          </Box>
        </Link>
      </Box>

      <OnBoardingCenteredCard
        prependedContent={
          <Flex justifyContent="center" direction="column" alignItems="center">
            <Heading fontSize="3xl">Sorry to see you go 🥺</Heading>
          </Flex>
        }
      >
        <Heading as="h2" mb={16} fontSize="3xl" textAlign="center">
          Don’t miss the benefit you can get with DALN
        </Heading>
        <HStack mb={16}>
          <OnBoardingContentPiece
            title="Control your data"
            content="True ownership and governance in the data economy"
          />
          <OnBoardingContentPiece
            title="Get rewards"
            content="Collectively monetize the aggregated data"
          />

          <OnBoardingContentPiece
            title="Preserve privacy"
            content="Transaction data never leaves your local devices during onboarding"
          />
        </HStack>

        <Center flexDir="column">
          <Text mb={3} color="gray.600">
            Change your mind?
          </Text>
          <NextLink href="/user">
            <Button size="lg" px={16}>
              Re-join DALN
            </Button>
          </NextLink>
        </Center>
      </OnBoardingCenteredCard>
      
      <FollowDalnFooter />
    </>
  );
};

export default BurntToken;
