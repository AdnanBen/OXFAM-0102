// import { Article } from "../interfaces";

// export const fetchArticleTitlesByCategory = async (category: string) => {
export const fetchArticleTitlesByCategory = async (category) => {
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

// export const fetchArticleById = async (id: string) => {
export const fetchArticleById = async (id) => {
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

// export const postResourceForm = async (requestObj: Article) => {
export const postResourceForm = async (requestObj) => {
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

// export const updateArticleById = async (id : string, requestObj: Article) => {
export const updateArticleById = async (id, requestObj) => {
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

// export const deleteArticleById = async (id: string) => {
export const deleteArticleById = async (id) => {
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
