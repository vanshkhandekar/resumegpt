import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminAuthCard({
  onLogin,
  onSignup,
  busy,
}: {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string) => Promise<void>;
  busy: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>Login with email and password.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button disabled={busy} onClick={() => void onLogin(email, password)} className="flex-1">
            Login
          </Button>
          <Button disabled={busy} variant="outline" onClick={() => void onSignup(email, password)} className="flex-1">
            Create Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
