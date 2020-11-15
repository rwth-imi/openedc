const express = require("express");
const router = express.Router();

const db = require("./stores.js");
const utils = require("./utils.js");

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
    (err, patients) => {
      if (err) {
        console.log("error", err);
        res.json({
          success: false,
          error: err,
          payload: null
        });
      } else {
        const promises = [];
        patients.forEach(patient => {
          const promise = new Promise((resolve, reject) => {
            utils.getPatientCRFForPatientId(patient._id, false, (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  _id: patient._id,
                  ...data
                });
              }
            });
          });
          promises.push(promise);
        });
        Promise.all(promises)
          .then(values => {
            res.json({
              success: true,
              error: false,
              payload: values
            });
          })
          .catch(err => {
            if(patients.length >= 0) {
              res.json({
                success: true,
                error: false,
                payload: patients
              });
            } else {
              console.log("error", err);
              res.json({
                success: false,
                error: err,
                payload: null
              });
            }
          });
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

router.get("/api/patient/:patientId/full", (req, res, next) => {
  utils.getPatientCRFForPatientId(req.params.patientId, true, (err, data) => {
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
        payload: data
      });
    }
  });
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
