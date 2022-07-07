import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"

import ArticleView, { ArticleMeta } from "../components/article"
import Landing from "../components/landing"
import { NEARAuth, useContract } from "../components/nearAuth"

import { content } from "./index.module.css"

export default function () {
  const [articles, setArticles] = useState<ArticleMeta[]>([])
  const contract = useContract()

  useEffect(function () {
    contract.getArticles()
      .then(articles => articles.map(article => ({
        id: article[0],
        author: article[1].author,
        title: article[1].title,
        date: new Date(article[1].published_date / 1000000)
      })))
      .then(articles => setArticles(articles))
  }, [])

  return <>
    <Helmet>
      <title>Blockipedia - Welcome</title>
    </Helmet>
    <Landing></Landing>

    <NEARAuth redirect={false}>
      <div className={content}>
        {articles.map(a => <ArticleView article={a} key={a.id}></ArticleView>)}
      </div>
    </NEARAuth>
  </>
}
