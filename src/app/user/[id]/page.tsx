"use client";

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { BASE_API, ENDPOINT_USER} from "@/constant/API";
import {
  Heading,
  Stack,
  Skeleton,
  Button,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
} from "@chakra-ui/react";
const roles = ["user", "admin", "super admin"];

interface UserForm {
  username: string;
  email: string;
  role: string;
}

const UserDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<UserForm>({
    username: "",
    email: "",
    role: "",
  });

  // dirty if any field changes
  const isDirty =
    user &&
    (form.username !== user.username ||
      form.email !== user.email ||
      form.role !== user.role);

  useEffect(() => {
    if (!id || !token) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${BASE_API}${ENDPOINT_USER.detail}/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
        setForm({
          username: res.data.username,
          email: res.data.email,
          role: res.data.role,
        });
      } catch (err) {
        alert(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  const handleChange =
    (field: keyof UserForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleEdit = async () => {
    if (!user || !isDirty) return;
    try {
      const payload = { roleName: form.role };
      await axios.patch(`${BASE_API}${ENDPOINT_USER.update}/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        ...user,
        username: form.username,
        email: form.email,
        role: form.role,
      });
    } catch (err: any) {
      console.error("Update failed", err.response?.data || err.message);
    }
  };

  return (
    <Stack padding="1rem" marginLeft="240px">
      <Heading>User Detail Page</Heading>

      {loading ? (
        <Skeleton height="20px" width="40%" />
      ) : user ? (
        <Fieldset.Root size="lg" maxW="md">
          <Stack>
            <Fieldset.HelperText>User Information</Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            <Field.Root>
              <Field.Label>Username</Field.Label>
              <Input
                name="username"
                value={form.username}
                onChange={handleChange("username")}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Email address</Field.Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Role</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  name="role"
                  value={form.role}
                  onChange={handleChange("role")}
                >
                  <For each={roles}>
                    {(item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    )}
                  </For>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          </Fieldset.Content>

          <Button
            onClick={handleEdit}
            alignSelf="flex-start"
            disabled={!isDirty}
          >
            Edit
          </Button>
        </Fieldset.Root>
      ) : (
        <div>User not found!</div>
      )}
    </Stack>
  );
};

export default UserDetailPage;
