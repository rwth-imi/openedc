const express = require("express");
const router = express.Router();

const db = require("./stores.js");
const utils = require("./utils.js");

function insertData(patientId, recordId, field, value, user, callback) {
  const data = {
    patientId: patientId,
    recordId: recordId,
    field: field,
    value: value,
    nextVersion: null,
    createdAt: Date.now(),
    createdBy: user || "defaultUser" // TODO: user management
  };
  db.data.insert(data, callback);
}

function putData(dataId, patientId, recordId, field, value, user, callback) {
  const data = {
    patientId: patientId,
    recordId: recordId,
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
  db.crfRecord.count(
    {
      crfId: req.params.crfId,
      patientId: req.params.patientId
    },
    (err, count) => {
      const number = count + 1;
      const crfInfo = {
        formsId: req.body.formsId,
        crfId: req.params.crfId,
        patientId: req.params.patientId,
        createdAt: Date.now(),
        recordNumber: number
      };
      const errors = [];
      const insertedObjects = [];
      db.crfRecord.insert(crfInfo, (err, inserted) => {
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
      db.crfRecord.find(
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
            // get for all patient crfs the newest Version
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

        const searchCrfId = doc.formsId;
        const crfIds = [searchCrfId];
        // crfId is the newest version
        db.crfs.find(
          {
            formsId: searchCrfId
          },
          (err, oldCrfs) => {
            oldCrfs.forEach(oldCrf => {
              crfIds.push(oldCrf._id);
            });
            db.crfRecord.find(
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
                    id: elem._id,
                    crfId: elem.crfId
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
  db.crfs.findOne(
    {
      _id: req.params.crfId
    },
    (err, crf) => {
      if (err) {
        console.log("error", err);
        res.json({
          success: false,
          error: err,
          payload: null
        });
      } else {
        db.crfRecord
          .find({
            patientId: patientId,
            formsId: crf.formsId
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
                res.status(404).json({
                  success: false,
                  error: "No record found",
                  payload: null
                });
              } else {
                db.data.find(
                  {
                    recordId: docs[0]._id
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
                          crfRecordId: docs[0]._id,
                          data: data
                        }
                      });
                    }
                  }
                );
              }
            }
          });
      }
    }
  );
});

router.get("/api/data/patient/:patientId/crfData/:crfRecordId", (req, res) => {
  db.crfRecord.findOne(
    {
      _id: req.params.crfRecordId
    },
    (err, doc) => {
      db.data.find(
        {
          recordId: doc._id,
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

router.put("/api/data/patient/:patientId/crf/:crfRecordId/full", (req, res) => {
  db.crfRecord.findOne(
    {
      _id: req.params.crfRecordId
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

router.post("/api/data/patient/:patientId/crf/:recordId", (req, res) => {
  insertData(
    req.params.patientId,
    req.params.recordId,
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
          doc.recordId,
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
