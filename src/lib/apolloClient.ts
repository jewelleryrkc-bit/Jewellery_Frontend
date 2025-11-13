import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";

// Better environment detection
const isBrowser = typeof window !== "undefined";
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

// Configure HTTP link with proper environment variables
const httpLink = createHttpLink({
  uri: isProduction
    ? process.env.NEXT_PUBLIC_PROD_GRAPHQL_URI
    : process.env.NEXT_PUBLIC_DEV_GRAPHQL_URI || "http://localhost:4000/graphql",
  credentials: "include",
});

// Enhanced auth context
const authLink = setContext((_, { headers }) => {
  // Get authentication token from storage if it exists
  const token = isBrowser ? localStorage.getItem("token") : null;

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      "ngrok-skip-browser-warning": "true",
      // Add any other headers you need
    },
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Retry link for failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error) => !!error,
  },
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});