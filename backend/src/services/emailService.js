import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendAccessRequestEmail(patientEmail, doctorName, purpose) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: patientEmail,
      subject: 'New Medical Record Access Request - MediChain',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0A3D62;">Medical Record Access Request</h2>
          <p>Hello,</p>
          <p>Dr. ${doctorName} has requested access to your medical records for:</p>
          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #16A085;">
            ${purpose}
          </blockquote>
          <p>Please log in to your MediChain account to approve or deny this request.</p>
          <a href="${process.env.FRONTEND_URL}/patient/access" 
             style="background: #0A3D62; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Review Request
          </a>
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            This is an automated message from MediChain. Please do not reply to this email.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendAccessGrantedEmail(doctorEmail, patientName) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: doctorEmail,
      subject: 'Medical Record Access Granted - MediChain',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16A085;">Access Granted</h2>
          <p>Hello Doctor,</p>
          <p>${patientName} has granted you access to their medical records.</p>
          <p>You can now view their records through your MediChain dashboard.</p>
          <a href="${process.env.FRONTEND_URL}/doctor/patients" 
             style="background: #16A085; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Records
          </a>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEmergencyAccessAlert(patientEmail, accessorInfo) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: patientEmail,
      subject: 'EMERGENCY: Your Medical Records Were Accessed - MediChain',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Emergency Access Alert</h2>
          <p>Hello,</p>
          <p>Your medical records were accessed under emergency conditions by:</p>
          <blockquote style="background: #fff3f3; padding: 10px; border-left: 4px solid #dc3545;">
            ${accessorInfo}
          </blockquote>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p>If this was not authorized, please contact MediChain support immediately.</p>
          <a href="${process.env.FRONTEND_URL}/patient/audit" 
             style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Access Logs
          </a>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();