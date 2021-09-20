import { useQuery } from "react-query";
import { GraphQLClient } from "graphql-request";
import { GET_REPORTS } from "../graphql/queries";
import { URI_GRAPHQL } from "src/graphql/constants";

export async function fetcherGetReports() {
    const token = window.localStorage.getItem("access-token");

    if (!token) return null;
    const headers = {
        headers: {
            authorization: `Bearer ${token ? token : ""}`,
        },
    };
    const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
    try {
        const data = await graphqlClient.request(GET_REPORTS);
        return data.getReportSales;
    } catch { }
}

export function useReportSale() {
    return useQuery("getReports", fetcherGetReports);
}
