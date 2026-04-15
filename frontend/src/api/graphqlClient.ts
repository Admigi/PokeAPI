import { createServerFn } from "@tanstack/react-start";

const graphqlFetchServer = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { query: string; variables: Record<string, unknown> }) => input,
  )
  .handler(async ({ data }) => {
    const url = process.env.GRAPHQL_URL || "http://localhost:8080/graphql";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: data.query, variables: data.variables }),
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const { data: responseData, errors } = await response.json();
    if (errors?.length) throw new Error(errors[0]?.message ?? "Unknown GraphQL error");
    return responseData;
  });

export async function graphqlFetch(
  query: string,
  variables: Record<string, unknown> = {},
) {
  return graphqlFetchServer({ data: { query, variables } });
}
