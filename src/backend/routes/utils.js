const db = require("./stores.js");

function getAllNewestCRFs(callback) {
  db.forms.find({
    deleted: false
  }, function(err, docs) {
    const ids = [];
    docs.forEach(elem => {
      ids.push(elem.newestVersion);
    });
    db.crfs.find(
      {
        _id: {
          $in: ids
        }
      },
      callback
    );
  });
}

function getAllCRFs(callback) {
  db.crfs.find({}, callback);
}

module.exports = {
  getAllCRFs,
  getAllNewestCRFs
};
