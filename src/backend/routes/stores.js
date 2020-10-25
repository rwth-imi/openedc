// NeDB
const Datastore = require('nedb');
const db = {};
db.crfs = new Datastore({
  filename: 'db/crfs.db',
  autoload: true
});
db.crf_data = new Datastore({
  filename: 'db/crf_data.db',
  autoload: true
});
db.data = new Datastore({
  filename: 'db/data.db',
  autoload: true
});
db.patients = new Datastore({
  filename: 'db/patients.db',
  autoload: true
});

module.exports = db;
