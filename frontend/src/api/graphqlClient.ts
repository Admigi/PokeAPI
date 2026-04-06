const GRAPHQL_URL = process.env.GRAPHQL_URL || "http://localhost:8080/graphql";

// biome-ignore lint/suspicious/noExplicitAny: GraphQL responses are dynamically shaped
export async function graphqlFetch(query: string, variables: Record<string, unknown> = {}): Promise<any> {
	const response = await fetch(GRAPHQL_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query, variables }),
	});
	if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
	const { data, errors } = await response.json();
	if (errors?.length) throw new Error(errors[0]?.message ?? "Unknown GraphQL error");
	return data;
}
