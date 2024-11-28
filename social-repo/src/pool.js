const pg = require("pg");

// normally , we would create a pool like this;

// const pool = new pg.Pool({
//     host: 'localhost' ,
//     port: 5432
// })

// module.exposts = pool;
// but if you create a pool like that is is very chalenging to connect to multiple databases
// instead we will encapsulate it in a class

class Pool {
  _pool = null;

  connect(options) {
    this._pool = new pg.Pool(options);
    return this._pool.query('Select 1 + 1;');// forcing to connect the pool to the db
  }
}

module.exports = new Pool();
