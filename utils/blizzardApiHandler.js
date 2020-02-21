"use strict";
require("dotenv").config();
const axios = require("axios");
let token;
const BASE_URL_EU = "https://eu.api.blizzard.com/";
const DataHandler = require("./datahandler")
const LeaderboardHandler = require("./leaderboardHandler")
const MediaHandler = require("./mediaHandler")
let NAMESPACE = "profile-eu";
let LOCALE = "en_US";

const initAPI = async () => {
  console.log("initing api");
  let response = await getToken();
  token = response.data.access_token;
  getData(token)
  getMedia()
}

const doRequest = async (url, log = false) => {
  return axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(res => (log ? console.log(res) : "" || res))
    .catch(err => console.log("err: ", err));
};

const getData = (token) => {
  const leaderboadhandler = new LeaderboardHandler(doRequest)
};

const getMedia = (token) => {
  const mediaHandler = new MediaHandler(doRequest)
}

const refreshData = () => {
  console.log("refreshing data");
};

const getToken = () => {
  return axios
    .get(`https://eu.battle.net/oauth/token`, {
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET
      },
      params: {
        grant_type: "client_credentials"
      }
    })
    .then(response => response || console.log("res", response));
};

module.exports = {
  getData,
  refreshData,
  token,
  initAPI
};