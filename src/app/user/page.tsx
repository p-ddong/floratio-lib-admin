'use client'

import React, { useEffect, useContext, useState } from 'react';
import {
  Heading,
  Stack,
  ButtonGroup,
  IconButton,
  Pagination,
  Skeleton,
  Input, InputGroup
} from "@chakra-ui/react";
import Link from "next/link";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { BASE_API, ENDPOINT_USER } from '@/constant/API';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';
import { MdDelete } from "react-icons/md";
import { FaUserGear } from "react-icons/fa6";
import { LuSearch } from "react-icons/lu"
import './User.scss'; // <-- import file SCSS ở đây

interface UserType {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const UserList = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_API}${ENDPOINT_USER.list}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  if (loading) {
    return (
      <div style={{ marginLeft: 240, padding: '1rem' }}>
        <Heading size="xl" mb="4">Users List</Heading>
        <div className="userlist-wrapper">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <Skeleton height="24px" width="18%" borderRadius="8px" />
              <Skeleton height="24px" width="32%" borderRadius="8px" />
              <Skeleton height="24px" width="16%" borderRadius="8px" />
              <Skeleton height="24px" width="32%" borderRadius="8px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Stack gap="5" padding="1rem" marginLeft="240px">
      <Heading size="xl" mb="4">
        Users List
      </Heading>

      <InputGroup flex="1" startElement={<LuSearch />}>
        <Input placeholder="Search" />
      </InputGroup>

      <table className="userlist-table border border-black">
        <thead>
          <tr>
            <th
              className="userlist-header-cell"
              style={{ textAlign: "center" }}
            >
              Username
            </th>
            <th
              className="userlist-header-cell"
              style={{ textAlign: "center" }}
            >
              Email
            </th>
            <th
              className="userlist-header-cell"
              style={{ textAlign: "center" }}
            >
              Role
            </th>
            <th
              className="userlist-header-cell"
              style={{ textAlign: "center" }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="cursor-pointer">
          {users.map((user) => (
            <tr className="userlist-row" key={user._id}>
              <td className="userlist-cell" style={{ textAlign: "center" }}>
                {user.username}
              </td>
              <td className="userlist-cell" style={{ textAlign: "center" }}>
                {user.email}
              </td>
              <td className="userlist-cell capitalize" style={{ textAlign: "center" }}>
                {user.role}
              </td>
              <td className="userlist-cell userlist-action-cell">
                <Link
                  href={`/user/${user._id}`}
                  className="user-link"

                >
                  <FaUserGear className="userlist-icon-btn" size={25} />
                </Link>
                <MdDelete className="userlist-icon-btn" size={25} color="red" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination giữ nguyên */}
      <Pagination.Root count={users.length} pageSize={10} page={1}>
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton aria-label="Previous Page">
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton
                key={page.value}
                variant={{ base: "ghost", _selected: "outline" }}
              >
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton aria-label="Next Page">
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Stack>
  );
};

export default UserList;
