const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
const app = express();
app.use(express.json());
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

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayers = `
    SELECT
    *
    FROM
    cricket_team;
    `;
  const player = await db.all(getPlayers);
  response.send(
    player.map((eachPlayer) => 
      convertDbObjectToResponseObject(eachPlayer);
    )
  );
});

//adding  player details

app.post("/players/", async (request, response) => {
  const player_details = request.body;
  const { playerName, jerseyNumber, role } = player_details;
  const add_player_details = `
    INSERT INTO 
    player(playerName,jerseyNumber,role)
    VALUES
    (
        '${playerName},
        '${jerseyNumber},
        '${role}
    );`;
  const dbResponse = await db.run(add_player_details);
  const bookId = dbResponse.lastId;
  response.send("Player Added to Team");
});

//  get player details with book_id

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const player_details = request.body;
  const get_player_details = `
        SELECT 
        *
        FROM
        cricket_team
        WHERE 
        player_id=${playerId} `;

  const dbResponse = await db.get(get_player_details);
  response.send(dbResponse);
});

// updating player based on player_id

app.put("/player/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const player_details = request.params;
  const { playerName, jerseyNumber, role } = player_details;
  const update_player = `
    UPDATE
    cricket_team
    SET
    playerName = '${playerName}',
    jerseyNumber = '${jerseyNumber}',
    role = '${role}'
    WHERE
    player_id=${playerId};
    `;
  const dbResponse = await db.run(update_player);
  response.send("Player Details Updated");
});

//deleting player based on player_id

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const delete_player = `
    DELETE FROM
    cricket_team
    WHERE 
    player_id =${playerId};`;
  const dbResponse = await db.run(delete_player);
  response.send("Player Removed");
});

module.exports = app;
