import React from "react";
import CollapsibleTab from "../component/CollapsibleTab";
import { ArticleContainer, ArticleAnchor, ResourceTitle } from "./resourceHome.styles";

function ResourceHome() {
  const categoryTypes = ["Category 1", "Category 2", "Category 3"];
  const sampleAPIResponse = [
    {
      title: "Title: Lorem ipsum dolor sit amet consectetur adipisicing elit",
      body: "Body a",
      category: "Category 1",
      _id: "1",
    },
    {
      title: "Title b",
      body: "Body b",
      category: "Category 1",
      _id: "2",
    },
    {
      title: "Title c",
      body: "Body c",
      category: "Category 1",
      _id: "3",
    },
    {
      title: "Title d",
      body: "Body d",
      category: "Category 2",
      _id: "4",
    },
    {
      title: "Title e",
      body: "Body e",
      category: "Category 2",
      _id: "5",
    },
    {
      title: "Title f",
      body: "Body f",
      category: "Category 3",
      _id: "6",
    },
  ];

  const collapsibleHeader = (category) => {
    return <div>{category}</div>;
  };

  const collapsibleContent = (category) => {
    const filteredArticles = sampleAPIResponse.filter(
      (article) => article.category === category
    );
    console.log("filteredArticles", filteredArticles);
    return filteredArticles.map((article) => {
      return (
        <ArticleAnchor key={article._id} href="/article/1">
          <ArticleContainer>{article.title}</ArticleContainer>
        </ArticleAnchor>
      );
    });
  };
  console.log("response", collapsibleContent("Category 1"));

  return (
    <>
      <ResourceTitle>Resources</ResourceTitle>
      {categoryTypes.map((category) => {
        return (
          <CollapsibleTab
            headerComponent={collapsibleHeader(category)}
            contentComponent={collapsibleContent(category)}
          ></CollapsibleTab>
        );
      })}
    </>
  );
}

export default ResourceHome;
