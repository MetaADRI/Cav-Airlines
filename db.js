const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error', err.message);
});

function convertParams(text, params) {
  let idx = 0;
  return {
    text: text.replace(/\?/g, () => `$${++idx}`),
    values: params || [],
  };
}

module.exports = {
  all(text, params, callback) {
    const q = convertParams(text, params);
    pool.query(q, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result.rows);
    });
  },

  get(text, params, callback) {
    const q = convertParams(text, params);
    pool.query(q, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result.rows[0]);
    });
  },

  run(text, params, callback) {
    const q = convertParams(text, params);
    const isInsert = /^\s*INSERT\s/i.test(q.text);
    const finalText = isInsert ? q.text + ' RETURNING *' : q.text;

    pool.query({ ...q, text: finalText }, (err, result) => {
      if (err) return callback(err);
      if (isInsert && result.rows && result.rows.length > 0) {
        const row = result.rows[0];
        const idKey = Object.keys(row).find(k => /_id$/.test(k) || k === 'id');
        const lastID = idKey ? row[idKey] : (Object.values(row)[0] || null);
        callback.call({ lastID, changes: 1 }, null);
      } else {
        callback.call({ changes: result.rowCount || 0 }, null);
      }
    });
  },

  end() {
    return pool.end();
  },
};
