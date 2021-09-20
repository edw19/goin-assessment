import { useQuery } from "react-query";
import { request } from "graphql-request";
import { GET_CATEGORIES } from "../graphql/queries";
import { URI_GRAPHQL } from "src/graphql/constants";

export async function fetcherGetCategories() {
  const data = await request(URI_GRAPHQL,  GET_CATEGORIES);
  return data.getCategories;
}

export function useCategories() {
  return useQuery("getCategories", fetcherGetCategories);
}
