/** Express router providing CRF Data related routes
 * @requires express
 */

const express = require("express");
const router = express.Router();

const db = require("./stores.js");
const utils = require("./utils.js");

/**
 * Inserts a data into data store
 * @param patientId Id of the corresponding patient
 * @param recordId Id of the corresponding record
 * @param field Name of the field
 * @param value
 * @param user ID/Name of the user which sent the request
 * @param callback(err, result) will be called when the result is ready.
 */
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

/**
 * Updates a specific data field. It does not really update it, but insert
 * a new entry and references the new entry in the old one.
 * @param dataId Id of the data field
 * @param patientId Id of the corresponding patient
 * @param recordId Id of the corresponding record
 * @param field Name of the field
 * @param value
 * @param user ID/Name of the user which sent the request
 * @param callback(err, result) will be called when the result is ready.
 */
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

/**
 * Creates a new record.
 * @param patientId Id of the corresponding patient
 * @param crfId Id of the used CRF
 * @param formsId Id of the form of the used CRF
 * @param user ID/Name of the user which sent the request
 * @param data All data fields
 * @param callback(err, result) will be called when the result is ready.
 */
function saveNewRecord(patientId, crfId, formsId, user, data, callback) {
  db.crfRecord.count(
    {
      formsId: formsId,
      patientId: patientId
    },
    (err, count) => {
      const number = count + 1;
      const crfInfo = {
        formsId: formsId,
        crfId: crfId,
        patientId: patientId,
        createdAt: Date.now(),
        createdBy: user || "defaultUser",
        recordNumber: number
      };
      const errors = [];
      const insertedObjects = [];
      db.crfRecord.insert(crfInfo, (err, inserted) => {
        if (err) {
          callback(err, null);
        } else {
          let remainCallbacks = Object.entries(data).length;
          for (const [name, item] of Object.entries(data)) {
            insertData(
              patientId,
              inserted._id,
              name,
              item.value,
              user,
              (err, inserted) => {
                if (err) {
                  errors.push(err);
                } else {
                  insertedObjects.push(inserted);
                }
                remainCallbacks--;
                if (remainCallbacks <= 0) {
                  if (errors.length > 0) {
                    callback(errors, null);
                  } else {
                    callback(false, insertedObjects);
                  }
                }
              }
            );
          }
        }
      });
    }
  );
}

/**
 * Creates a new record with all data.
 * @name /patient/:patientId/crf/:crfId/full
 * @params patientId, crfId
 * @req.body formsId, data
 */
router.post("/patient/:patientId/crf/:crfId/full", (req, res) => {
  saveNewRecord(
    req.params.patientId,
    req.params.crfId,
    req.body.formsId,
    req.body.user || "defaultUser",
    req.body.data,
    (err, success) => {
      if (err) {
        res.status(500).json({
          success: false,
          err: err,
          payload: null
        });
      } else {
        res.json({
          success: true,
          err: false,
          payload: success
        });
      }
    }
  );
});

/**
 * Returns the data of all crfs of the patient.
 * @name /patient/:patientId/crfs
 * @params patientId
 * @req.body None
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: [crfRecordObject (additional newestVersionId)] || null
 * }
 */
router.get("/patient/:patientId/crfs", (req, res) => {
  utils.getAllCRFs((err, crfs) => {
    if (err) {
      console.log("error", err);
      res.status(500).json({
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
            res.status(500).json({
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

/**
 * Returns all records of a crf of a patient
 * @name /patient/:patientId/crf/:crfId/records
 * @params patientId, crfId (can be any version but not formsId)
 * @req.body None
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: {
 *         date: createdAt,
 *         id: _id,
 *         crfId: crfId
 *     } || null
 * }
 */
router.get("/patient/:patientId/crf/:crfId/records", (req, res) => {
  const patientId = req.params.patientId;
  const crfId = req.params.crfId;
  db.crfs.findOne(
    {
      _id: crfId
    },
    (err, doc) => {
      if (err) {
        console.log("error", err);
        res.status(500).json({
          success: false,
          error: err,
          payload: null
        });
      } else {
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
                },
                patientId: patientId
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

/**
 * Returns the data of the newest record
 * @name /patient/:patientId/crf/:crfId
 * @params patientId, crfId (can be any version but not formsId)
 * @req.body None
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: {
 *         crfId: crfId,
 *         crfRecordId: _id,
 *         data: data
 *     } || null
 * }
 */
router.get("/patient/:patientId/crf/:crfId", (req, res) => {
  const patientId = req.params.patientId;
  db.crfs.findOne(
    {
      _id: req.params.crfId
    },
    (err, crf) => {
      if (err) {
        console.log("error", err);
        res.status(500).json({
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
              res.status(500).json({
                success: false,
                error: err,
                payload: null
              });
            } else {
              if (docs.length === 0) {
                res.json({
                  success: true,
                  error: false,
                  payload: null
                });
              } else {
                db.data.find(
                  {
                    recordId: docs[0]._id
                  },
                  (err, data) => {
                    if (err) {
                      res.status(500).json({
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

/**
 * Returns the data of record
 * @name /patient/:patientId/crfData/:crfRecordId
 * @params patientId, crfRecordId
 * @req.body None
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: {
 *         crfId: doc.crfId,
 *         data: data
 *     } || null
 * }
 */
router.get("/patient/:patientId/crfData/:crfRecordId", (req, res) => {
  db.crfRecord.findOne(
    {
      _id: req.params.crfRecordId
    },
    (err, doc) => {
      if (err) {
        console.log("error", err);
        res.status(500).json({
          success: false,
          error: err,
          payload: null
        });
      } else if(doc === null){
        console.log("error", err);
        res.status(404).json({
          success: false,
          error: err || "CRF record not found",
          payload: null
        });
      } else {
        db.data.find(
          {
            recordId: doc._id,
            nextVersion: null
          },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.status(500).json({
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
    }
  );
});

/**
 * Updates all data of one record by inserting new data entry and referencing the new entry in the old ones.
 * @name /patient/:patientId/crf/:crfRecordId/full
 * @params patientId, crfRecordId
 * @req.body formsId, data, migrate (if a newer version of crf exists update to new one by doing a copy)
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: insertedDataObjects || null
 * }
 */
router.put("/patient/:patientId/crf/:crfRecordId/full", (req, res) => {
  db.crfRecord.findOne(
    {
      _id: req.params.crfRecordId
    },
    (err, doc) => {
      if (err) {
        console.log("error", err);
        res.status(500).json({
          success: false,
          error: err,
          payload: null
        });
      } else if(doc === null){
        console.log("error", err);
        res.status(404).json({
          success: false,
          error: "CRF record not found",
          payload: null
        });
      } else {
        db.forms.findOne(
          {
            _id: req.body.formsId
          },
          (err, form) => {
            if (form.newestVersion !== doc.crfId && req.body.migrate) {
              saveNewRecord(
                req.params.patientId,
                form.newestVersion,
                form._id,
                req.body.user || "defaultUser",
                req.body.data,
                (err, success) => {
                  if (err) {
                    res.status(500).json({
                      success: false,
                      err: err,
                      payload: null
                    });
                  } else {
                    res.json({
                      success: true,
                      err: false,
                      payload: success
                    });
                  }
                }
              );
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
                        res.status(500).json({
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
      }
    }
  );
});

/**
 * Inserts on e data entry
 * @name /patient/:patientId/crf/:recordId
 * @params patientId, crfRecordId
 * @req.body data
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: insertedDataObject || null
 * }
 */
router.post("/patient/:patientId/crf/:recordId", (req, res) => {
  insertData(
    req.params.patientId,
    req.params.recordId,
    req.body.data.field,
    req.body.data.value,
    req.body.user,
    (err, inserted) => {
      if (err) {
        console.log("error", err);
        res.status(500).json({
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

/**
 * Updates one data entry by inserting new data entry and referencing the new entry in the old one.
 * @name /:dataId
 * @params dataId
 * @req.body data
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: numReplaced || null
 * }
 */
router.put("/:dataId/", (req, res) => {
  db.data.findOne(
    {
      _id: req.params.dataId
    },
    (err, doc) => {
      if (err) {
        console.log("error", err);
        res.status(500).json({
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
              res.status(500).json({
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
