const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./stores.js");
const utils = require("./utils.js");

// directory where the uploaded raw files are saved
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

/**
 * Updates newestVersion field in forms store
 * @param id formsId
 * @param newestId Id of the newest version
 * @param errorCB Callback in case of error
 * @param successCB Callback in case of success
 * @param del true, if the form is deleted, false if not.
 */
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

/**
 * Inserts a new entry in forms store and crf store
 * @param crf json format of crf
 * @param user
 * @param errorCB callback in case of error
 * @param successCB callback in case of success
 */
function saveNewCRF(crf, user, errorCB, successCB) {
  if (!crf.version) {
    crf.version = 1;
  }
  crf.createdAt = Date.now();
  crf.createdBy = user || "defaultUser"; // TODO: user management

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

/**
 * Inserts a new entry in crf store and updates the forms store entry
 * @param formsId Id of entry of forms store
 * @param crf json format of CRF
 * @param user
 * @param errorCB callback in case of error
 * @param successCB callback in case of success
 * @param del true, if the crf should be deleted, false if not
 */
function saveEditCRF(formsId, crf, user, errorCB, successCB, del = false) {
  crf.createdAt = Date.now();
  crf.createdBy = user || "defaultUser"; // TODO: user management
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
        if (!crf.version || version > crf.version) crf.version = version; //Todo: Warning that wrong version
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

/**
 * Returns a log object
 * @param type Warning, Error or Info, etc
 * @param msg Message of the log entry
 * @returns {{msg: *, type: *}}
 */
function log(type, msg) {
  return {
    type: type,
    msg: msg
  };
}

/**
 * This function parses the content of the JSON format file.
 * TODO: At the moment it only converts it to json, but do not verify it.
 * @param fileContent
 * @returns {{crfs: [any], log: [{msg: *, type: *}], withoutError: boolean}}
 */
function JSONParser(fileContent) {
  const jsonObject = JSON.parse(fileContent);
  // TODO: Verify!
  return {
    crfs: [jsonObject],
    log: [log("warning", "Verification not done!"), log("info", "Verifed!")],
    withoutError: true
  };
}

/**
 * Temporary function to indicate that a parser is not implemented
 * @returns {{crfs: [], log: [{msg: *, type: *}], withoutError: boolean}}
 * @constructor
 */
function NotImplementedParser() {
  return {
    crfs: [],
    log: [log("error", "Format not implemented!")],
    withoutError: false
  };
}

/**
 * This function starts the parsing process and determines which parser should be used
 * @param fileContent content of the uploaded file
 * @param format format of the uploaded file (JSON, Excel, RedCap, OpenClinica)
 * @returns {{crfs: *[], log: {msg: *, type: *}[], withoutError: boolean}}
 */
function parseAndVerify(fileContent, format) {
  switch (format) {
    case "JSON":
      return JSONParser(fileContent);
    case "Excel":
    case "RedCap":
    case "OpenClinica":
    default:
      // TODO: Parse and Verify!
      return NotImplementedParser();
  }
}

/**
 * Uploads and checks a file
 * @name /upload/check
 * @params None
 * @req.body format, file, filename
 * @return {
 *      success: true,
 *      error: false,
 *      payload: {
 *        crfs: crfs,
 *        log: log,
 *        saveAllowed: withoutError
 *      }
 *    }
 */
router.post("/upload/check", upload.single("file"), (req, res) => {
  const absolutePath = path.join(path.resolve("./"), req.file.path);
  const fileContent = fs.readFileSync(absolutePath, "utf-8");
  const format = req.body.format;

  // TODO: Parsing and verifying test
  const { crfs, log, withoutError } = parseAndVerify(fileContent, format);

  if (withoutError) {
    res.json({
      success: true,
      error: false,
      payload: {
        crfs: crfs,
        log: log,
        saveAllowed: withoutError
      }
    });
  } else {
    res.json({
      success: false,
      error: "Error while verifying",
      payload: {
        crfs: crfs,
        log: log,
        saveAllowed: withoutError
      }
    });
  }
});

/**
 * Creates a CRF by inserting a new entry in forms store and crf store
 * @name /
 * @params None
 * @req.body crf
 * @return {
 *      success: true,
 *      error: false,
 *      payload: insertedCRF
 *    }
 */
router.post("/", (req, res) => {
  if (!req.body.crf.version) {
    req.body.crf.version = 1;
  }
  saveNewCRF(
    req.body.crf,
    req.body.user || "defaultUser",
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

/**
 * Updates a CRF by inserting a new entry in crf store and updating entry in forms store
 * @name /:formsId
 * @params formsId
 * @req.body crf
 * @return {
 *      success: true,
 *      error: false,
 *      payload: insertedCRF
 *    }
 */
router.put("/:formsId", (req, res) => {
  saveEditCRF(
    req.params.formsId,
    req.body.crf,
    req.body.user || "defaultUser",
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

/**
 * Returns all current CRFs with their newest version. If query patient is true,
 * the patient CRF is also returned, otherwise only none patient CRFs.
 * @name /
 * @params None
 * @query patient:boolean
 * @req.body None
 * @return {
 *      success: true,
 *      error: false,
 *      payload: [crfObject]
 *    }
 */
router.get("/", (req, res) => {
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
  }, req.query.patient);
});

/**
 * Returns the newest patient CRF
 * @name /patient
 * @params None
 * @query None
 * @req.body None
 * @return {
 *      success: true,
 *      error: false,
 *      payload: crfObject
 *    }
 */
router.get("/patient", (req, res) => {
  utils.getPatientCRF((err, doc) => {
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
        payload: doc
      });
    }
  });
});

/**
 * Returns CRF with the specified ID.
 * @name /:crfId
 * @params crfId
 * @query None
 * @req.body None
 * @return {
 *      success: true,
 *      error: false,
 *      payload: crfObject
 *    }
 */
router.get("/:crfId", (req, res) => {
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

/**
 * Returns the newest CRF of the same line as the specified crfId
 * @name /:crfId/newest
 * @params crfId
 * @query None
 * @req.body None
 * @return {
 *      success: true,
 *      error: false,
 *      payload: crfObject
 *    }
 */
router.get("/:crfId/newest", (req, res) => {
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

/**
 * Returns the specified version of formId
 * @name /:formsId/:version
 * @params formsId, version
 * @query None
 * @req.body None
 * @return {
 *      success: true,
 *      error: false,
 *      payload: crfObject
 *    }
 */
router.get("/:formsId/:version", (req, res) => {
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

/**
 * Deletes the specified form
 * @name /:formsId
 * @params formsId
 * @query None
 * @req.body None
 * @return {
 *      success: true,
 *      error: false,
 *      payload: null
 *    }
 */
router.delete("/:formsId/", (req, res) => {
  const deleteItem = {
    crf: {},
    createdAt: Date.now(),
    createdBy: req.body.user || "defaultUser", // TODO: user management
    deleted: true
  };
  saveEditCRF(
    req.params.formsId,
    deleteItem,
    req.body.user || "defaultUser",
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
