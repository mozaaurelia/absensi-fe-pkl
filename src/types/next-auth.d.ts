import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: "employee" | "supervisor" | "admin" | "superadmin";
    accessToken: string;
  }

  interface Session {
    user: {
      avatar: any;
      initials: string;
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: "employee" | "supervisor" | "admin" | "superadmin";
      accessToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "employee" | "supervisor" | "admin" | "superadmin";
    accessToken: string;
  }
}
