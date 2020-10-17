const express = require('express');
const router = express.Router();

// NeDB
const Datastore = require('nedb');
const db = {};
db.patients = new Datastore({
  filename: 'db/patients.db',
  autoload: true
});

router.post('/api/patient/', (req, res, next) => {
  console.log(req, req.patient)
  db.patients.insert(req.body.patient, (err, inserted) => {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      if (!req.boy.patient.patientId) {
        db.patients.update({
          "_id": inserted._id
        }, {
          "patientId": insterted._id
        }, {}, function(err, numReplaced) {
          if (err) {
            console.log('error', err)
            res.json({
              success: false,
              error: err,
              payload: null
            });
          } else {
            inserted.patientId = inserted._id;
            res.json({
              success: true,
              error: false,
              payload: inserted
            });
          }
        });
      }
      res.json({
        success: true,
        error: false,
        payload: inserted
      });
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
        payload: req.patient
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
  db.patients.find({
    "patientId": req.params.patientId
  }, (err, docs) => {
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



module.exports = router;
