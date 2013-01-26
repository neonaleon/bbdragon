// Properties.js
// @author Leon Ho
// This file contains the properties for the game

var Properties = 
{
	// device properties
	DEVICE_WIDTH: 1024,
	DEVICE_HEIGHT: 600,
	RENDERER : "DOM", // or Canvas NOTE: Canvas renderer will be a breaking change
	
	// server properties
	//MASTERSERVER_IP: "192.168.1.100",
	//MASTERSERVER_IP: "http://localhost",
	//MASTERSERVER_IP: "http://ec2-184-73-92-233.compute-1.amazonaws.com",
	MASTERSERVER_IP: "http://bombz.herokuapp.com",
	MASTERSERVER_PORT: 80,
	
	// game properties
	SPLASH_DURATION: 2000,
	WINSCREEN_DURATION: 5000,
};
