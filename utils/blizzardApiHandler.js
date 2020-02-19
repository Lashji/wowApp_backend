"use strict";
require("dotenv").config();
const axios = require("axios");
let token;
const Leaderboard = require("../models/leaderboard");
const BASE_URL_EU = "https://eu.api.blizzard.com/";
const DataHandler = require("./datahandler")
let NAMESPACE = "profile-eu";
let LOCALE = "en_US";

const initAPI = async () => {
  console.log("initing api");
  let response = await getToken();
  token = response.data.access_token;
  let url =
    "https://eu.api.blizzard.com/data/wow/pvp-season/27/pvp-leaderboard/3v3?namespace=dynamic-eu&locale=en_US";
  let ladderResponse = await doRequest(url);
  let pvpleaderboard = ladderResponse.data;

  let leaderboard = new Leaderboard({
    name: pvpleaderboard.name,
    type: pvpleaderboard.bracket.type,
    players: pvpleaderboard.entries.slice(0, 2)
  });

  const players = playersToArray(leaderboard);
  Promise.all(players).then(res =>
    Leaderboard.findOneAndUpdate({
      name: leaderboard.name
    }, {
      players: res
    }, {
      new: true,
      upsert: true
    })
  );
};

const playersToArray = leaderboard => {
  let players = [];
  for (let i in leaderboard.players) {
    console.log("pushing");
    players.push(buildPlayer(leaderboard.players[i]));
    console.log("players array", players);
  }

  console.log("returning from array");
  return players;
};

const buildPlayer = async i => {
  let player = i;
  const summary = await getSummary(i);
  if (!summary) return player;

  const {
    name,
    gender,
    faction,
    race,
    character_class,
    pvp_summary,
    media,
    specializations,
    equipment,
    appearance
  } = summary.data;

  const urls = [];
  urls.push(pvp_summary, media, specializations, equipment, appearance);

  const keys = ["pvp", "media", "spec", "items", "appearance"];
  player = {
    ...player,
    name,
    gender,
    faction,
    race,
    character_class
  };

  console.log("requests");
  for (let i in urls) {
    console.log("doing requests");
    let response = await doRequest(urls[i].href);
    player[keys[i]] = response.data;
  }

  const datahandler = new DataHandler(player)

  // setTimeout(() => {
  //   console.log("timeout");
  // }, 500); //0.5sec timeout for not spamming too many requests


  return datahandler.cleanedData();
};

const getSummary = async data => {
  let slug = data.character.realm.slug;
  let charName = data.character.name.toLowerCase();
  let url =
    BASE_URL_EU +
    `profile/wow/character/${slug}/${charName}?namespace=${NAMESPACE}&locale=${LOCALE}`;
  return doRequest(url);
};

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

const getData = () => {
  console.log("requesting data");
};

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