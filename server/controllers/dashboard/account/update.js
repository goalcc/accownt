const bcrypt = require('bcrypt');
const MySQL = require('lib/mysql');

/*
  PUT /api/user/account
  REQUIRED
    currentPassword: string, newPassword: string
  RETURN
    { message: string }
*/
module.exports = async function(req, res) {
  const { currentPassword, newPassword } = req.body;
  const db = new MySQL();

  try {
    await db.getConnection();
    const [user] = await db.query('SELECT password FROM users WHERE id = ?', [
      req.session.uid
    ]);
    if (!user) throw 'Could not find user';

    // Check if current password matches
    if (!req.session.recovered && user.password) {
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) throw 'Incorrect password';
    }

    const hash = await bcrypt.hash(newPassword, 10);

    // Update password
    const result = await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hash, req.session.uid]
    );
    db.release();

    if (!result.affectedRows) throw 'Could not update password';

    res.status(200).json({ message: 'Password successfully updated' });

    req.session.recovered = false;
  } catch (err) {
    db.release();
    res.status(400).json({ message: err });
  }
};