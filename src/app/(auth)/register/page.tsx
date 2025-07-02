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

export default function Register() {
  const registerFormat = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  };
  const registerSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.email(),
    password: z.string(),
  });
  const createAccount = useAuthStore().createAccount;
  const login = useAuthStore().login;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(registerFormat);
  const router = useRouter();
  const onSubmit = async () => {
    if (!user.email || !user.firstname || !user.lastname || !user.password) {
      setError("Please fill out all the fields");
      return;
    }
    const parsedUser = registerSchema.safeParse(user);
    if (!parsedUser.success) {
      setError("Please enter valid data");
      return;
    }
    setLoading(true);
    setError("");
    const randomNumber: string = Math.ceil(Math.random() * 100).toString();
    const response = await createAccount(
      user.firstname + user.lastname + randomNumber,
      user.email,
      user.password,
    );
    if (response.error) {
      setError(response.error.message);
      setLoading(false);
      return;
    }
    const loginResponse = await login(user.email, user.password);
    if (loginResponse.error) {
      setError(loginResponse.error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
  };
  const onLogin = () => {
    router.push("/login");
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter details to register on Pingbase!
          </CardDescription>
          <CardAction>
            {!loading && (
              <Button variant="link" onClick={onLogin}>
                Login
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
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  type="text"
                  placeholder="John"
                  value={user.firstname}
                  onChange={(e) =>
                    setUser({ ...user, firstname: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder="Doe"
                  value={user.lastname}
                  onChange={(e) =>
                    setUser({ ...user, lastname: e.target.value })
                  }
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
              <AlertTitle>Unable to process sign up.</AlertTitle>
              <AlertDescription>
                <li>{error}</li>
              </AlertDescription>
            </Alert>
          </CardContent>
        )}

        <CardFooter className="flex-col gap-2">
          <Button type="submit" onClick={onSubmit} className="w-full">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
