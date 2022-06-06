const { con } = require("../config/connection");

exports.checkProperty = async (hotel_code) => {
  let sql = `SELECT databasename from saasconfig.syscompany where hotel_code=${hotel_code}`;
  con.query(sql, [2, 1], (err, result) => {
    if (err) throw err;
    console.log("Result: " + result["0"]["databasename"]);
    //  return res.status(200).json({data:result['0']['databasename']})
    return  callba
  });
};
