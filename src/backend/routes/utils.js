const db = require("./stores.js");

function getAllNewestCRFs(callback, patient = false) {
  db.forms.find({
    deleted: false
  }, function(err, docs) {
    const ids = [];
    docs.forEach(elem => {
      ids.push(elem.newestVersion);
    });
    if(patient === "true") {
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
  });
}

function getAllCRFs(callback) {
  db.crfs.find({}, callback);
}

module.exports = {
  getAllCRFs,
  getAllNewestCRFs
};
