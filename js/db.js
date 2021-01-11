const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const localConnectionString = 'postgres://bvonmskujveymd:10a2e242dd1ca1bfca3a122ff465ba3f1f2e064313f5c1316d1d8effca023afd@ec2-54-217-208-105.eu-west-1.compute.amazonaws.com:5432/d9tfgagnpk3692';

const db = {}

db.runQuery = async function(sql){
  const client = new Client({
    connectionString: connectionString || localConnectionString,
    ssl: true,
  });

  let response = null;

  try {
    await client.connect();

    let res = await client.query(sql).then(function(res){
      return res;
    });

    response = res.rows;
    await client.end();

  } catch (error) {
    console.log(error);
  }

  return response;
}

module.exports = db;
