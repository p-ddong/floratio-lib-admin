// src/components/Sidebar.tsx
'use client';

import {
  Box,
  // Flex,
  Icon,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuUser, LuSettings } from 'react-icons/lu';
import { usePathname } from 'next/navigation';
import { useColorModeValue } from '../ui/color-mode';
import { IoHomeOutline } from "react-icons/io5";

const navItems = [
  { label: 'Plants', href: '/dashboard', icon: IoHomeOutline },
  { label: 'User List', href: '/dashboard/profile', icon: LuUser },
  { label: 'Contributes', href: '/dashboard/settings', icon: LuSettings },
  { label: 'Settings', href: '/dashboard/settings', icon: LuSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const bg = useColorModeValue('gray.100', 'gray.800');

  return (
    <Box
      w="240px"
      h="100vh"
      bg={bg}
      px="4"
      py="6"
      position="fixed"
      left="0"
      top="0"
      borderRight="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Text fontSize="xl" fontWeight="bold" mb="8">
        My App
      </Text>
      <VStack align="stretch" spaceY={4}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            display="flex"
            alignItems="center"
            gap="3"
            px="3"
            py="2"
            borderRadius="md"
            bg={pathname === item.href ? 'blue.500' : 'transparent'}
            color={pathname === item.href ? 'white' : 'inherit'}
            _hover={{ bg: 'blue.400', color: 'white' }}
          >
            <Icon as={item.icon} boxSize="5" />
            <Text>{item.label}</Text>
          </Link>
        ))}
      </VStack>
    </Box>
  );
}
