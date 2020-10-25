const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require('./stores.js');
const utils = require("./utils.js")
// File Upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, req.body.filename)
  }
})
const upload = multer({
  storage: storage
});

function saveNewCRF(crf, errorCB, successCB) {
  if (!crf.version) {
    crf.version = 1;
  }
  crf.newestVersion = null;

  db.crfs.insert(crf, function(err, inserted) {
    if (err) {
      console.log('error', err)
      errorCB(err)
    } else {
      successCB(inserted)
    }
  })
}

function saveEditCRF(crfId, crf, errorCB, successCB) {
  db.crfs.findOne({
    "_id": crfId
  }, (err, doc) => {
    if (err) {
      console.log('error', err)
      errorCB(err)
    } else {
      // TODO: Version aus Datein nehmen/vergleichen
      crf.version = doc.version + 1;
      crf.newestVersion = null;
      db.crfs.insert(crf, function(err, inserted) {
        if (err) {
          console.log('error', err)
          errorCB(err)
        } else {
          db.crfs.update({
            $where: function() {
              return this.newestVersion == crfId || this._id == crfId;
            }
          }, {
            $set: {
              newestVersion: inserted._id
            }
          }, {
            multi: true,
            returnUpdatedDocs: true
          }, (err, numReplaced, affectedDocuments) => {
            if (err) {
              console.log('error', err)
              errorCB(err)
            } else {
              successCB(inserted)
            }
          })
        }
      })
    }
  })
}

router.post("/api/crf/upload/", upload.single("file"), (req, res, next) => {
  const absolutePath = path.join(path.resolve("./"), req.file.path);
  const jsonString = fs.readFileSync(absolutePath, "utf-8");
  const jsonObject = JSON.parse(jsonString);

  // Todo: Parsing! From Excel to json
  jsonObject.createdAt = Date.now();
  jsonObject.createdBy = req.body.user || "defaultUser"; // TODO: user management

  saveNewCRF(jsonObject, (err) => {
    res.json({
      success: false,
      error: err,
      payload: null
    })
  }, (payload) => {
    res.json({
      success: true,
      error: false,
      payload: payload
    });
  })
});

router.post("/api/crf/edit/:crfId", upload.single("file"), (req, res, next) => {
  const absolutePath = path.join(path.resolve("./"), req.file.path);
  const jsonString = fs.readFileSync(absolutePath, "utf-8");
  const jsonObject = JSON.parse(jsonString);

  // Todo: Parsing! From Excel to json

  jsonObject.createdAt = Date.now();
  jsonObject.createdBy = req.body.user || "defaultUser"; // TODO: user management

  saveEditCRF(req.params.crfId, jsonObject, (err) => {
    res.json({
      success: false,
      error: err,
      payload: null
    })
  }, (payload) => {
    res.json({
      success: true,
      error: false,
      payload: payload
    });
  })
});

router.post('/api/crf/', (req, res, next) => {
  if (!req.body.crf.version) {
    req.body.crf.version = 1;
  }
  saveNewCRF(req.body.crf, (err) => {
    res.json({
      success: false,
      error: err,
      payload: null
    })
  }, (payload) => {
    res.json({
      success: true,
      error: false,
      payload: payload
    });
  })
})

router.put('/api/crf/:crfId', (req, res, next) => {
  saveEditCRF(req.params.crfId, req.body.crf, (err) => {
    res.json({
      success: false,
      error: err,
      payload: null
    })
  }, (payload) => {
    res.json({
      success: true,
      error: false,
      payload: payload
    });
  })
})

router.get('/api/crf/', (req, res, next) => {
  utils.getAllCRFs((err, docs) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      res.json({
        success: true,
        error: false,
        payload: docs
      });
    }
  })
})

router.get('/api/crf/:crfId', (req, res, next) => {
  db.crfs.findOne({
    "_id": req.params.crfId,
  }, (err, doc) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      res.json({
        success: true,
        error: false,
        payload: doc
      });
    }
  })
})

router.get('/api/crf/:crfId/newest', (req, res, next) => {
  db.crfs.findOne({
    "_id": req.params.crfId,
  }, (err, doc) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      db.crfs.findOne({
        "_id": doc.newestVersion
      }, (err, crf) => {
        if (err) {
          console.log('error', err)
          res.json({
            success: false,
            error: err,
            payload: null
          });
        } else {
          res.json({
            success: true,
            error: false,
            payload: crf
          });
        }
      })
    }
  })
})

router.get('/api/crf/:crfId/:version', (req, res, next) => {
  db.crfs.findOne({
    "_id": req.params.crfId,
  }, (err, doc) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      db.crfs.findOne({
        "newestVersion": doc.newestVersion,
        "version": req.params.version
      }, (err, crf) => {
        if (err) {
          console.log('error', err)
          res.json({
            success: false,
            error: err,
            payload: null
          });
        } else {
          res.json({
            success: true,
            error: false,
            payload: crf
          });
        }
      })
    }
  })
})

router.delete('/api/crf/:crfId/', (req, res, next) => {
  const deleteItem = {
    crf: {},
    createdAt: Date.now(),
    createdBy: req.body.user || "defaultUser", // TODO: user management
    deleted: true,
    newestVersion: null
  }
  db.crfs.insert(deleteItem, (err, inserted) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      db.crfs.update({
        "_id": req.params.crfId
      }, {
        $set: {
          "newestVersion": inserted._id
        }
      }, {}, (err, numReplaced) => {
        if (err) {
          console.log('error', err)
          res.json({
            success: false,
            error: err,
            payload: null
          });
        } else {
          res.json({
            success: true,
            error: false,
            payload: null
          });
        }
      })
    }
  })
})


module.exports = router;
