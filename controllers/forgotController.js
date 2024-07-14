const nodemailer = require('nodemailer');
const User = require('../models/User'); // Ensure path is correct
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.forgotPassword = async (req, res, next) => {
    try {
        console.log('Forgot password endpoint hit');
        const { email } = req.body;
        console.log(`Received email: ${email}`);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            return res.status(404).send('User not found');
        }
        
        const token = crypto.randomInt(1000, 9999).toString();
        console.log(`Generated token: ${token}`);
        
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 60000; // Token valid for 60 seconds
        await user.save();
        console.log('User token and expiration saved to database');
        
        // Send email asynchronously
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Your password reset code is ${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error); // Log the specific error
            } else {
                console.log('Reset code sent: ', info.response);
            }
        });

        res.status(200).send('Reset code sent');
    } catch (error) {
        console.error('Error in forgotPassword:', error); // Log the specific error
        next(error); // Pass the error to the error handling middleware
    }
};

exports.verifyToken = async (req, res, next) => {
    try {
        console.log('Verify token endpoint hit');
        const { email, token } = req.body;
        console.log(`Received email: ${email}, token: ${token}`);

        if (!email || !token) {
            console.error('Email or token missing');
            return res.status(400).send('Email or token missing');
        }

        const user = await User.findOne({
            email,
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            console.error('Invalid or expired token');
            return res.status(400).send('Invalid or expired token');
        }

        console.log('Token verified', user);
        res.status(200).send('Token verified');
    } catch (error) {
        console.error('Error in verifyToken:', error); // Log the specific error
        next(error); // Pass the error to the error handling middleware
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        console.log('Reset password endpoint hit');
        const { email, token, newPassword } = req.body;
        console.log(`Received email: ${email}, token: ${token}`);
        
        const user = await User.findOne({
            email,
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });
        
        if (!user) {
            console.error('Invalid or expired token');
            return res.status(400).send('Invalid or expired token');
        }
        
        user.password = newPassword; // Password will be hashed before saving
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        
        console.log('Password reset successful');
        res.status(200).send('Password reset successful');
    } catch (error) {
        console.error('Error in resetPassword:', error); // Log the specific error
        next(error); // Pass the error to the error handling middleware
    }
};
