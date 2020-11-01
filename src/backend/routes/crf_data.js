const express = require("express");
const router = express.Router();

const db = require("./stores.js");
const utils = require("./utils.js");

function insertData(patientId, crfId, field, value, user, callback) {
  const data = {
    patientId: patientId,
    crfId: crfId,
    field: field,
    value: value,
    nextVersion: null,
    createdAt: Date.now(),
    createdBy: user || "defaultUser" // TODO: user management
  };
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
  };
  db.data.insert(data, (err, inserted) => {
    if (err) {
      callback(err, inserted);
    } else {
      db.data.update(
        {
          _id: dataId
        },
        {
          $set: {
            nextVersion: inserted._id
          }
        },
        {},
        err => {
          callback(err, inserted);
        }
      );
    }
  });
}

router.post("/api/data/patient/:patientId/crf/:crfId/full", (req, res) => {
  db.crf_data.count(
    {
      crfId: req.params.crfId,
      patientId: req.params.patientId
    },
    (err, count) => {
      const number = count + 1;
      const crfInfo = {
        crfId: req.params.crfId,
        patientId: req.params.patientId,
        createdAt: Date.now(),
        recordNumber: number
      };
      const errors = [];
      const insertedObjects = [];
      db.crf_data.insert(crfInfo, (err, inserted) => {
        if (err) {
          res.json({
            success: false,
            error: err,
            payload: null
          });
        } else {
          let remainCallbacks = Object.entries(req.body.data).length;
          for (const [name, item] of Object.entries(req.body.data)) {
            insertData(
              req.params.patientId,
              inserted._id,
              name,
              item.value,
              req.body.user,
              (err, inserted) => {
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
                    });
                  } else {
                    res.json({
                      success: true,
                      err: false,
                      payload: insertedObjects
                    });
                  }
                }
              }
            );
          }
        }
      });
    }
  );
});
const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

router.get("/api/data/patient/:patientId/crfs", (req, res) => {
  utils.getAllCRFs((err, crfs) => {
    if (err) {
      console.log("error", err);
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      const patientId = req.params.patientId;
      db.crf_data.find(
        {
          patientId: patientId
        },
        (err, docs) => {
          if (err) {
            console.log("error", err);
            res.json({
              success: false,
              error: err,
              payload: null
            });
          } else {
            docs.forEach(crfData => {
              crfData.newestCRF = crfs.find(
                elem => elem._id === crfData.crfId
              ).newestVersion;
            });

            res.json({
              success: true,
              error: false,
              payload: docs
            });
          }
        }
      );
    }
  });
});

router.get("/api/data/patient/:patientId/crf/:crfId/records", (req, res) => {
  const patientId = req.params.patientId;
  const crfId = req.params.crfId;

  db.crfs.findOne(
    {
      _id: crfId
    },
    (err, doc) => {
      if (err) {
        console.log("error", err);
        res.json({
          success: false,
          error: err,
          payload: null
        });
      } else {
        const versions = [];
        const crfIds = [crfId];
        let searchCrfId = null;
        if (doc.newestVersion === null) {
          searchCrfId = doc._id;
        } else {
          searchCrfId = doc.newestVersion;
        }
        // crfId is the newest version
        db.crfs.find(
          {
            newestVersion: searchCrfId
          },
          (err, oldCrfs) => {
            oldCrfs.forEach(oldCrf => {
              crfIds.push(oldCrf._id);
            });
            db.crf_data.find(
              {
                crfId: {
                  $in: crfIds
                }
              },
              (err, crfDataVersion) => {
                const resObj = [];
                crfDataVersion.forEach(elem => {
                  resObj.push({
                    date: elem.createdAt,
                    id: elem._id
                  });
                });
                res.json({
                  success: true,
                  error: false,
                  payload: resObj
                });
              }
            );
          }
        );
      }
    }
  );
});

// get newest
router.get("/api/data/patient/:patientId/crf/:crfId", (req, res) => {
  const patientId = req.params.patientId;
  const crfId = req.params.crfId;
  db.crf_data
    .find({
      patientId: patientId,
      crfId: crfId
    })
    .sort({ recordNumber: -1 })
    .exec((err, docs) => {
      if (err) {
        console.log("error", err);
        res.json({
          success: false,
          error: err,
          payload: null
        });
      } else {
        if (docs.length === 0) {
          // look for newest predecessor
          db.crfs.find(
            {
              newestVersion: req.params.crfId
            },
            (err, docs) => {
              if (err) {
                console.log("error", err);
                res.json({
                  success: false,
                  error: err,
                  payload: null
                });
              } else {
                db.crf_data
                  .find({
                    $where: function() {
                      return docs.some(e => e._id === this.crfId);
                    }
                  })
                  .sort({
                    createAt: -1
                  })
                  .exec((err, crfDataObj) => {
                    if (crfDataObj.length > 0) {
                      db.data.find(
                        {
                          crfId: crfDataObj[0]._id
                        },
                        (err, data) => {
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
                                crfId: crfDataObj[0].crfId,
                                crfDataId: crfDataObj[0]._id,
                                data: data
                              }
                            });
                          }
                        }
                      );
                    } else {
                      res.status(404).json({
                        success: false,
                        error: err,
                        payload: null
                      });
                    }
                  });
              }
            }
          );
        } else {
          db.data.find(
            {
              crfId: docs[0]._id
            },
            (err, data) => {
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
                    crfId: docs[0].crfId,
                    crfDataId: docs[0]._id,
                    data: data
                  }
                });
              }
            }
          );
        }
      }
    });
});

router.get("/api/data/patient/:patientId/crfData/:crfDataId", (req, res) => {
  db.crf_data.findOne(
    {
      _id: req.params.crfDataId
    },
    (err, doc) => {
      db.data.find(
        {
          crfId: doc._id,
          nextVersion: null
        },
        (err, data) => {
          if (err) {
            console.log("error", err);
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
        }
      );
    }
  );
});

router.get("/api/data/patient/:patientId/crf/:crfId/:number", (req, res) => {
  db.crf_data.findOne(
    {
      crfId: req.params.crfId,
      patientId: req.params.patientId,
      recordNumber: req.params.number
    },
    (err, doc) => {
      if (err) {
        console.log("error", err);
        res.json({
          success: false,
          error: err,
          payload: null
        });
      } else {
        if (doc) {
          db.data.find(
            {
              crfId: doc._id
            },
            (err, data) => {
              if (err) {
                console.log("error", err);
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
            }
          );
        } else {
          res.json({
            success: true,
            error: false,
            payload: {}
          });
        }
      }
    }
  );
});

router.put("/api/data/patient/:patientId/crf/:crfDataId/full", (req, res) => {
  db.crf_data.findOne(
    {
      _id: req.params.crfDataId
    },
    (err, doc) => {
      if (err || doc === null) {
        res.json({
          success: false,
          err: err,
          payload: null
        });
      } else {
        const errors = [];
        const insertedObjects = [];
        let remainCallbacks = Object.entries(req.body.data).length;
        for (const [name, item] of Object.entries(req.body.data)) {
          putData(
            item._id,
            req.params.patientId,
            doc._id,
            name,
            item.value,
            req.body.user,
            (err, inserted) => {
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
                  });
                } else {
                  res.json({
                    success: true,
                    err: false,
                    payload: insertedObjects
                  });
                }
              }
            }
          );
        }
      }
    }
  );
});

router.post("/api/data/patient/:patientId/crf/:crfId", (req, res) => {
  insertData(
    req.params.patientId,
    req.params.crfId,
    req.body.data.field,
    req.body.data.value,
    req.body.user,
    (err, inserted) => {
      if (err) {
        console.log("error", err);
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
    }
  );
});

router.put("/api/data/:dataId/", (req, res) => {
  db.data.findOne(
    {
      _id: req.params.dataId
    },
    (err, doc) => {
      if (err) {
        console.log("error", err);
        res.json({
          success: false,
          error: err,
          payload: null
        });
      } else {
        putData(
          req.params.dataId,
          doc.patientId,
          doc.crfId,
          req.body.data.field,
          req.body.data.value,
          req.body.user,
          (err, numReplaced) => {
            if (err) {
              console.log("error", err);
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
          }
        );
      }
    }
  );
});

module.exports = router;
