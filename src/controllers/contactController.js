import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * POST /api/contact
 * Handles contact form inquiries and returns direct WhatsApp follow-up link
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, phone, email, inquiry_type = 'General Inquiry', message = '' } = req.body;

    if (!name || !phone) {
      return errorResponse(res, 'Name and phone are required', null, 400);
    }

    const shopPhone = process.env.WHATSAPP_PHONE || '923428762481';
    const waText = encodeURIComponent(
      `Hello Woody Home! 🪵\nI submitted an inquiry on your website:\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email || 'N/A'}\n*Topic:* ${inquiry_type}\n*Message:* ${message || 'No additional message'}\n\nPlease get back to me.`
    );
    const whatsappUrl = `https://wa.me/${shopPhone}?text=${waText}`;

    console.log(`📩 New Contact Inquiry from: ${name} (${phone}) - Topic: ${inquiry_type}`);

    return successResponse(res, 'Inquiry received successfully!', {
      name,
      phone,
      inquiry_type,
      whatsapp_url: whatsappUrl
    }, 201);
  } catch (err) {
    next(err);
  }
};
