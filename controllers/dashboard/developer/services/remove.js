const db = require('lib/db');

/*
	DELETE api/dashboard/developer/services/:id
	RETURN
		{ error: bool, message: string }
	DESCRIPTION
		Deletes service from services table
		Deletes all rows in linked_services where id matches
*/
module.exports = function(req, res) {
  db(cn => {
    let sql = 'DELETE FROM services WHERE owner = ? AND id = ?';
    cn.query(sql, [req.session.uid, req.params.id], (err, result) => {
      if (err || !result.affectedRows) {
        res.status(400).json({ message: 'An unknown error occured' });
      } else {
        res.status(200).json({ message: 'Service deleted successfully' });

        sql = 'DELETE FROM linked_services WHERE service_id = ?';
        cn.query(sql, [req.params.id], (err, result) => {
          cn.release();
        });
      }
    });
  });
};
