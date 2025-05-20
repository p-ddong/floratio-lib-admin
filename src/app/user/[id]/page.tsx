"use client";

import React, { useEffect, useState} from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { BASE_API, ENDPOINT_USER, ENDPOINT_CONTRIBUTE } from "@/constant/API";
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
import { CldImage } from "next-cloudinary";

const roles = ["user", "admin", "super admin"];

interface UserForm {
  username: string;
  email: string;
  role: string;
}

const UserDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  // const { token }: string | null = localStorage.getItem("authToken");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contribLoading, setContribLoading] = useState(true);
  const [form, setForm] = useState<UserForm>({
    username: "",
    email: "",
    role: "",
  });
  const [contributes, setContributes] = useState<any[]>([]);
  // dirty if any field changes
  const isDirty =
    user &&
    (form.username !== user.username ||
      form.email !== user.email ||
      form.role !== user.role);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!id || !token) return;

    setLoading(true);
    setContribLoading(true);

    // Kick off both requests at once
    const userReq = axios.get(`${BASE_API}${ENDPOINT_USER.detail}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const contribReq = axios.get(`${BASE_API}${ENDPOINT_CONTRIBUTE.list}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([userReq, contribReq])
      .then(([userRes, contribRes]) => {
        // set user + form
        setUser(userRes.data);
        setForm({
          username: userRes.data.username,
          email: userRes.data.email,
          role: userRes.data.role,
        });
        setLoading(false);

        // filter to this user if needed, then set
        const mine = contribRes.data.filter((c: any) => c.user._id === id);
        setContributes(mine);
        setContribLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        setContributes([]);
        setLoading(false);
        setContribLoading(false);
      });
  }, [id]);

  const handleChange =
    (field: keyof UserForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // const handleEdit = async () => {
  //   if (!user || !isDirty) return;
  //   try {
  //     const payload = { roleName: form.role };
  //     await axios.patch(`${BASE_API}${ENDPOINT_CONTRIBUTE.list}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setUser({
  //       ...user,
  //       username: form.username,
  //       email: form.email,
  //       role: form.role,
  //     });
  //   } catch (err: any) {
  //     console.error("Update failed", err.response?.data || err.message);
  //   }
  // };

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
            // onClick={handleEdit}
            alignSelf="flex-start"
            disabled={!isDirty}
          >
            Edit
          </Button>
        </Fieldset.Root>
      ) : (
        <div>User not found!</div>
      )}
      {contribLoading ? (
        <Skeleton height="200px" />
      ) : (
        <ul className="space-y-4">
          {
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Contributions</h2>
              <ul className="space-y-4">
                {contributes.map((c) => (
                  <li
                    key={c._id}
                    className="flex items-center  bg-white rounded-lg border-2! my-2.5! px-3! py-2.5!"
                  >
                    {/* Thumbnail */}
                    {c.contribute_plant.image && (
                      <CldImage
                        src={c.contribute_plant.image}
                        alt={c.contribute_plant.scientific_name}
                        width={120}
                        height={120}
                        crop="fill"
                        className="object-cover rounded mr-4"
                      />
                    )}

                    {/* Details */}
                    <div className="ml-2.5!">
                      <p>
                        <span className="font-bold!">Scientific Name:</span> {c.contribute_plant.scientific_name}
                      </p>
                      <p>
                        <span className="font-bold!">Status:</span> {c.status}
                      </p>
                      {/* type may be undefined on older records */}
                      {c.type && (
                        <p>
                          <span className="font-bold!">Type:</span> {c.type}
                        </p>
                      )}
                      <p>
                        <span className="font-bold!">Created:</span>{" "}
                        {new Date(c.createdAt).toLocaleDateString("en-GB")}
                      </p>
                      
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          }
        </ul>
      )}
    </Stack>
  );
};

export default UserDetailPage;
