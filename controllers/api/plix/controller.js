/////////////////////////////////////////////////////
// PLIX API CONTROLLER
/////////////////////////////////////////////////////

// model
const Plix = require('../../../models/plix');

// set up the controller
const controller = {};


// to update a plix
controller.update = (req, res) => {
  // get id and description
  const updateData = {
      id: req.params.id,
      description: req.body.description
    }
    // get promise to edit
  Plix
    .edit(updateData.description, updateData.id)
    .then(data => {
      res.json({
        // send back data
        plix: data
      });
    })
    .catch(err => {
      console.log('ERROR UPDATING PLIX', err);
      // send back error
      res.send('Error updating plix.');
    });
}

// to delete a plix
controller.delete = (req, res) => {
  // get promise to delete
  Plix
    .delete(req.params.id)
    .then(() => {
      // send back message
      res.send('plix deleted');
    })
    .catch(err => {
      console.log(err);
      // send back error
      res.send('error deleting plix');
    });
}

// export
module.exports = controller;