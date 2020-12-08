/** Express router providing patient related routes
 * @requires express
 */

const express = require("express");
const router = express.Router();

const db = require("./stores.js");
const utils = require("./utils.js");

/**
 * Creates a patient
 * @name /
 * @params None
 * @req.body None
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: inserted || null
 * }
 */
router.post("/", (req, res) => {
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
  });
});

/**
 * Returns all patients
 * @name /
 * @params None
 * @req.body None
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: patientObjectsArray || null
 * }
 */
router.get("/", (req, res) => {
  db.patients.find(
    {
      deleted: false
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
        res.json({
          success: true,
          error: false,
          payload: docs
        });
      }
    }
  );
});

/**
 * Returns all patients with CRFs
 * @name /full
 * @params None
 * @req.body None
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: {
 *         _id: patientId,
 *         field1: value1,
 *         ...
 *     } || null
 * }
 */
router.get("/full", (req, res) => {
  db.patients.find(
    {
      deleted: false
    },
    (err, patients) => {
      if (err) {
        console.log("error", err);
        res.status(500).json({
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
            if (patients.length >= 0) {
              res.json({
                success: true,
                error: false,
                payload: patients
              });
            } else {
              console.log("error", err);
              res.status(500).json({
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

/**
 * Returns the specified patient
 * @name /:patientId
 * @params patientId
 * @req.body None
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: patientObject || null
 * }
 */
router.get("/:patientId", (req, res) => {
  db.patients.findOne(
    {
      _id: req.params.patientId,
      deleted: false
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
        res.json({
          success: true,
          error: false,
          payload: doc
        });
      }
    }
  );
});

/**
 * Returns the specified patient including their CRFs
 * @name /:patientId/full
 * @params patientId
 * @req.body None
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: {
 *         field1: {
 *             _id: dataId,
 *             value: value1
 *         },
 *         ...
 *     } || null
 * }
 */
router.get("/:patientId/full", (req, res) => {
  utils.getPatientCRFForPatientId(req.params.patientId, true, (err, data) => {
    if (err) {
      console.log("error", err);
      res.status(404).json({
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

/**
 * Deletes the specified patient
 * @name /:patientId
 * @params patientId
 * @req.body None
 * @return {
 *     success: true || false,
 *     error: false || err,
 *     payload: {
 *         deleted: patientId
 *     } || null
 * }
 */
router.delete("/:patientId", (req, res) => {
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
    err => {
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
            deleted: req.params.patientId
          }
        });
      }
    }
  );
});

module.exports = router;
