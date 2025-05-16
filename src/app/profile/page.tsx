"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Badge,
  Box,
  Button,
  Field,
  Fieldset,
  Input,
} from "@chakra-ui/react";
import "./profile.scss";

type JwtPayload = {
  sub: string;
  username: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
};

const ProfilePage = () => {
  const [user, setUser] = useState<JwtPayload | null>(null);

  // State cho form đổi mật khẩu
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, []);

  const handleChangePassword = async () => {
    // if (!currentPw || !newPw || !confirmPw) {
    //   // toast({ title: "Please fill in all fields", status: "warning" });
    //   return;
    // }

    // if (newPw !== confirmPw) {
    //   // toast({ title: "Passwords do not match", status: "error" });
    //   return;
    // }

    // try {
    //   const token = localStorage.getItem("authToken");

    //   const res = await fetch("https://your-api/change-password", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({
    //       currentPassword: currentPw,
    //       newPassword: newPw,
    //     }),
    //   });

    //   const data = await res.json();
    //   if (!res.ok) {
    //     throw new Error(data.message || "Failed to change password");
    //   }

    //   // toast({ title: "Password updated successfully", status: "success" });
    //   setCurrentPw("");
    //   setNewPw("");
    //   setConfirmPw("");
    // } catch (error: any) {
    //   // toast({ title: error.message, status: "error" });
    // }
  };

  if (!user) {
    return <div style={{ marginLeft: "240px", padding: "1rem" }}>No user info</div>;
  }

  return (
    <div style={{ marginLeft: "240px", padding: "1rem" }} className="profile">
      <Box className="user-info" mb={10}>
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>User ID:</strong> {user.sub}
        </p>
        <p>
          <strong>Permissions:</strong>
        </p>
        <ul>
          {user.permissions.map((perm) => (
            <li key={perm}>
              <Badge variant="solid" colorScheme="green" mr={2}>
                {perm}
              </Badge>
            </li>
          ))}
        </ul>
      </Box>

      {/* Change Password Section */}
      <Box className="change-password">
        <Fieldset.Root size="lg">
          <Fieldset.Legend>Change Password</Fieldset.Legend>

          <Field.Root>
            <Field.Label>Current Password</Field.Label>
            <Input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>New Password</Field.Label>
            <Input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Confirm New Password</Field.Label>
            <Input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
            />
          </Field.Root>

          <Button mt={4} colorScheme="blue" onClick={handleChangePassword}>
            Update Password
          </Button>
        </Fieldset.Root>
      </Box>
    </div>
  );
};

export default ProfilePage;
