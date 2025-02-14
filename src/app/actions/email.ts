'use server'
import { Resend } from 'resend'

export async function sendEmail(data: {
  name: string
  email: string
  message: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: 'sebastien.pingal@gmail.com',
    subject: 'Nouveau message de ' + data.name,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: white; padding: 20px; border-radius: 0 0 8px 8px; }
            .footer { margin-top: 20px; font-size: 12px; color: #6c757d; }
            .message-box { 
              background-color: #f8f9fa;
              border-left: 4px solid #007bff;
              padding: 15px;
              margin: 10px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📬 Nouveau message reçu</h2>
            </div>
            <div class="content">
              <p><strong>De:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              
              <div class="message-box">
                <p><strong>Message:</strong></p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé via votre formulaire de contact.</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
} 