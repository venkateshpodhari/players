const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("server Running At: http://localhost:3000/cricket-team/");
    });
  } catch (e) {
    console.log(`DB ERROR :${e.message}`);
  }
};
initializeDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayers = `
    SELECT
    *
    FROM
    player;
    `;
  const player = await db.all(getPlayers);
  response.send(player);
});
