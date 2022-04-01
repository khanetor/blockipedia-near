import React from "react"
import { Helmet } from "react-helmet"

import ArticleView, { Article } from "../components/article"
import Landing from "../components/landing"

import { content } from "./index.module.css"

export default function () {
  const articles: Article[] = [
    { id: 1, author: 'mackenzie.near', title: 'Helping Any of Us Can Help Us All', date: new Date() },
    { id: 2, author: 'ben.near', title: 'Helping Any of Us Can Help Us All', date: new Date() },
    { id: 3, author: 'kha.near', title: 'Helping Any of Us Can Help Us All', date: new Date() },
    { id: 4, author: 'khang.near', title: 'Helping Any of Us Can Help Us All', date: new Date() },
    { id: 5, author: 'skynews.near', title: 'Helping Any of Us Can Help Us All', date: new Date() },
    { id: 6, author: 'oracle.near', title: 'Helping Any of Us Can Help Us All', date: new Date() },
    { id: 7, author: 'uknews.near', title: 'Helping Any of Us Can Help Us All', date: new Date() },
  ]

  return <>
    <Helmet>
      <title>Blockipedia - Welcome</title>
    </Helmet>
    <Landing></Landing>
    <div className={content}>
      {articles.map(a => <ArticleView article={a} key={a.id}></ArticleView>)}
    </div>
  </>
}
