import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import Header from "../components/Header";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
				<style>{`html { display: none; }`}</style>
				<link rel="stylesheet" href={appCss} />
			</head>
			<body>
				<Header />
				{children}
				<Scripts />
			</body>
		</html>
	);
}
