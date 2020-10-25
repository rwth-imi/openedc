const db = require('./stores.js');

function getAllCRFs(callback) {
  db.crfs.find({
    $where: function() {
      return this.newestVersion === null || this._id === this.newestVersion;
    }
  }, callback)
}

module.exports = {
  getAllCRFs
}
