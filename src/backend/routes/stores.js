// NeDB
const Datastore = require('nedb');
const db = {};
db.forms = new Datastore({
  filename: 'db/forms.db',
  autoload: true
});
db.crfs = new Datastore({
  filename: 'db/crfs.db',
  autoload: true
});
db.crfRecord = new Datastore({
  filename: 'db/crf_record.db',
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
