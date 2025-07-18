"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function AdminUtils() {
  const [isClearing, setIsClearing] = useState(false);
  const [storedUsers, setStoredUsers] = useState<any[]>([]);
  const { toast } = useToast();

  const checkStoredUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem("croplink-users") || "[]");
      setStoredUsers(users);
      toast({
        title: "📋 Stored Users",
        description: `Found ${users.length} stored user(s)`,
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to check stored users",
        variant: "destructive",
      });
    }
  };

  const clearAllData = () => {
    setIsClearing(true);
    try {
      // Clear all CropLink related data
      localStorage.removeItem("croplink-users");
      localStorage.removeItem("agri-app-user");
      localStorage.removeItem("croplink-user");
      localStorage.removeItem("agri-app-token");
      localStorage.removeItem("croplink-token");
      localStorage.removeItem("croplink-notifications");
      localStorage.removeItem("croplink-farm-data");

      setStoredUsers([]);

      toast({
        title: "🧹 Data Cleared",
        description:
          "All stored user data has been cleared. Refresh the page to start fresh.",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to clear data",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const clearEverything = () => {
    setIsClearing(true);
    try {
      localStorage.clear();
      setStoredUsers([]);

      toast({
        title: "🗑️ Everything Cleared",
        description:
          "All localStorage data has been cleared. Refresh the page.",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to clear localStorage",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🔧</span>
          <span>Admin Utils</span>
        </CardTitle>
        <CardDescription>
          Utilities for managing stored user data during development
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkStoredUsers} variant="outline" className="w-full">
          📋 Check Stored Users ({storedUsers.length})
        </Button>

        {storedUsers.length > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-2">Stored Users:</p>
            {storedUsers.map((user, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs mb-1"
              >
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                <div>
                  <strong>Name:</strong> {user.name}
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={clearAllData}
          disabled={isClearing}
          variant="destructive"
          className="w-full"
        >
          {isClearing ? "Clearing..." : "🧹 Clear CropLink Data"}
        </Button>

        <Button
          onClick={clearEverything}
          disabled={isClearing}
          variant="destructive"
          className="w-full"
        >
          {isClearing ? "Clearing..." : "🗑️ Clear Everything"}
        </Button>

        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
          <p>
            <strong>Note:</strong> After clearing data, refresh the page to
            start fresh.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
