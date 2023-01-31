// import fetch from "node-fetch";

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
    `${process.env.NEXT_PUBLIC_RESOURCES_API_URL}/articles/getalltitles`,
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
