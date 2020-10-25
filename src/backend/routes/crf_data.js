const express = require('express');
const router = express.Router();

const db = require('./stores.js');
const utils = require('./utils.js');


function insertData(patientId, crfId, field, value, user, callback) {
  const data = {
    patientId: patientId,
    crfId: crfId,
    field: field,
    value: value,
    nextVersion: null,
    createdAt: Date.now(),
    createdBy: user || "defaultUser" // TODO: user management
  }
  db.data.insert(data, callback);
}

function putData(dataId, patientId, crfId, field, value, user, callback) {
  const data = {
    patientId: patientId,
    crfId: crfId,
    field: field,
    value: value,
    nextVersion: null,
    createdAt: Date.now(),
    createdBy: user || "defaultUser" // TODO: user management
  }
  db.data.insert(data, (err, inserted) => {
    if (err) {
      callback(err, inserted)
    } else {
      db.data.update({
        "_id": dataId
      }, {
        $set: {
          "nextVersion": inserted._id
        }
      }, {}, (err, numReplaced) => {
        callback(err, inserted)
      })
    }
  });
}

router.post('/api/data/patient/:patientId/crf/:crfId/full', (req, res, next) => {
  db.crf_data.count({
    orifinCrfId: req.params.crfId,
    patientId: req.params.patientId
  }, (err, count) => {
    const number = count + 1;
    const crf_info = {
      crfId: req.params.crfId,
      patientId: req.params.patientId,
      createdAt: Date.now(),
      recordNumber: number
    }
    const errors = [];
    const insertedObjects = [];
    db.crf_data.insert(crf_info, (err, inserted) => {
      if (err) {
        res.json({
          success: false,
          error: err,
          payload: null
        })
      } else {
        let remainCallbacks = Object.entries(req.body.data).length;
        for (const [name, item] of Object.entries(req.body.data)) {
          insertData(req.params.patientId, inserted._id, name, item.value, req.body.user, (err, inserted) => {
            if (err) {
              errors.push(err);
            } else {
              insertedObjects.push(inserted);
            }
            remainCallbacks--;
            if (remainCallbacks <= 0) {
              if (errors.length > 0) {
                res.json({
                  success: false,
                  err: errors,
                  payload: null
                })
              } else {
                res.json({
                  success: true,
                  err: false,
                  payload: insertedObjects
                })
              }
            }
          })
        }
      }
    })
  })
})
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

router.get('/api/data/patient/:patientId/crfs', (req, res, next) => {
  utils.getAllCRFs((err, crfs) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      const patientId = req.params.patientId
      db.crf_data.find({
        patientId: patientId
      }, (err, docs) => {
        if (err) {
          console.log('error', err)
          res.json({
            success: false,
            error: err,
            payload: null
          });
        } else {
          docs.forEach((crfData, i) => {
            crfData.newestCRF = crfs.find(elem => elem._id == crfData.crfId).newestVersion
          });

          res.json({
            success: true,
            error: false,
            payload: docs
          });
        }
      })
    }
  })
})

// get newest
router.get('/api/data/patient/:patientId/crf/:crfId', (req, res, next) => {
  const patientId = req.params.patientId;
  const crfId = req.params.crfId;

  db.crf_data.findOne({
    patientId: patientId,
    crfId: crfId
  }, (err, doc) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      if (doc === null) {
        // look for newest predecessor
        db.crfs.find({
          newestVersion: req.params.crfId
        }, (err, docs) => {
          if (err) {
            console.log('error', err)
            res.json({
              success: false,
              error: err,
              payload: null
            });
          } else {
            db.crf_data.find({
              $where: function() {
                return docs.some(e => e._id === this.crfId)
              }
            }).sort({
              "createAt": -1
            }).exec((err, crf_data_obj) => {
              db.data.find({
                crfId: crf_data_obj[0]._id
              }, (err, data) => {
                if (err) {
                  res.json({
                    success: false,
                    error: err,
                    payload: null
                  });
                } else {
                  res.json({
                    success: true,
                    error: false,
                    payload: {
                      crfId: crf_data_obj[0].crfId,
                      data: data
                    }
                  });
                }
              })
            })
          }
        })
      } else {
        db.data.find({
          crfId: doc._id
        }, (err, data) => {
          if (err) {
            res.json({
              success: false,
              error: err,
              payload: null
            });
          } else {
            res.json({
              success: true,
              error: false,
              payload: {
                crfId: doc.crfId,
                data: data
              }
            });
          }
        })
      }
    }
  })
})

router.get('/api/data/patient/:patientId/crf/:crfId/:number', (req, res, next) => {
  db.crf_data.findOne({
    crfId: req.params.crfId,
    patientId: req.params.patientId,
    recordNumber: req.params.number
  }, (err, doc) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      if (doc) {
        db.data.find({
          crfId: doc._id
        }, (err, data) => {
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
              payload: {
                crfId: doc.crfId,
                data: data
              }
            });
          }
        })
      } else {
        res.json({
          success: true,
          error: false,
          payload: {}
        })
      }
    }
  })
})

router.put('/api/data/patient/:patientId/crf/:crfId/full', (req, res, next) => {
  db.crf_data.findOne({
    crfId: req.params.crfId
  }, (err, doc) => {
    if (err || doc === null) {
      res.json({
        success: false,
        err: err,
        payload: null
      })
    } else {
      const errors = [];
      const insertedObjects = [];
      let remainCallbacks = Object.entries(req.body.data).length;
      for (const [name, item] of Object.entries(req.body.data)) {
        putData(item._id, req.params.patientId, doc._id, name, item.value, req.body.user, (err, inserted) => {
          if (err) {
            errors.push(err);
          } else {
            insertedObjects.push(inserted);
          }
          remainCallbacks--;
          if (remainCallbacks <= 0) {
            if (errors.length > 0) {
              res.json({
                success: false,
                err: errors,
                payload: null
              })
            } else {
              res.json({
                success: true,
                err: false,
                payload: insertedObjects
              })
            }
          }
        })
      }
    }
  })
})

router.post('/api/data/patient/:patientId/crf/:crfId', (req, res, next) => {
  insertData(req.params.patientId, req.params.crfId, req.body.data.field, req.body.data.value, req.body.user, (err, inserted) => {
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
        payload: inserted
      });
    }
  })
})

router.put('/api/data/:dataId/', (req, res, next) => {
  db.data.findOne({
    "_id": req.params.dataId
  }, (err, doc) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      putData(req.params.dataId, doc.patientId, doc.crfId, req.body.data.field, req.body.data.value, req.body.user, (err, numReplaced) => {
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
            payload: numReplaced
          });
        }
      })
    }
  })

})

module.exports = router;
