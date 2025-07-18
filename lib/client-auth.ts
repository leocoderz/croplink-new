// Client-side authentication service
class ClientAuthService {
  private baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  async signup(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) {
    console.log("🚀 === CLIENT SIGNUP STARTED ===");

    try {
      // Client-side validation
      console.log("🔍 Validating client-side data...");

      if (!data.name || data.name.trim().length < 2) {
        throw new Error("Name must be at least 2 characters long");
      }

      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!data.password || data.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (data.phone && !/^\+?[\d\s\-()]{10,}$/.test(data.phone.trim())) {
        throw new Error("Please enter a valid phone number");
      }

      console.log("✅ Client-side validation passed");

      // Check if user already exists (simulate database check)
      const existingUsers = this.getStoredUsers();
      console.log("👥 Checking against existing users:", existingUsers.length);

      const searchEmail = data.email.trim().toLowerCase();
      const existingUser = existingUsers.find((u) => u.email === searchEmail);

      if (existingUser) {
        throw new Error("An account with this email already exists");
      }

      // Create new user (simulate API response)
      const newUser = {
        id: `user_${Date.now()}`,
        name: data.name.trim(),
        email: searchEmail,
        phone: data.phone?.trim() || null,
        createdAt: new Date().toISOString(),
      };

      console.log("👤 Creating new user:", newUser);

      // Store user credentials (in a real app, password would be hashed on server)
      const hashedPassword = btoa(data.password); // Simple encoding for demo

      // Store user in local storage (simulate database)
      const newUserWithPassword = { ...newUser, password: hashedPassword };
      existingUsers.push(newUserWithPassword);

      console.log("💾 Storing users to localStorage:", existingUsers.length);
      localStorage.setItem("croplink-users", JSON.stringify(existingUsers));

      // Verify storage worked
      const verifyUsers = this.getStoredUsers();
      console.log("✅ Verification - stored users count:", verifyUsers.length);

      // Generate token (simple demo token)
      const token = `token_${newUser.id}_${Date.now()}`;

      // Store user data and token for immediate login
      console.log("💾 Storing user data for auto-login...");
      this.storeUserData(newUser, token);
      console.log("✅ User data stored successfully");

      console.log("🎉 Signup completed successfully!");
      return {
        success: true,
        user: newUser,
        token,
        message: "Account created successfully!",
      };
    } catch (error: any) {
      console.error("💥 CLIENT SIGNUP ERROR:", error.message);
      return {
        success: false,
        message: error.message || "Signup failed. Please try again.",
      };
    }
  }

  async login(data: { email: string; password: string }) {
    try {
      console.log("🔄 Starting login process...");
      console.log("📧 Login attempt for email:", data.email);

      // Clear any existing data first
      this.clearUserData();

      // Get stored users (simulate database lookup)
      const storedUsers = this.getStoredUsers();
      console.log("👥 Found stored users:", storedUsers.length);
      console.log(
        "📋 Stored user emails:",
        storedUsers.map((u) => u.email),
      );

      const searchEmail = data.email.trim().toLowerCase();
      console.log("🔍 Searching for email:", searchEmail);

      const user = storedUsers.find((u) => u.email === searchEmail);
      console.log("👤 Found user:", !!user);

      if (!user) {
        console.error("❌ No user found with email:", searchEmail);
        console.error(
          "❌ Available emails:",
          storedUsers.map((u) => u.email),
        );
        throw new Error("No account found with this email address");
      }

      // Check password (in real app, would compare hashed passwords)
      const providedPasswordHash = btoa(data.password);
      if (user.password !== providedPasswordHash) {
        throw new Error("Incorrect password");
      }

      // Create clean user object (without password)
      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      };

      // Generate new token
      const token = `token_${user.id}_${Date.now()}`;

      // Store user data and token
      this.storeUserData(userInfo, token);

      console.log("✅ Login successful");
      return {
        success: true,
        user: userInfo,
        token,
        message: "Login successful!",
      };
    } catch (error: any) {
      console.error("❌ Login error:", error);
      return { success: false, message: error.message };
    }
  }

  private storeUserData(user: any, token: string) {
    try {
      localStorage.setItem("agri-app-user", JSON.stringify(user));
      localStorage.setItem("croplink-user", JSON.stringify(user));
      localStorage.setItem("agri-app-token", token);
      localStorage.setItem("croplink-token", token);
      console.log("✅ User data stored in localStorage");
    } catch (error) {
      console.error("❌ Failed to store user data:", error);
    }
  }

  private clearUserData() {
    try {
      localStorage.removeItem("agri-app-user");
      localStorage.removeItem("croplink-user");
      localStorage.removeItem("agri-app-token");
      localStorage.removeItem("croplink-token");
      console.log("✅ User data cleared from localStorage");
    } catch (error) {
      console.error("❌ Failed to clear user data:", error);
    }
  }

  private async sendLoginAlertSMS(phone: string, name: string) {
    try {
      await fetch(`${this.baseUrl}/api/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          message: `Hi ${name}, you've successfully signed in to AgriApp. If this wasn't you, please secure your account immediately.`,
          type: "login_alert",
        }),
      });
    } catch (error) {
      console.error("Failed to send login alert SMS:", error);
    }
  }

  // Get current user from localStorage
  getCurrentUser() {
    // Prevent SSR access to localStorage
    if (typeof window === "undefined") {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    }

    try {
      const userStr =
        localStorage.getItem("agri-app-user") ||
        localStorage.getItem("croplink-user");
      const token =
        localStorage.getItem("agri-app-token") ||
        localStorage.getItem("croplink-token");

      if (userStr && token) {
        return {
          user: JSON.parse(userStr),
          token,
          isAuthenticated: true,
        };
      }

      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      // Clear corrupted data
      this.clearUserData();
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    }
  }

  // Logout user
  logout() {
    this.clearUserData();
    console.log("✅ User logged out from client auth service");
  }

  // Initialize auth service (creates test user if needed)
  init() {
    this.getStoredUsers();
  }

  // Helper method to get stored users from localStorage
  private getStoredUsers() {
    // Prevent SSR access to localStorage
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const usersStr = localStorage.getItem("croplink-users");
      console.log(
        "🔍 Raw users from localStorage:",
        usersStr ? "found" : "not found",
      );

      let users = usersStr ? JSON.parse(usersStr) : [];
      console.log("📋 Parsed users:", users.length, "users found");

      // Initialize with a test user if no users exist
      if (users.length === 0) {
        console.log("🧪 Creating test user for demo");
        const testUser = {
          id: "test-user-001",
          name: "Test User",
          email: "test@croplink.com",
          phone: "1234567890",
          password: btoa("Test123!"), // password: Test123!
          createdAt: new Date().toISOString(),
        };
        users = [testUser];
        localStorage.setItem("croplink-users", JSON.stringify(users));
        console.log(
          "✅ Test user created. Login with: test@croplink.com / Test123!",
        );
      }

      return users;
    } catch (error) {
      console.error("❌ Error getting stored users:", error);
      return [];
    }
  }
}

export const clientAuthService = new ClientAuthService();

// Initialize the auth service
if (typeof window !== "undefined") {
  try {
    clientAuthService.init();
    console.log("🔧 Auth service initialized successfully");
  } catch (error) {
    console.error("Failed to initialize auth service:", error);
  }
}
