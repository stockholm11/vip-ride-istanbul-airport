const express = require('express');
const bodyParser = require('body-parser');
const Iyzipay = require('iyzipay');
require('dotenv').config();
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

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
    
    console.log('=== Ödeme İsteği Başladı ===');
    console.log('İstek body:', JSON.stringify(req.body, null, 2));
    console.log('Rezervasyon detayları:', JSON.stringify(bookingDetails, null, 2));

    // iyzico instance kontrolü
    console.log('iyzico instance:', {
        apiKey: process.env.IYZI_API_KEY ? 'API Key mevcut' : 'API Key eksik',
        secretKey: process.env.IYZI_SECRET_KEY ? 'Secret Key mevcut' : 'Secret Key eksik',
        baseUrl: process.env.IYZI_BASE_URL
    });

    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: `CONV-${Date.now()}`,
        price: price,
        paidPrice: paidPrice,
        currency: currency,
        installment: '1',
        basketId: basketId,
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: paymentCard,
        buyer: buyer,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        basketItems: basketItems,
    };

    console.log('iyzico isteği:', JSON.stringify(request, null, 2));

    try {
        const result = await new Promise((resolve, reject) => {
            iyzipayInstance.payment.create(request, (err, result) => {
                if (err) {
                    console.error('iyzico hata:', JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log('iyzico yanıt:', JSON.stringify(result, null, 2));
                    resolve(result);
                }
            });
        });

        console.log('Ödeme sonucu:', JSON.stringify(result, null, 2));

        if (result.status === 'success') {
            console.log('Ödeme başarılı, e-posta gönderiliyor...');
            const emailSent = await sendBookingConfirmationEmail(bookingDetails);
            if (!emailSent) {
                console.error('E-posta gönderilemedi');
            } else {
                console.log('E-posta başarıyla gönderildi');
            }
        } else {
            console.error('Ödeme başarısız:', result.errorMessage);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Ödeme işlemi hatası:', error);
        res.status(500).json({ 
            error: error.message || 'Ödeme işlemi başarısız oldu',
            details: error
        });
    }
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
