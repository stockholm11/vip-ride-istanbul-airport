const express = require('express');
const bodyParser = require('body-parser');
const Iyzipay = require('iyzipay');
require('dotenv').config();
const cors = require('cors');
const nodemailer = require('nodemailer');
const { testConnection } = require('./config/database');
const Reservation = require('./models/Reservation');

const app = express();
app.use(bodyParser.json());

// Test database connection on startup
testConnection()
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection failed:', err));

app.use(cors({
    origin: true, // Tüm originlere izin ver
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    credentials: false // credentials'ı kapat
}));
app.use(express.json());

const iyzipayInstance = new Iyzipay({
    apiKey: process.env.IYZI_API_KEY,
    secretKey: process.env.IYZI_SECRET_KEY,
    uri: process.env.IYZI_BASE_URL
});

// E-posta transporter'ı oluştur
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// SMTP bağlantısını test et
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP Bağlantı Hatası:', error);
    } else {
        console.log('SMTP Sunucusuna başarıyla bağlanıldı!');
    }
});

// Rezervasyon onay e-postası gönderme fonksiyonu
const sendBookingConfirmationEmail = async (bookingDetails) => {
    const { email, firstName, lastName, serviceName, date, time, pickupLocation, dropoffLocation, totalPrice, bookingReference } = bookingDetails;

    console.log('E-posta gönderimi başlatılıyor...');
    console.log('Alıcı:', email);
    console.log('Rezervasyon detayları:', bookingDetails);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Rezervasyon Onayı - VIP Ride Istanbul Airport',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Rezervasyon Onayı</h2>
                <p>Sayın ${firstName} ${lastName},</p>
                <p>Rezervasyonunuz başarıyla oluşturulmuştur. Rezervasyon detaylarınız aşağıda yer almaktadır:</p>
                
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Rezervasyon Referansı:</strong> ${bookingReference}</p>
                    <p><strong>Hizmet:</strong> ${serviceName}</p>
                    <p><strong>Tarih:</strong> ${date}</p>
                    <p><strong>Saat:</strong> ${time}</p>
                    <p><strong>Alış Noktası:</strong> ${pickupLocation}</p>
                    <p><strong>Bırakış Noktası:</strong> ${dropoffLocation}</p>
                    <p><strong>Toplam Tutar:</strong> ${totalPrice} EUR</p>
                </div>

                <p>Herhangi bir sorunuz olması durumunda bizimle iletişime geçebilirsiniz.</p>
                
                <p>Saygılarımızla,<br>VIP Ride Istanbul Airport Ekibi</p>
            </div>
        `
    };

    try {
        console.log('E-posta ayarları:', {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            user: process.env.EMAIL_USER
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('E-posta başarıyla gönderildi:', info.response);
        return true;
    } catch (error) {
        console.error('E-posta gönderme hatası:', error);
        console.error('Hata detayları:', {
            message: error.message,
            code: error.code,
            command: error.command
        });
        return false;
    }
};

app.post('/api/payment', async (req, res) => {
    const { price, paidPrice, currency, basketId, paymentCard, buyer, shippingAddress, billingAddress, basketItems, bookingDetails } = req.body;
    
    // Servis tipi belirleme
    let serviceType = 'TRANSFER';
    if (bookingDetails.bookingReference) {
        if (bookingDetails.bookingReference.startsWith('TOUR-')) {
            serviceType = 'TOUR';
        } else if (bookingDetails.bookingReference.startsWith('TRF-')) {
            serviceType = 'TRANSFER';
        } else if (bookingDetails.bookingReference.startsWith('CHF-')) {
            serviceType = 'CHAUFFEUR';
        }
    }

    // Araç tipi belirleme
    let vehicleType = '';
    if (bookingDetails.serviceName) {
        vehicleType = bookingDetails.serviceName;
    } else {
        vehicleType = 'Mercedes-Benz Vito Tourer';
    }

    // Telefon numarası belirleme
    const customerPhone = (buyer?.gsmNumber || '').toString().trim();

    // Rezervasyon verisi
    const reservationData = {
        customer_name: `${bookingDetails.firstName || ''} ${bookingDetails.lastName || ''}`.trim(),
        customer_email: bookingDetails.email || '',
        customer_phone: customerPhone,
        pickup_location: bookingDetails.pickupLocation || '',
        dropoff_location: bookingDetails.dropoffLocation || '',
        pickup_date: bookingDetails.date || '',
        pickup_time: bookingDetails.time || '',
        vehicle_type: vehicleType,
        service_type: serviceType,
        passengers: bookingDetails.passengers || 1,
        special_requests: bookingDetails.specialRequests || '',
        status: 'CONFIRMED'
    };

    try {
        const reservationId = await Reservation.create(reservationData);
        console.log('Rezervasyon başarıyla kaydedildi. ID:', reservationId);
        
        // E-posta gönder
        const emailSent = await sendBookingConfirmationEmail(bookingDetails);
        if (!emailSent) {
            console.error('E-posta gönderilemedi');
        }
    } catch (dbError) {
        console.error('Rezervasyon kaydedilirken hata:', dbError);
    }
    res.status(200).json({ status: 'success' });
});

// E-posta gönderme endpoint'i
app.post('/api/send-email', async (req, res) => {
    const { to, subject, text, html } = req.body;

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'E-posta başarıyla gönderildi' });
    } catch (error) {
        console.error('E-posta gönderme hatası:', error);
        res.status(500).json({ error: 'E-posta gönderilemedi' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
