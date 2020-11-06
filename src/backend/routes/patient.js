const express = require("express");
const router = express.Router();

const db = require("./stores.js");

router.post("/api/patient/", (req, res, next) => {
  req.body.patient.deleted = false;
  req.body.patient.createdAt = Date.now();
  req.body.patient.createdBy = req.body.user || "defaultUser";
  req.body.patient.nextVersion = null;
  db.patients.insert(req.body.patient, (err, inserted) => {
    if (err) {
      console.log("error", err);
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      if (!req.body.patient.patientId) {
        db.patients.update(
          {
            _id: inserted._id
          },
          {
            $set: { patientId: inserted._id }
          },
          {
            multi: false,
            returnUpdatedDocs: true
          },
          function(err, numReplaced, affectedDocuments) {
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
                payload: affectedDocuments
              });
            }
          }
        );
      } else {
        res.json({
          success: true,
          error: false,
          payload: inserted
        });
      }
    }
  });
});

router.put("/api/patient/:patient_id", (req, res, next) => {
  req.body.patient.deleted = false;
  req.body.patient.createdAt = Date.now();
  req.body.patient.createdBy = req.body.user || "defaultUser";
  delete req.body.patient._id;
  db.patients.insert(req.body.patient, (err, inserted) => {
    if (err) {
      console.log("error", err);
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      db.patients.update(
        {
          _id: req.params.patient_id,
          nextVersion: null
        },
        {
          $set: {
            nextVersion: inserted._id
          }
        },
        {},
        (err, numReplaced) => {
          if (err) {
            // todo eventuell nextVersion nochmal testen, ob das die nextversion=0 ist.
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
    }
  });
});

router.get("/api/patient/", (req, res, next) => {
  db.patients.find(
    {
      deleted: false,
      nextVersion: null
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

router.get("/api/patient/:patientId", (req, res, next) => {
  db.patients.findOne(
    {
      patientId: req.params.patientId,
      deleted: false,
      nextVersion: null
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
  db.patients.insert(
    {
      patient_id: req.params.patientId,
      deleted: true,
      createdAt: Date.now(),
      createdBy: req.body.user || "defaultUser" // Todo: user management
    },
    (err, doc) => {
      db.patients.update(
        {
          patientId: req.params.patientId,
          nextVersion: null
        },
        {
          $set: {
            deleted: true,
            nextVersion: doc._id
          }
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
              payload: {
                deleted: req.params.patientId
              }
            });
          }
        }
      );
    }
  );
});

module.exports = router;
