const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./stores.js");
const utils = require("./utils.js");

const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// File Upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, req.body.filename);
  }
});
const upload = multer({
  storage: storage
});

function setNewestVersion(id, newestId, errorCB, successCB, del = false) {
  db.forms.update(
    {
      _id: id
    },
    {
      $set: {
        newestVersion: newestId,
        deleted: del
      }
    },
    {},
    (err, num) => {
      if (err) {
        errorCB(err);
      } else {
        successCB(num);
      }
    }
  );
}

function saveNewCRF(crf, errorCB, successCB) {
  if (!crf.version) {
    crf.version = 1;
  }

  db.forms.insert(
    {
      newestVersion: null,
      deleted: false
    },
    function(err, formsObj) {
      if (err) {
        console.log("error", err);
        errorCB(err);
      } else {
        crf.formsId = formsObj._id;
        db.crfs.insert(crf, function(err, inserted) {
          if (err) {
            console.log("error", err);
            errorCB(err);
          } else {
            setNewestVersion(formsObj._id, inserted._id, errorCB, function() {
              successCB(inserted);
            });
          }
        });
      }
    }
  );
}

function saveEditCRF(formsId, crf, errorCB, successCB, del = false) {
  db.crfs.count(
    {
      formsId: formsId
    },
    (err, count) => {
      if (err) {
        console.log("error", err);
        errorCB(err);
      } else {
        const version = count + 1;
        if (!crf.version || version < crf.version) crf.version = version; //Todo: Warning that wrong version
        crf.formsId = formsId;
        db.crfs.insert(crf, function(err, inserted) {
          if (err) {
            console.log("error", err);
            errorCB(err);
          } else {
            setNewestVersion(
              formsId,
              inserted._id,
              errorCB,
              function() {
                successCB(inserted);
              },
              del
            );
          }
        });
      }
    }
  );
}

router.post("/api/crf/upload/", upload.single("file"), (req, res, next) => {
  const absolutePath = path.join(path.resolve("./"), req.file.path);
  const jsonString = fs.readFileSync(absolutePath, "utf-8");
  const jsonObject = JSON.parse(jsonString);

  // Todo: Parsing! From Excel to json
  jsonObject.createdAt = Date.now();
  jsonObject.createdBy = req.body.user || "defaultUser"; // TODO: user management

  saveNewCRF(
    jsonObject,
    err => {
      res.json({
        success: false,
        error: err,
        payload: null
      });
    },
    payload => {
      res.json({
        success: true,
        error: false,
        payload: payload
      });
    }
  );
});

router.post(
  "/api/crf/edit/:formsId",
  upload.single("file"),
  (req, res, next) => {
    const absolutePath = path.join(path.resolve("./"), req.file.path);
    const jsonString = fs.readFileSync(absolutePath, "utf-8");
    const jsonObject = JSON.parse(jsonString);

    // Todo: Parsing! From Excel to json

    jsonObject.createdAt = Date.now();
    jsonObject.createdBy = req.body.user || "defaultUser"; // TODO: user management

    saveEditCRF(
      req.params.formsId,
      jsonObject,
      err => {
        res.json({
          success: false,
          error: err,
          payload: null
        });
      },
      payload => {
        res.json({
          success: true,
          error: false,
          payload: payload
        });
      }
    );
  }
);

router.post("/api/crf/", (req, res, next) => {
  if (!req.body.crf.version) {
    req.body.crf.version = 1;
  }
  saveNewCRF(
    req.body.crf,
    err => {
      res.json({
        success: false,
        error: err,
        payload: null
      });
    },
    payload => {
      res.json({
        success: true,
        error: false,
        payload: payload
      });
    }
  );
});

router.put("/api/crf/:formsId", (req, res, next) => {
  saveEditCRF(
    req.params.formsId,
    req.body.crf,
    err => {
      res.json({
        success: false,
        error: err,
        payload: null
      });
    },
    payload => {
      res.json({
        success: true,
        error: false,
        payload: payload
      });
    }
  );
});

router.get("/api/crf/", (req, res, next) => {
  utils.getAllNewestCRFs((err, docs) => {
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
  });
});

router.get("/api/crf/:crfId", (req, res, next) => {
  db.crfs.findOne(
    {
      _id: req.params.crfId
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

router.get("/api/crf/:crfId/newest", (req, res, next) => {
  db.crfs.findOne(
    {
      _id: req.params.crfId
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
        db.forms.findOne(
          {
            _id: doc.formsId
          },
          (err, formObj) => {
            if (err) {
              console.log("error", err);
              res.json({
                success: false,
                error: err,
                payload: null
              });
            } else {
              db.crfs.findOne(
                {
                  _id: formObj.newestVersion
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
                    res.json({
                      success: true,
                      error: false,
                      payload: crf
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
});

router.get("/api/crf/:formsId/:version", (req, res, next) => {
  db.crfs.findOne(
    {
      formsId: req.params.formsId,
      version: req.params.version
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

router.delete("/api/crf/:formsId/", (req, res, next) => {
  const deleteItem = {
    crf: {},
    createdAt: Date.now(),
    createdBy: req.body.user || "defaultUser", // TODO: user management
    deleted: true
  };
  saveEditCRF(
    req.params.formsId,
    deleteItem,
    err => {
      console.log("error", err);
      res.json({
        success: false,
        error: err,
        payload: null
      });
    },
    () => {
      res.json({
        success: true,
        error: false,
        payload: null
      });
    },
    true
  );
});

module.exports = router;
