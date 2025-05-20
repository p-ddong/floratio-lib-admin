// src/components/Sidebar.tsx
'use client';

import {
  Box,
  Icon,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuUser, LuSettings } from 'react-icons/lu';
import { usePathname } from 'next/navigation';
import { useColorModeValue } from '../ui/color-mode';
import { IoHomeOutline } from "react-icons/io5";
import { RiPlantLine } from "react-icons/ri";
import { CiBoxList } from "react-icons/ci";
import { useEffect, useState } from "react";
import { BASE_API, ENDPOINT_CONTRIBUTE } from "@/constant/API";
import { Contribution } from "@/types";

const navItems = [
  { label: 'Home', href: '/dashboard', icon: IoHomeOutline },
  { label: 'Plants', href: '/dashboard/plant', icon: RiPlantLine },
  { label: 'User List', href: '/dashboard/user', icon: LuUser },
  { label: 'Contributes', href: '/dashboard/contribute', icon: CiBoxList },
  { label: 'Settings', href: '/dashboard/profile', icon: LuSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const bg = useColorModeValue("gray.100", "gray.800");
  const [contribute, setContribute] = useState<Contribution[]>([]);

  useEffect(() => {
    const fetchContribute = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await fetch(`${BASE_API}${ENDPOINT_CONTRIBUTE.list}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setContribute(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Failed to fetch contributes:", error);
      }
    };

    fetchContribute();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

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
