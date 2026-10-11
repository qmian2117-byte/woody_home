import nodemailer from 'nodemailer';

/**
 * Send Order Confirmation Email
 */
export const sendOrderConfirmationEmail = async ({ toEmail, customerName, orderNumber, items, total, paymentMethod, shippingAddress, city }) => {
  if (!toEmail) return { success: false, message: 'No recipient email provided' };

  try {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const sender = process.env.SMTP_FROM || '"Woody Home" <orders@woodyhome.pk>';

    const itemRows = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${item.product_title} (${item.variant_title || 'Standard'})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">Rs. ${Number(item.unit_price).toLocaleString()}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #111111; color: #C9A84C; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">WOODY HOME</h1>
          <p style="margin: 4px 0 0; color: #dddddd; font-size: 14px;">Artisan Handcrafted Wooden Decor</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #222222; margin-top: 0;">Order Confirmed! 🎉</h2>
          <p style="color: #555555; font-size: 15px;">Dear <strong>${customerName}</strong>, thank you for your order. We have received your request and our artisans are preparing your pieces.</p>
          
          <div style="background: #f9f9f7; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Order Number:</strong> <span style="color: #C9A84C; font-weight: bold;">${orderNumber}</span></p>
            <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${paymentMethod === 'COD' ? 'Cash On Delivery (COD)' : 'Paid Online (Card)'}</p>
            <p style="margin: 4px 0;"><strong>Shipping Address:</strong> ${shippingAddress}, ${city}</p>
          </div>

          <h3 style="color: #222222; border-bottom: 2px solid #111111; padding-bottom: 8px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f0f0f0; text-align: left; font-size: 13px; color: #444444;">
                <th style="padding: 8px 10px;">Item</th>
                <th style="padding: 8px 10px; text-align: center;">Qty</th>
                <th style="padding: 8px 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 16px;">Total:</td>
                <td style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 16px; color: #C9A84C;">Rs. ${Number(total).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          <p style="font-size: 13px; color: #777777; text-align: center; margin-top: 30px;">
            Questions? Contact customer support on WhatsApp: <strong>+92 332 6457322</strong>
          </p>
        </div>
      </div>
    `;

    // If SMTP is not configured in .env, simulate gracefully for development
    if (!host || !user || !pass) {
      console.log(`[EmailService] 📧 Simulated Order Confirmation Email to: ${toEmail} for Order #${orderNumber}`);
      return { success: true, simulated: true };
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: sender,
      to: toEmail,
      subject: `Order Confirmation #${orderNumber} — Woody Home`,
      html: htmlContent
    });

    console.log(`[EmailService] ✅ Email dispatched to ${toEmail} for Order #${orderNumber}`);
    return { success: true };
  } catch (error) {
    console.error('[EmailService] ❌ Failed to send order email:', error.message);
    return { success: false, error: error.message };
  }
};
