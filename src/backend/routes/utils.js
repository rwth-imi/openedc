const db = require("./stores.js");

function getAllNewestCRFs(callback, patient = false) {
  db.forms.find(
    {
      deleted: false
    },
    function(err, docs) {
      const ids = [];
      docs.forEach(elem => {
        ids.push(elem.newestVersion);
      });
      if (patient === "true") {
        db.crfs.find(
          {
            _id: {
              $in: ids
            }
          },
          callback
        );
      } else {
        db.crfs.find(
          {
            _id: {
              $in: ids
            },
            name: {
              $ne: "Patient"
            }
          },
          callback
        );
      }
    }
  );
}

function getAllCRFs(callback) {
  db.crfs.find({}, callback);
}

function getPatientCRF(callback) {
  db.crfs.findOne(
    {
      name: "Patient"
    },
    (err, doc) => {
      if (err) {
        console.log("error", err);
        callback(err, null);
      } else if (doc === null) {
        callback("Patient CRF not found", null);
      } else {
        db.forms.findOne(
          {
            _id: doc.formsId
          },
          (err, form) => {
            if (err) {
              console.log("error", err);
              callback(err, null);
            } else {
              if (form.newestVersion === doc._id) {
                callback(null, doc);
              } else {
                db.crfs.findOne(
                  {
                    _id: form.newestVersion
                  },
                  (err, newest) => {
                    if (err) {
                      console.log("error", err);
                      callback(err, null);
                    } else {
                      callback(null, newest);
                    }
                  }
                );
              }
            }
          }
        );
      }
    }
  );
}

function getPatientCRFForPatientId(patientId, withId = true, callback) {
  getPatientCRF((err, crf) => {
    if (err) {
      callback(err, null);
    } else {
      db.crfRecord
        .find({
          patientId: patientId,
          formsId: crf.formsId
        })
        .sort({
          createdAt: -1
        })
        .exec((err, records) => {
          if (err) {
            callback(err, null);
          } else if (records.length <= 0) {
            callback("No patient record found", null);
          } else {
            db.data.find(
              {
                recordId: records[0]._id,
                nextVersion: null
              },
              (err, data) => {
                const tmpData = {};
                data.forEach(item => {
                  if(withId) {
                    tmpData[item.field] = {};
                    tmpData[item.field].value = item.value;
                    tmpData[item.field]._id = item._id;
                  } else {
                    tmpData[item.field] = item.value;
                  }
                });
                tmpData.recordId = records[0]._id;
                callback(false, tmpData);
              }
            );
          }
        });
    }
  });
}

module.exports = {
  getAllCRFs,
  getAllNewestCRFs,
  getPatientCRF,
  getPatientCRFForPatientId
};
