CREATE TABLE `users` (
	`idx`	INT(11)	NOT NULL,
	`id`	VARCHAR(20)	NULL,
	`password`	VARCHAR(255)	NULL,
	`interest_list`	VARCHAR(255)	NULL
);

CREATE TABLE `interest_list_name` (
	`idx`	INT(11)	NOT NULL,
	`name`	VARCHAR(255)	NULL
);

CREATE TABLE `chat_room` (
	`idx`	INT(11)	NOT NULL,
	`from_user_idx`	INT(11)	NOT NULL,
	`to_user_idx`	INT(11)	NULL,
	`last_message_text`	TEXT	NULL,
	`last_message_date`	datetime	NULL
);

CREATE TABLE `chat` (
	`idx`	INT(11)	NOT NULL,
	`chat_idx`	INT(11)	NOT NULL,
	`text`	text	NULL,
	`datetime`	datetime	NULL
);

CREATE TABLE `question` (
	`idx`	INT(11)	NOT NULL,
	`users_idx`	INT(11)	NOT NULL,
	`context`	TEXT	NULL,
	`create_datetime`	datetime	NULL,
	`update_datetime`	datetime	NULL,
	`is_check`	INT(1)	NULL
);

CREATE TABLE `answer` (
	`idx`	INT(11)	NOT NULL,
	`question_idx`	INT(11)	NOT NULL,
	`users_idx`	INT(11)	NOT NULL,
	`content`	TEXT	NULL,
	`is_check`	INT(1)	NULL
);

ALTER TABLE `users` ADD CONSTRAINT `PK_USERS` PRIMARY KEY (
	`idx`
);

ALTER TABLE `interest_list_name` ADD CONSTRAINT `PK_INTEREST_LIST_NAME` PRIMARY KEY (
	`idx`
);

ALTER TABLE `chat_room` ADD CONSTRAINT `PK_CHAT_ROOM` PRIMARY KEY (
	`idx`,
	`from_user_idx`
);

ALTER TABLE `chat` ADD CONSTRAINT `PK_CHAT` PRIMARY KEY (
	`idx`,
	`chat_idx`
);

ALTER TABLE `question` ADD CONSTRAINT `PK_QUESTION` PRIMARY KEY (
	`idx`,
	`users_idx`
);

ALTER TABLE `answer` ADD CONSTRAINT `PK_ANSWER` PRIMARY KEY (
	`idx`,
	`question_idx`,
	`users_idx`
);

ALTER TABLE `chat_room` ADD CONSTRAINT `FK_users_TO_chat_room_1` FOREIGN KEY (
	`from_user_idx`
)
REFERENCES `users` (
	`idx`
);

ALTER TABLE `chat` ADD CONSTRAINT `FK_chat_room_TO_chat_1` FOREIGN KEY (
	`chat_idx`
)
REFERENCES `chat_room` (
	`idx`
);

ALTER TABLE `question` ADD CONSTRAINT `FK_users_TO_question_1` FOREIGN KEY (
	`users_idx`
)
REFERENCES `users` (
	`idx`
);

ALTER TABLE `answer` ADD CONSTRAINT `FK_question_TO_answer_1` FOREIGN KEY (
	`question_idx`
)
REFERENCES `question` (
	`idx`
);

ALTER TABLE `answer` ADD CONSTRAINT `FK_uesrs_TO_answer_2` FOREIGN KEY (
	`users_idx`
)
REFERENCES `users` (
	`idx`
);

