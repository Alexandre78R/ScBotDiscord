CREATE TABLE users
(
  id              INT unsigned NOT NULL AUTO_INCREMENT, # Unique ID for the record
  idNameDiscord   INT NOT NULL,							# User id on Discord
  nameTagDiscord  VARCHAR(150) NOT NULL,                # User name on Discord
  nameGuild       CHAR(1) NOT NULL,                     # Guild tag on Discord
  PRIMARY KEY     (id)                                  # Make the id the primary key
);

CREATE TABLE monsters
(
  id              INT unsigned NOT NULL AUTO_INCREMENT, # Unique ID for the record
  idMonster		  INT NOT NULL UNIQUE,					# Monster id on SW record
  nameMonster     CHAR(1) NOT NULL,						# Monster Name
  PRIMARY KEY     (id)                                  # Make the id the primary key
);

CREATE TABLE defenses
(
  id              INT unsigned NOT NULL AUTO_INCREMENT, # Unique ID for the record
  idMonster		  INT NOT NULL UNIQUE,					# Monster id on SW record
  nameMonster     CHAR(1) NOT NULL,						# Monster Name
  PRIMARY KEY     (id)                                  # Make the id the primary key
);