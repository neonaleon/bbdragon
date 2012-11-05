/*
 * SceneDefinitions.js
 * @author: Leon Ho
 * @author: Eldwin
 * This file contains definitions for the scenes we will use in the game
 */

function Scene(sceneName, initializer)
{
	this.sceneName = sceneName;
	this.initializer = initializer;
};

var SceneDefinitions = {};

/*
 * SPLASH SCENE
 * Splash an image when the app is started
 */
SceneDefinitions.SplashScene = new Scene("SplashScene", function()
{ 
	console.log("splash scene running");
	// show some splash image
	// connect to server
	// some duration later change scene, we might want to use this duration to load assets etc
	setTimeout(function(){ SceneManager.ChangeScene(SceneDefinitions.WaitingRoomScene) }, Properties.SPLASH_DURATION);
});

/*
 * LOAD SCENE
 * Display a loading image while app loads resources for the next scene
 */
SceneDefinitions.LoadScene = new Scene("LoadScene", function()
{ 
	console.log("load scene running");
});

// The Lobby for getting game information and connecting to games
SceneDefinitions.LobbyScene = new Scene("LobbyScene", function()
{ 
	console.log("lobby scene running");
	GUI.Button("Find Games", handler_FindGames).attr({	x:Properties.DEVICE_WIDTH/2-GUIDefinitions.BUTTON_WIDTH/2,
														y:Properties.DEVICE_HEIGHT/2-GUIDefinitions.BUTTON_HEIGHT/2});
});
var handler_FindGames = function(obj)
{
	console.log("clicked=", obj);
	NetworkManager.RequestGameList(handler_PopulateGameLobby);
};
var handler_PopulateGameLobby = function (data)
{
	console.log("populate game lobby with=", data);
};

// The Waiting Room
SceneDefinitions.WaitingRoomScene = new Scene("WaitingRoomScene", function()
{
	NetworkManager.Connect(Properties.MASTERSERVER_IP, Properties.MASTERSERVER_PORT, handler_Connect);
	
	console.log("waiting room scene running");

	var startButton = GUI.Button( "Start", handler_Start );
	startButton.attr({	x: Properties.DEVICE_WIDTH - 2 * GUIDefinitions.BUTTON_WIDTH })
	startButton.attr({	y: Properties.DEVICE_HEIGHT - 2 * GUIDefinitions.BUTTON_HEIGHT });

	// all the position settings should go inside GUI.js when using real graphics
	var colorButtons = GUI.OneOrNoneRadioButtonGroup(["Blue", "Green", "Red", "Pink"], handler_Seat);
	colorButtons[ Player.Color.BLUE ].attr({ x: 100, y: 100, w: 150, h: 350 });
	colorButtons[ Player.Color.GREEN ].attr({ x: 300, y: 100, w: 150, h: 350 });
	colorButtons[ Player.Color.RED ].attr({ x: 500, y: 100, w: 150, h: 350 });
	colorButtons[ Player.Color.PINK ].attr({ x: 700, y: 100, w: 150, h: 350 });
});
var handler_Connect = function()
{
	console.log("NetworkManager connected");
	NetworkManager.AddListener(MessageDefinitions.SEAT, handler_SeatResponse);
	NetworkManager.AddListener(MessageDefinitions.START, handler_StartResponse);
	NetworkManager.AddListener(MessageDefinitions.UPDATE, handler_UpdateResponse);
	NetworkManager.AddListener(MessageDefinitions.ENTER_ROOM, handler_EnterRoomResponse);
};
var handler_EnterRoomResponse = function(data)
{
	console.log("enter: ", data);
	// read from data, initialize game data
	GameState.JoinRoom( data );
};
var handler_UpdateResponse = function(data)
{
	console.log("update: ", data);
};

// players seats on a colour
var handler_Seat = function( buttonIndex, value )
{
	NetworkManager.SendMessage(MessageDefinitions.SEAT, { color: value ? buttonIndex : Player.Color.NONE });
};
// broadcast receiver for reponses to all players seatting on color
var handler_SeatResponse = function(player)
{
	if ( player.color == Player.Color.NONE )
		console.log( "P" + ( player.id + 1 ) + " unseated" ) ;
	else
		console.log( "P" + ( player.id + 1 ) + " sat on " + player.color );
};

// request for game to start (on leader will see the button)
var handler_Start = function(obj)
{
	NetworkManager.SendMessage(MessageDefinitions.START, {})
};
// broadcast response when game is starting
var handler_StartResponse = function(data)
{
	SceneManager.ChangeScene( SceneDefinitions.GameScene );
};

/* 
 * GAME SCENE
 * Game scene is where the game will be played
 */
SceneDefinitions.GameScene = new Scene("GameScene", function()
{
	console.log("game scene running");
	// generate map and entities
	Map.generate(SpriteDefinitions.MAP_1);
	var dragon = Map.spawnPlayer(SpriteDefinitions.BLUE);
	var dragon2 = Map.spawnPlayer(SpriteDefinitions.PINK);
	var dragon3 = Map.spawnPlayer(SpriteDefinitions.GREEN);
	var dragon4 = Map.spawnPlayer(SpriteDefinitions.RED);
	
	// setup GUI
	var aButton = GUI.ActionButton(GUI.ACTION_BUTTON_A).attr({x:900, y:400});
	var bButton = GUI.ActionButton(GUI.ACTION_BUTTON_B).attr({x:960, y:400});
	var pad = GUI.Dpad(dragon3).attr({x:50, y:400}); // allow player to control the dragon
});
