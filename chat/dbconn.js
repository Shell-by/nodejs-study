const mysql = require("mysql");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'correction',
});

exports.select = async (column = "*", table = "", where = "1", callback) => {
  connection.query(`SELECT ${column} FROM ${table} WHERE ${where}`, (error, rows) => {
    if (error) callback(error, null);
    if (rows.length == 0) callback(error, "0");
    callback(null, rows[0].idx);
  });
}

exports.insert = async (table = "", values = "") => {
  connection.query(`INSERT INTO ${table} VALUES(${values})`);
}

/*
connection.connect();
    connection.query(`SELECT idx FROM chat_room WHERE (host_user_idx = '${socket.user}' AND member_user_idx = '${socket.to}') OR (host_user_idx = '${socket.to}' AND member_user_idx = '${socket.user}')`, (error, rows) => {
      if (error) throw error;
      if (rows[0].idx !== null) {
        socket.room = rows[0].idx;
      } else {
        connection.query(`INSERT INTO chat_room VALUES (NULL, '${socket.user}', '${socket.to}', NOW())`);
        
      }
    });

     connection.query(`INSERT INTO chat VALUES ('', NOW(), '')`, (error, rows) => {
      if (error) throw error;
      console.log('User info is: ', rows);
    });
*/