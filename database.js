
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');


exports.post_data = async function(req, res) {
    var tableName = req.params.table;
    var id = req.params.id;
    var data = req.body;
    var arrObj = [];
    Object.keys(data).forEach(function (head) {
        var obj = data[head];
        arrObj.push(`'${head}'`);
        arrObj.push(`'${obj}'`);
    });
    var sql = ` insert into ${database}.${tableName}(id, doc) values( '${id}', COLUMN_CREATE( ${arrObj.join(',') } ) ) on duplicate key update doc = VALUES(doc)  `;
    db.run(sql, function (error, results, fields) {
        console.log(error, results)
        db.close();
        res.end(JSON.stringify({
            'message': JSON.stringify(results)
        }));
    });
}