const { pool } = require('./config/database');

async function testDatabase() {
    try {
        // Tablo yapısını kontrol et
        const [tableStructure] = await pool.execute('DESCRIBE reservations');
        console.log('\n=== TABLO YAPISI ===');
        console.log(JSON.stringify(tableStructure, null, 2));

        // Son rezervasyonu kontrol et
        const [lastReservation] = await pool.execute(
            'SELECT * FROM reservations ORDER BY created_at DESC LIMIT 1'
        );
        console.log('\n=== SON REZERVASYON ===');
        console.log(JSON.stringify(lastReservation[0], null, 2));

    } catch (error) {
        console.error('Veritabanı testi sırasında hata:', error);
    } finally {
        process.exit();
    }
}

testDatabase(); 