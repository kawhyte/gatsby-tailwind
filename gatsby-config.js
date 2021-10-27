// let activeEnv =
//   process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || process.env.OPENSTATE ||  process.env.CONTENTFUL_ACCESS_TOKEN || "development" || "production"

const resolveConfig = require("tailwindcss/resolveConfig");
const tailwindConfig = require("./tailwind.config.js");

const fullConfig = resolveConfig(tailwindConfig);

require("dotenv").config();
module.exports = {
	siteMetadata: {
		description: `Paid Leave Legislation Tracker`,
		title: "PFL Tracker",
		author: "Kenny Whyte",
		year: 2021,
		siteUrl: `https://paidleave.netlify.app`,
	},

	plugins: [
		`gatsby-plugin-eslint`,
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `gatsby-starter-tailwind`,
				short_name: `starter`,
				start_url: `/`,
				background_color: fullConfig.theme.colors.white,
				theme_color: fullConfig.theme.colors.green["500"],
				display: `minimal-ui`,
				icon: `src/images/tailwind-icon.png`,
			},
		},
		{
			resolve: `gatsby-plugin-postcss`,
			options: {
				postCssPlugins: [
					require(`tailwindcss`)(tailwindConfig),
					require(`autoprefixer`),
					...(process.env.NODE_ENV === `production`
						? [require(`cssnano`)]
						: []),
				],
			},
		},
		`gatsby-plugin-offline`,

		{
			resolve: "gatsby-source-graphql",
			options: {
				typeName: "OpenState",
				fieldName: "OpenState",
				url: "https://openstates.org/graphql",
				// HTTP headers
				headers: {
					// Learn about environment variables: https://gatsby.dev/env-vars
					"X-API-KEY": process.env.OPENSTATE,
				},
				// Additional options to pass to node-fetch
				fetchOptions: {},
			},
		},
	],
};
