const axios = require('axios');

// Simple in-memory store for OTPs if MSG91 doesn't verify directly,
// but MSG91 has its own verify API. We will use MSG91's Send & Verify API.

async function sendOtpHandler(req, res, body) {
    try {
        // Re-load .env to catch live changes
        require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
        const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
        const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

        const { phone } = JSON.parse(body);
        if (!phone) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Phone number is required' }));
        }

        // Clean phone number (remove +)
        const cleanPhone = phone.replace('+', '');

        const url = `https://control.msg91.com/api/v5/otp?template_id=${MSG91_TEMPLATE_ID}&mobile=${cleanPhone}`;
        
        const response = await axios.post(url, {}, {
            headers: {
                'authkey': MSG91_AUTH_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.type === 'success') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'OTP sent successfully' }));
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: response.data.message || 'Failed to send OTP' }));
        }
    } catch (error) {
        console.error('[/api/send-otp] Error:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
    }
}

async function verifyOtpHandler(req, res, body) {
    try {
        // Re-load .env to catch live changes
        require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
        const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;

        const { phone, otp } = JSON.parse(body);
        if (!phone || !otp) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Phone and OTP are required' }));
        }

        // Clean phone number
        const cleanPhone = phone.replace('+', '');

        const url = `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${cleanPhone}`;
        
        const response = await axios.get(url, {
            headers: {
                'authkey': MSG91_AUTH_KEY
            }
        });

        if (response.data.type === 'success' || response.data.message === 'OTP verified success') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ verified: true, success: true }));
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ verified: false, success: false, error: response.data.message || 'Invalid OTP' }));
        }
    } catch (error) {
        console.error('[/api/verify-otp] Error:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ verified: false, success: false, error: 'Internal server error' }));
    }
}

module.exports = {
    sendOtpHandler,
    verifyOtpHandler
};
