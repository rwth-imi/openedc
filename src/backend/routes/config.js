const express = require("express");
const router = express.Router();

const db = require("./stores.js");

router.get("/", (req, res) => {
  db.config.findOne(
    {
      nextVersion: null
    },
    (err, config) => {
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
          payload: config
        });
      }
    }
  );
});

router.post("/", (req, res) => {
  const config = {
    createdAt: Date.now(),
    createdBy: req.body.user || "defaultUser",
    nextVersion: null,
    ...req.body.config
  };
  db.config.insert(config, (err, inserted) => {
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
        payload: config
      });
    }
  });
});

router.put("/:configId", (req, res) => {
  const config = {
    createdAt: Date.now(),
    createdBy: req.body.user || "defaultUser",
    nextVersion: null,
    ...req.body.config
  };
  delete config._id;
  db.config.insert(config, (err, inserted) => {
    if (err) {
      console.log("error", err);
      res.status(500).json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      db.config.update(
        {
          _id: req.params.configId
        },
        {
          $set: {
            nextVersion: inserted._id
          }
        },
        (err, updated) => {
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
    }
  });
});
module.exports = router;
