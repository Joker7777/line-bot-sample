const mysql = require('mysql');
const { mySqlConf } = require('../config');

module.exports =  new class MySql {
    constructor() {
        this.connection = mysql.createConnection(mySqlConf.DB_URL);
    }
    
    select(output, from, where) {
        let sql = 'SELECT ' + output.join(', ');
        sql += 'FROM ' + from;
        if (where.length !== 0) {
            sql += 'WHERE ' + where.join(' AND ');
        }
        this.connection.query(sql, (error, results, fields) => {
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
            if (error) {
                console.log('ERROR: ' + JSON.stringify(error));
                return null;
            }
            return results;
        });
    }

    insert(into, input) {
        let sql = 'INSERT INTO ' + into;
        const keys = Object.keys(input);
        const values = Object.values(input);
        sql += `(${keys.join(', ')}) VALUES (${values.join(', ')})`;
        this.connection.query(sql, (error, results, fields) => {
            if (error) {
                console.log('ERROR: ' + JSON.stringify(error));
                return false;
            }
            if (results.affectedRows == 0) {
                console.log('ERROR: failed to insert: ' + JSON.stringify(input));
                return false;
            }
            console.log('INFO: inserted ' + JSON.stringify(input));
            return true;
        })
    }
}
