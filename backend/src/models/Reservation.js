const { pool } = require('../config/database');

class Reservation {
  static async create(reservationData) {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        console.log('Reservation.create() çağrıldı');
        console.log('Status değeri:', reservationData.status);

        const sql = `
          INSERT INTO reservations (
            customer_name,
            customer_email,
            customer_phone,
            pickup_location,
            dropoff_location,
            pickup_date,
            pickup_time,
            vehicle_type,
            service_type,
            passengers,
            special_requests,
            status,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
          reservationData.customer_name,
          reservationData.customer_email,
          reservationData.customer_phone,
          reservationData.pickup_location,
          reservationData.dropoff_location,
          reservationData.pickup_date,
          reservationData.pickup_time,
          reservationData.vehicle_type,
          reservationData.service_type,
          reservationData.passengers,
          reservationData.special_requests,
          reservationData.status
        ];

        console.log('SQL Parametreleri:', params);
        const [result] = await pool.execute(sql, params);
        console.log('SQL sonucu:', result);

        return result.insertId;
      } catch (error) {
        retryCount++;
        console.error(`Rezervasyon oluşturma denemesi ${retryCount}/${maxRetries} başarısız:`, error);

        if (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST') {
          if (retryCount < maxRetries) {
            console.log(`${retryCount}. deneme başarısız. Yeniden deneniyor...`);
            // Exponential backoff: 1s, 2s, 4s
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            continue;
          }
        }

        if (retryCount === maxRetries) {
          console.error('Maksimum deneme sayısına ulaşıldı. Rezervasyon oluşturulamadı.');
          throw error;
        }
      }
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM reservations WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Rezervasyon bulunamadı:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM reservations ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error finding all reservations:', error);
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      await pool.execute(
        'UPDATE reservations SET status = ? WHERE id = ?',
        [status, id]
      );
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  }
}

module.exports = Reservation; 