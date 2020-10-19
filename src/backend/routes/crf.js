const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// File Upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, req.body.filename)
  }
})
const upload = multer({
  storage: storage
});

// NeDB
const Datastore = require('nedb');
const db = {};
db.crfs = new Datastore({
  filename: 'db/crfs.db',
  autoload: true
});

router.post("/api/crf/upload/", upload.single("file"), (req, res, next) => {
  const absolutePath = path.join(path.resolve("./"), req.file.path);
  const jsonString = fs.readFileSync(absolutePath, "utf-8");
  const jsonObject = JSON.parse(jsonString);

  // Todo: Parsing! From Excel to json

  if(!jsonObject.version) {
    jsonObject.version = 1;
  }
  jsonObject.createdAt = Date.now()

  db.crfs.insert(jsonObject, function(err, inserted) {
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
});

router.post('/api/crf/', (req, res, next) => {
  if(!req.body.crf.version) {
    req.body.crf.version = 1;
  }
  db.crfs.insert(req.body.crf, (err, inserted) => {
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

router.put('/api/crf/:crfId', (req, res, next) => {
  db.crfs.find({"_id": req.params.crfId}).sort({version: 1}).exec((err, docs) => {
    req.body.crf.version = docs[0].version + 1;
    db.crfs.insert(req.body.crf, (err, inserted) => {
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
})

router.get('/api/crf/', (req, res, next) => {
  db.crfs.find({}, (err, docs) => {
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

router.get('/api/crf/:crfId', (req, res, next) => {
  db.crfs.find({
    "_id": req.params.crfId
  }).sort({ version: 1}).exec((err, docs) => {
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
        payload: docs[0]
      });
    }
  })
})

router.get('/api/crf/:crfId/:version', (req, res, next) => {
  db.crfs.find({
    "_id": req.params.crfId,
    "version": req.params.version
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

router.delete('/api/crf/:crfId/:version', (req, res, next) => {
  db.crfs.remove({
    "_id": req.params.crfId,
    "version": req.params.version
  }, {}, (err, numRemoved) => {
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
        payload: numRemoved
      });
    }
  })
})

router.delete('/api/crf/:crfId/', (req, res, next) => {
  db.crfs.remove({
    "_id": req.params.crfId
  }, { multi: true}, (err, numRemoved) => {
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
        payload: numRemoved
      });
    }
  })
})


module.exports = router;
