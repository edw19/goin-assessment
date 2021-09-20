import { GraphQLClient } from "graphql-request";
import { useQuery } from "react-query";
import { URI_GRAPHQL } from "src/graphql/constants";
import { GET_USER } from "src/graphql/queries";

async function fetcherGetUser() {
  const token = window.localStorage.getItem("access-token");

  if (!token) return null;
  const headers = {
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  };
  const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
  try {
    const data = await graphqlClient.request(GET_USER);
    return data.getUser;
  } catch {}
}

export function useUser() {
  return useQuery("getUser", fetcherGetUser);
}
