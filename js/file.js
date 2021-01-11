const express = require('express')
const router = express.Router();
const auth = require('./auth.js');
const dirTree = require('directory-tree');


//----------directory of background images ----------
router.get('/app/file/dir', auth.verifyToken, async function(req, res, next){

let tree = dirTree('./public/images/background');

  try {

    res.status(200).json(tree);
  }
  catch(err) {
    res.status(500).json({error: err});
  }

});


module.exports = router;
