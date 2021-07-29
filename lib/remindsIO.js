const fs = require('fs');
const dataDir = 'usersData';


module.exports = class RemindsIO {
    /**
     * getReminds throws exceptions, please catch in caller.
     * @param {String} userId line system userid
     * @return {Array} reminds data
     */
    static getReminds(userId) {
        const reminds_file = `${dataDir}/${userId}.json`;
        
        let reminds = [];
        if (fs.existsSync(reminds_file)) {
            reminds = JSON.parse(fs.readFileSync(reminds_file));
        }
        
        if (reminds instanceof Array) {
            return reminds;
        }
        throw new Error(`Failed to get reminds from ${reminds_file}`);
    }

    /**
     * addRemind throws exceptions, please catch in caller.
     * @param {String} userId line system userid
     * @param {Object} data remind to add, {'title': string, 'remindTime': string}
     */
    static addRemind(userId, data) {
        const reminds_file = `${dataDir}/${userId}.json`;

        let reminds = [];
        if (fs.existsSync(reminds_file)) {
            reminds = JSON.parse(fs.readFileSync(reminds_file));
        }
        reminds.push(data);
        fs.writeFileSync(reminds_file, JSON.stringify(reminds));
    }
}
