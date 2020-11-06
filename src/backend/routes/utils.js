const db = require("./stores.js");

function getAllNewestCRFs(callback) {
  db.crfs.find(
    {
      $where: function() {
        return this.newestVersion === null || this._id === this.newestVersion;
      }
    },
    callback
  );
}

function getAllCRFs(callback) {
  db.crfs.find({}, callback);
}

module.exports = {
  getAllCRFs,
  getAllNewestCRFs
};
