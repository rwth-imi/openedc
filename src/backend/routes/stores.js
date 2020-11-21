// the different stores of the NeDB
const Datastore = require("nedb");
const db = {};

// one crf is one dataset in the forms store. It contains
// the reference ID of the newest crfVersion
db.forms = new Datastore({
  filename: "db/forms.db",
  autoload: true
});
// crfs store contains all crfs with all versions. Every dataset
// has a reference to its corresponding form
db.crfs = new Datastore({
  filename: "db/crfs.db",
  autoload: true
});
// a dataset in the crfRecord store is one instance of filling of one patient.
// It references the patient, the form and the crf
db.crfRecord = new Datastore({
  filename: "db/crf_record.db",
  autoload: true
});
// this store contains all single data fields with reference to patient
// and crfRecord
db.data = new Datastore({
  filename: "db/data.db",
  autoload: true
});
// this store contains patients without any data, since the data of a patient is
// saved as crf data
db.patients = new Datastore({
  filename: "db/patients.db",
  autoload: true
});

module.exports = db;
