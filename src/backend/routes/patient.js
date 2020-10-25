const express = require('express');
const router = express.Router();

const db = require('./stores.js');

router.post('/api/patient/', (req, res, next) => {
  db.patients.insert(req.body.patient, (err, inserted) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      if (!req.body.patient.patientId) {
         db.patients.update({
           "_id": inserted._id
         }, {
           $set: { patientId: inserted._id}
         }, {
           multi: false,
           returnUpdatedDocs: true
         }, function(err, numReplaced, affectedDocuments) {
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
              payload: affectedDocuments
            });
          }
        });
      } else {
        res.json({
          success: true,
          error: false,
          payload: inserted
        });
      }
    }
  })
})

router.put('/api/patient/:patientId', (req, res, next) => {
  db.patients.update({
    "patientId": req.params.patientId
  }, req.body.patient, {}, function(err, numReplaced) {
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
        payload: req.body.patient
      });
    }
  });
})

router.get('/api/patient/', (req, res, next) => {
  db.patients.find({}, (err, docs) => {
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

router.get('/api/patient/:patientId', (req, res, next) => {
  db.patients.findOne({
    "patientId": req.params.patientId
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



module.exports = router;
