import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apolloClient } from "../../../lib/apolloClient"; 
import { LOGIN_MUTATION, LOGIN_COMPANY } from "../../../graphql/mutations";
import { setCookie } from "cookies-next";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("All fields are required.");
        }

        try {
          // Try normal user login
          const { data: userData } = await apolloClient.mutate({
            mutation: LOGIN_MUTATION,
            variables: { options: { email: credentials.email, password: credentials.password } },
          });

          if (userData?.login?.user) {
            setCookie("token", userData.login.user.id, { httpOnly: true, secure: true });
            return {
              id: userData.login.user.id,
              username: userData.login.user.username,
              email: userData.login.user.email,
              role: "user",
            };
          }

          // Try company login
          const { data: companyData } = await apolloClient.mutate({
            mutation: LOGIN_COMPANY,
            variables: { options: { email: credentials.email, password: credentials.password } },
          });

          if (companyData?.loginCompany?.company) {
            setCookie("token", companyData.loginCompany.company.id, { httpOnly: true, secure: true });
            return {
              id: companyData.loginCompany.company.id,
              username: companyData.loginCompany.company.cname,
              email: companyData.loginCompany.company.email,
              role: "company",
            };
          }

          throw new Error("Invalid email or password.");
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message || "Authentication failed.");
          }
          throw new Error("An unexpected error occurred.");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
