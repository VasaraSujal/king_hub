const express = require('express');
const router = express.Router();
const { sendMail } = require('../services/mailService');

router.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({
      error: 'Missing required fields: to, subject, and at least one of text or html',
    });
  }

  try {
    await sendMail(to, subject, text, html);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});

module.exports = router;
