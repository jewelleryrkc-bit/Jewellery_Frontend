"use client";
import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

const httpLink = createHttpLink({
  uri: isProduction
    ? process.env.NEXT_PUBLIC_PROD_GRAPHQL_URI
    : process.env.NEXT_PUBLIC_DEV_GRAPHQL_URI || "http://localhost:4000/graphql",
  credentials: "include", // IMPORTANT
});

// Auth link to add token from localStorage
// const authLink = setContext((_, { headers }) => {
//   const token = isBrowser ? localStorage.getItem("token") : null;
//   return {
//     headers: {
//       ...headers,
//       ...(token ? { authorization: `Bearer ${token}` } : {}),
//     },
//   };
// });

// Error link for logging errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Retry link for failed requests
const retryLink = new RetryLink({
  delay: { initial: 300, max: 3000 },
  attempts: { max: 3 },
});

// Apollo client
export const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink,httpLink]), //authLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    //watchQuery: { fetchPolicy: "cache-first", errorPolicy: "all" },
    query: { fetchPolicy: "network-only", errorPolicy: "all" },
    mutate: { errorPolicy: "all" },
  },
});
