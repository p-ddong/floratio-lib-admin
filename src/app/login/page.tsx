"use client";

import { AuthContext } from "@/context/AuthContext";
import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { Field, Input, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import './Login.scss'

type FormData = {
  username: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const { setToken, token } = useContext(AuthContext)!;

  useAuthRedirect(token);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);

    const fakeToken = "abc123token";
    localStorage.setItem("authToken", fakeToken);
    setToken(fakeToken);

    router.push("/dashboard");
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>

        <h1>Floratio Lib Admin Login</h1>


        <Field.Root required invalid={!!errors.username}>
          <Field.Label>
            Username <Field.RequiredIndicator />
          </Field.Label>

          <Input
            placeholder="Enter your username"
            {...register("username", {
              required: "Username is required",
            })}
          />

          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root required invalid={!!errors.password} mt="4">
          <Field.Label>
            Password <Field.RequiredIndicator />
          </Field.Label>
          <Input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Button mt="6" colorScheme="blue" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
