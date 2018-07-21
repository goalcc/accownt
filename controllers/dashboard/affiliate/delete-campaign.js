const db = require('lib/db');

/*
  DELETE /api/dashboard/affiliate/:code
*/
module.exports = function(req, res) {
  let sql = `
        DELETE FROM affiliate_campaigns WHERE code = ? AND user_id IN (
            SELECT id FROM users WHERE id = ? AND affiliate = 1
        )
    `,
    vars = [req.params.code, req.session.uid];

  db(cn =>
    cn.query(sql, vars, (err, result) => {
      cn.release();
      res.status(200).json({ error: !!err || !result.affectedRows });
    })
  );
};
