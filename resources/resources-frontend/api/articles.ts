// import fetch from "node-fetch";

import { Article } from "../interfaces";

export const fetchArticleTitlesByCategory = async (category: string) => {
  return await fetch(
    `${process.env.RESOURCES_API_URL}/articles/getbycategory?category=${category}`,
    {
      method: "GET",
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchAllArticleTitles = async () => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_RESOURCES_API_URL}/articles/getall`,
    {
      method: "GET",
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchArticleById = async (id: string) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_RESOURCES_API_URL}/articles/get/${id}`,
    {
      method: "GET",
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postResourceForm = async (requestObj: Article) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_RESOURCES_API_URL}/articles/create`,
    {
      method: "POST",
      body: JSON.stringify(requestObj),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateArticleById = async (id : string, requestObj: Article) => {
  console.log(requestObj);
  return await fetch(
    `${process.env.NEXT_PUBLIC_RESOURCES_API_URL}/articles/update/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(requestObj),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteArticleById = async (id: string) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_RESOURCES_API_URL}/articles/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      console.log("res", res);
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
