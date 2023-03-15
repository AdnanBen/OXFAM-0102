const express = require("express");
const cors = require("cors");
const app = express();

// Enable all CORS requests
app.use(cors());

app.get("/api/incompletereports", (req, res) => {
  const data = [
    {
      report_id: "1",
      // questionid : filled in
      report_data: [{ 1: 1 }, { 2: 0 }, { 3: 0 }],
    },

    {
      report_id: "2",
      report_data: [{ 1: 1 }, { 2: 1 }, { 3: 0 }],
    },

    {
      report_id: "3",
      report_data: [{ 1: 1 }, { 2: 0 }, { 3: 0 }],
    },

    {
      report_id: "4",
      report_data: [{ 1: 1 }, { 2: 0 }, { 3: 1 }],
    },

    {
      report_id: "5",
      report_data: [{ 1: 0 }, { 2: 1 }, { 3: 1 }],
    },

    {
      report_id: "6",
      report_data: [{ 1: 0 }, { 2: 1 }, { 3: 0 }],
    },
  ];
  res.json(data);
});

app.get("/api/popularresources", (req, res) => {
  const data = [
    {
      resource_id: "1",
      views_in_last_week: "200",
      views_in_last_month: "500",
      views_all_time: "2000",
    },

    {
      resource_id: "2",
      views_in_last_week: "200",
      views_in_last_month: "500",
      views_all_time: "3000",
    },

    {
      resource_id: "3",
      views_in_last_week: "200",
      views_in_last_month: "500",
      views_all_time: "4000",
    },

    {
      resource_id: "4",
      views_in_last_week: "200",
      views_in_last_month: "500",
      views_all_time: "5000",
    },
  ];
  res.json(data);
});

app.get("/api/reportkeywords", (req, res) => {
  const data = [
    {
      word: "exampleword0",
      frequency: "1611",
    },

    {
      word: "exampleword1",
      frequency: "2334",
    },

    {
      word: "exampleword2",
      frequency: "5",
    },

    {
      word: "exampleword3",
      frequency: "40210",
    },

    {
      word: "exampleword4",
      frequency: "2020",
    },

    {
      word: "exampleword5",
      frequency: "3",
    },
  ];
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
