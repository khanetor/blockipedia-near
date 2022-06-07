if (process.env.DOTENV_PATH) {
  require("dotenv").config({
    path: process.env.DOTENV_PATH,
  })
}

import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Blockipedia`,
    siteUrl: `https://nlhkh.github.io/blockipedia-near`
  },
  pathPrefix: process.env.GATSBY_PATH_PREFIX || "/blockipedia-near",
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
