"use client"; // Mark this as a client component

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apolloClient";

export default function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
