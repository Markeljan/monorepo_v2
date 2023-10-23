import {
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Component, ComponentProps, useEffect, useRef } from "react";
import { useAccount, useContractRead } from "wagmi";

import {
  basicSpnFactoryABI,
  erc20ABI,
  useBasicSpnFactoryBalanceOf,
} from "~~/generated/wagmiTypes";
import usePrepareWriteAndWaitTx from "~~/hooks/usePrepareWriteAndWaitTx";

interface BurnSBTProps extends ComponentProps<typeof Button> {
  alertDialogProps?: Component<typeof AlertDialog>;
  tokenId?: string;
}

export default function BurnSBT({
  alertDialogProps,
  tokenId,
  ...props
}: BurnSBTProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const { address } = useAccount();

  const balanceQuery = useBasicSpnFactoryBalanceOf({
    address: process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`,
    args: [address || "0x0"],
    enabled: !!address,
    watch: true,
  });

  const userBurn = usePrepareWriteAndWaitTx({
    address: process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS as `0x${string}`,
    abi: basicSpnFactoryABI,
    functionName: "userBurn",
    args: [tokenId],
    enabled:
      !!process.env.NEXT_PUBLIC_DALN_CONTRACT_ADDRESS && tokenId !== undefined,
  });

  useEffect(() => {
    if (userBurn.isSuccess && balanceQuery.data && balanceQuery.data.lte(0)) {
      void router.push("/user/burnt-token");
    }
  }, [balanceQuery.data, onClose, router, userBurn.isSuccess]);

  const handleBurn = async () => {
    if (userBurn.writeAsync) {
      try {
        await userBurn.writeAsync();
      } catch (e) {
        console.error("burn error", e);
        onClose();
      }
    }
  };

  return (
    <>
      <Button
        colorScheme="red"
        variant="solid"
        onClick={onOpen}
        isLoading={
          userBurn.isLoading || (userBurn.isSuccess && balanceQuery.data?.gt(0))
        }
        {...props}
      >
        Burn my token
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        {...alertDialogProps}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Are you sure?
            </AlertDialogHeader>

            <AlertDialogBody>
              If you burn your soul-bound token, you will lose your DAO membership and stop sharing your data. You will also stop receiving rewards.

              If you have received airdrops of digital collectibles in the token-bound account, make sure they are transferred to a different wallet before you burn the soul-bound token.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                width={'50%'}
                colorScheme="gray"
                color="red"
                variant="outline"
                ref={cancelRef}
                onClick={onClose}>
                Cancel
              </Button>
              <Button
                width={'50%'}
                colorScheme="red"
                onClick={handleBurn}
                isDisabled={!userBurn.writeAsync}
                ml={3}
                isLoading={userBurn.isLoading}
              >
              { userBurn.isLoading ? 'Waiting for approval...' : 'Burn it anyway' }
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
