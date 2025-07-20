"use client";

import { useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [username, setUsername] = useState(user?.user_metadata?.username || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUsernameChange = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.updateUser({ data: { username } });
    setLoading(false);
    setMessage(error ? error.message : "Username updated!");
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    setMessage(error ? error.message : "Password updated!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profile Management</h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          className="w-full p-2 border rounded bg-gray-100"
          value={user?.email || ""}
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Username</label>
        <input
          className="w-full p-2 border rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <Button className="mt-2" onClick={handleUsernameChange} disabled={loading}>
          Update Username
        </Button>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">New Password</label>
        <input
          className="w-full p-2 border rounded"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button className="mt-2" onClick={handlePasswordChange} disabled={loading}>
          Change Password
        </Button>
      </div>
      {message && <div className="mt-4 text-center text-sm text-blue-600">{message}</div>}
    </div>
  );
}
