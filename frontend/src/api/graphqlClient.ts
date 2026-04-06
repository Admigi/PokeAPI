import { createServerFn } from "@tanstack/react-start";

const getGraphqlUrl = createServerFn().handler(() => {
  return process.env.GRAPHQL_URL || "http://localhost:8080/graphql";
});

export async function graphqlFetch(query: string, variables: Record<string, unknown> = {}) {
  const url = await getGraphqlUrl();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const { data, errors } = await response.json();
  if (errors?.length) throw new Error(errors[0]?.message ?? "Unknown GraphQL error");
  return data;
}