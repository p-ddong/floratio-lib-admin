"use client";

import { AuthContext } from "@/context/AuthContext";
import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { Field, Input, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";
// import { Toaster, toaster } from "@/components/ui/toaster"

import "./Login.scss";
import { BASE_API, ENDPOINT_AUTH } from "@/constant/API";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  username: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
};

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

const onSubmit = async (data: FormData) => {
  try {
    const response = await fetch(`${BASE_API}${ENDPOINT_AUTH.login}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login failed:", errorData);
      alert("Sai tài khoản hoặc mật khẩu");
      return;
    }

    const resData = await response.json();
    const token = resData?.access_token;

    if (!token) {
      alert("Không nhận được token từ server");
      return;
    }

    // 🔒 Decode JWT để kiểm tra role
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.role === "user") {
      alert("Tài khoản người dùng không được phép truy cập trang admin.");
      return;
    }

    // ✅ Lưu token và chuyển hướng
    localStorage.setItem("authToken", token);
    setToken(token);
    router.push("/dashboard");
  } catch (error) {
    console.error("Error during login:", error);
    alert("Đã xảy ra lỗi, thử lại sau.");
  }
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
