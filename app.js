const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");


const dbPath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3002, ()  =>
      console.log("server Running At: http://localhost:3002/");
    );
  } catch (e) {
    console.log(`DB ERROR :${e.message}`);
    process.exit(1);
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

  const player = await db.get(get_player_details);
  response.send(convertDbObjectToResponseObject(player));
});


//adding  player details

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const add_player_details = `
    INSERT INTO 
    cricket_team(playerName,jerseyNumber,role)
    VALUES
    ( '${playerName},'${jerseyNumber},'${role} );`;

  const player = await db.run(add_player_details);
  response.send("Player Added to Team");
});


// updating player based on player_id

app.put("/player/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const update_player = `
    UPDATE
    cricket_team
    SET
    player_name = '${playerName}',
    jersey_number = '${jerseyNumber}',
    role = '${role}'
    WHERE
    player_id=${playerId};`;
  await db.run(update_player);
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
  await db.run(delete_player);
  response.send("Player Removed");
});

module.exports = app;
