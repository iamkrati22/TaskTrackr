const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

// create a connection to the MySQL database using environmental variables
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

// connect to the database and log the status
connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('Database ' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    // retrieve all data from the "test" table in the database
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM test;";

                // execute the query and return the results or an error
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            console.log("DATABASE RES" + response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // insert a new row into the "test" table with the provided name and the current date and time
    async insertNewName(name) {
        console.log("function called");
        try {
            const dateAdded = new Date().toISOString(); // convert Date object to ISO string
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO test (name, date_added) VALUES (?,?);";

                // execute the query and return the ID of the inserted row or an error
                connection.query(query, [name, dateAdded], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                });
            });
            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded,
            };
        } catch (error) {
            console.log(error);
        }
    }

    // delete the row in the "test" table with the provided ID
    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); // ensure the ID is an integer
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM test WHERE id = ?";

                // execute the query and return the number of affected rows or an error
                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // update the "name" field in the "test" table for the row with the provided ID
    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10); // ensure the ID is an integer
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE test SET name = ? WHERE id = ?";

                // execute the query and return the number of affected rows or an error
                connection.query(query, [name, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });


            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    // Search the "name" field in the "test" table for the row with the provided string query
    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM test WHERE name = ?;";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;