-- Use these commands to wipe out database (for testing)
--DROP SCHEMA Public CASCADE;
--CREATE SCHEMA Public;

CREATE TABLE IF NOT EXISTS Users (
	user_ID INT PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(50) NOT NULL,
	isPaid BOOLEAN NOT NULL,
	isAdmin BOOLEAN NOT NULL,
	date_joined DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS Filters (
	filter_ID INT PRIMARY KEY,
	name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Photos (
	photo_ID INT PRIMARY KEY,
	filter_ID INT REFERENCES Filters(filter_ID),
	size FLOAT NOT NULL CHECK (size > 0),
	creation_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS Videos (
	video_ID INT PRIMARY KEY,
	filter_ID INT REFERENCES Filters(filter_ID),
	size FLOAT NOT NULL CHECK (size > 0),
	creation_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS UserPhotos (
	user_ID INT REFERENCES Users(user_ID),
	photo_ID INT REFERENCES Photos(photo_ID),
	PRIMARY KEY (user_ID, photo_ID)
);

CREATE TABLE IF NOT EXISTS UserVideos (
	user_ID INT REFERENCES Users(user_ID),
	video_ID INT REFERENCES Videos(video_ID),
	PRIMARY KEY (user_ID, video_ID)
);
