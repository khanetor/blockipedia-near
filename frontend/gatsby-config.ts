if (process.env.DOTENV_PATH) {
  require("dotenv").config({
    path: process.env.DOTENV_PATH,
  })
} else {
  require("dotenv").config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
  })
}

import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: process.env.GATSBY_APP_NAME,
    siteUrl: `${process.env.GATSBY_HOSTNAME!}${process.env.GATSBY_PATH_PREFIX || ""}`
  },
  pathPrefix: process.env.GATSBY_PATH_PREFIX, // e.g. `/blockipedia-near` when served by GitHub Pages
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-layout",
    "gatsby-plugin-sitemap",
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": "./src/images/"
      },
      __key: "images"
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Blockipedia`,
        short_name: `B`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
        icon: `src/images/favicon.png`
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets\/svg/ // See below to configure properly
        }
      }
    }]
};

export default config;
