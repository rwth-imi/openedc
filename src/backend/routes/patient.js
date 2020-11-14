const express = require("express");
const router = express.Router();

const db = require("./stores.js");

router.post("/api/patient/", (req, res, next) => {
  const patient = {
    deleted: false,
    createdAt: Date.now(),
    createdBy: req.body.user || "defaultUser",
    deletedAt: null,
    deletedBy: null
  };
  db.patients.insert(patient, (err, inserted) => {
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
  });
});

router.get("/api/patient/", (req, res, next) => {
  db.patients.find(
    {
      deleted: false
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
        res.json({
          success: true,
          error: false,
          payload: docs
        });
      }
    }
  );
});

router.get("/api/patient/full", (req, res, next) => {
  db.patients.find(
    {
      deleted: false
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
        const patientIds = [];
        docs.forEach(pat => {
          patientIds.push(pat._id);
        });
        db.crfs.findOne(
          {
            name: "Patient"
          },
          (err, patientCRF) => {
            if (err || patientCRF === null) {
              console.log("error", err);
              res.status(404).json({
                success: false,
                error: err,
                payload: {
                  message: "Patient CRF not found"
                }
              });
            } else {
              db.crfRecord.find(
                {
                  patientId: {
                    $in: patientIds
                  },
                  crfId: patientCRF._id
                },
                (err, records) => {
                  if (err) {
                    console.log("error", err);
                    res.json({
                      success: false,
                      error: err,
                      payload: null
                    });
                  } else {
                    const recordIds = [];
                    records.forEach(record => {
                      recordIds.push(record._id);
                    });
                    db.data.find(
                      {
                        recordId: {
                          $in: recordIds
                        },
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
                          const patientData = [];
                          data.forEach(entry => {
                            const elem = patientData.find(
                              elem => elem._id === entry.patientId
                            );
                            if (elem) {
                              elem.data.push(entry);
                            } else {
                              patientData.push({
                                _id: entry.patientId,
                                data: [entry]
                              });
                            }
                          });
                          const formatted = patientData.map(elem => {
                            const ret = {};
                            elem.data.forEach(item => {
                              ret[item.field] = item.value;
                            });
                            ret._id = elem._id;
                            return ret;
                          });
                          res.json({
                            success: true,
                            error: false,
                            payload: formatted
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.get("/api/patient/:patientId", (req, res, next) => {
  db.patients.findOne(
    {
      _id: req.params.patientId,
      deleted: false
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
        res.json({
          success: true,
          error: false,
          payload: doc
        });
      }
    }
  );
});

router.delete("/api/patient/:patientId", (req, res, next) => {
  db.patients.update(
    {
      _id: req.params.patientId
    },
    {
      $set: {
        deleted: true,
        deletedAt: Date.now(),
        deletedBy: req.body.user || "defaultUser"
      }
    },
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
          payload: {
            deleted: req.params.patientId
          }
        });
      }
    }
  );
});

module.exports = router;
