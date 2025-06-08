"use client";
import { useAuthStore } from "@/store/Auth";
import { useState } from "react";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const login = useAuthStore().login;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loginFormat = {
    email: "",
    password: "",
  };
  const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
  });
  const [user, setUser] = useState(loginFormat);
  const onSubmit = async () => {
    if (!user.email || !user.password) {
      setError("Please fill out all the fields");
      return;
    }
    const parsedUser = loginSchema.safeParse(user);
    if (!parsedUser.success) {
      setError("Please enter valid data");
      return;
    }
    setLoading(true);
    setError("");
    const response = await login(user.email, user.password);
    if (response.error) {
      setError(response.error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
  };
  const onSignup = () => {
    router.push("/register");
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            {!loading && (
              <Button variant="link" onClick={onSignup}>
                Sign Up
              </Button>
            )}
            {loading && <LoadingSpinner />}
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        {error && (
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Unable to process login.</AlertTitle>
              <AlertDescription>
                <li>{error}</li>
              </AlertDescription>
            </Alert>
          </CardContent>
        )}

        <CardFooter className="flex-col gap-2">
          <Button type="submit" onClick={onSubmit} className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
