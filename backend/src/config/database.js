const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = createPool();

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000,
    acquireTimeout: 30000,
    dateStrings: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    // Hostinger genellikle SSL istemez, kaldırıldı
  });
}

// Bağlantı havuzunu test et
async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Veritabanı bağlantısı başarılı!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
    return false;
  }
}

// Her 30 saniyede bir bağlantıyı kontrol et
setInterval(async () => {
  await testConnection();
}, 30000);

// Bağlantı havuzu hata yönetimi ve otomatik yeniden bağlanma
pool.on('error', (err) => {
  console.error('Veritabanı havuzu hatası:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
    console.log('Veritabanı bağlantısı kesildi. Havuz yeniden oluşturuluyor...');
    pool.end().catch(() => {});
    pool = createPool();
  } else {
    console.error('Bilinmeyen veritabanı havuzu hatası:', err);
  }
});

module.exports = {
  pool,
  testConnection
}; 