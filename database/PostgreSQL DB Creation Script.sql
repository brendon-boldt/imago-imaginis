-- Use these commands to wipe out database (for testing)
DROP SCHEMA Public CASCADE;
CREATE SCHEMA Public;

CREATE TABLE IF NOT EXISTS ASP_User (
	user_ID INT PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(50) NOT NULL,
	date_joined DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS Paid_User (
    	user_ID INT REFERENCES ASP_User(user_ID),
   	PRIMARY KEY (user_ID)
);

CREATE TABLE IF NOT EXISTS Admin (
    	user_ID INT REFERENCES ASP_User(user_ID),
    	PRIMARY KEY (user_ID)
);

CREATE TABLE IF NOT EXISTS Stat_Type (
    stat_ID INT PRIMARY KEY,
	stat_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Usage (
	user_ID INT REFERENCES ASP_User(user_ID),
    	timestamp TIMESTAMP NOT NULL,
    	stat_ID INT REFERENCES Stat_Type(stat_ID),	
    	PRIMARY KEY (user_ID, timestamp)
);

CREATE TABLE IF NOT EXISTS Filter (
	filter_ID INT PRIMARY KEY,
	name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Photo (
	photo_ID INT PRIMARY KEY,
	filter_ID INT REFERENCES Filter(filter_ID),
	size FLOAT NOT NULL CHECK (size > 0),
	creation_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS Video (
	video_ID INT PRIMARY KEY,
	filter_ID INT REFERENCES Filter(filter_ID),
	size FLOAT NOT NULL CHECK (size > 0),
	creation_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Photo (
	user_ID INT REFERENCES ASP_User(user_ID),
	photo_ID INT REFERENCES Photo(photo_ID),
	PRIMARY KEY (user_ID, photo_ID)
);

CREATE TABLE IF NOT EXISTS User_Video (
	user_ID INT REFERENCES ASP_User(user_ID),
	video_ID INT REFERENCES Video(video_ID),
	PRIMARY KEY (user_ID, video_ID)
);
