import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const creds = credentials as {
          email: string;
          password: string;
          mode?: string;
        };

        if (!creds?.email || !creds?.password) {
          return null;
        }

        const isSuperadmin = creds.mode === "superadmin";

        try {
          const response = await fetch(
            `${process.env.API_URL}${
              isSuperadmin ? "/auth/superadmin/login" : "/auth/login"
            }`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          const json = await response.json();

          if (!response.ok || !json.success) {
            console.error("Backend login gagal:", json.error);
            return null;
          }

          const { token, user } = json.data;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: isSuperadmin ? "superadmin" : user.role,
            accessToken: token,
          };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.image = user.image;
      }

      if (trigger === "update") {
        if (session?.name) token.name = session.name;
        if (session?.image) token.image = session.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = (token.image as string) ?? null;
        session.user.role = token.role as
          | "employee"
          | "supervisor"
          | "admin"
          | "superadmin";

        session.user.accessToken = token.accessToken as string;
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
