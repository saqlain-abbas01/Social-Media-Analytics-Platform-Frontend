import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/userService";
import type { ApiError } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    mutationKey: ["register"],
    onSuccess: (data) => {
      console.log("registered data", data);
      setAuth(data.user, data.accessToken);
      toast.success("User registration is sucessfull");
      navigate("/");
    },
    onError: (err: ApiError) => {
      toast.error(err.response?.data.message || "Error while registering user");
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 via-background to-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your analytics dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {authError && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
