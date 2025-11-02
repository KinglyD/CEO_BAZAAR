const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    // Configure email transporter (using Gmail as example)
    this.emailTransporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  /**
   * Send co-organizer invitation notification
   */
  async sendCoOrganizerInvitation({
    eventTitle,
    eventDate,
    organizerName,
    invitedOrganization,
    revenueShare,
    message,
    invitationLink,
    recipientEmails
  }) {
    try {
      const subject = `🎉 Invitation to Co-Organize: ${eventTitle}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">CEO BAZAAR</h1>
            <p style="color: white; margin: 10px 0 0 0;">Event Collaboration Invitation</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">You've been invited to co-organize an event!</h2>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">${eventTitle}</h3>
              <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Main Organizer:</strong> ${organizerName}</p>
              <p><strong>Your Organization:</strong> ${invitedOrganization}</p>
              <p><strong>Revenue Share:</strong> ${revenueShare}%</p>
              
              ${message ? `
                <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <strong>Personal Message:</strong>
                  <p style="margin: 8px 0 0 0; font-style: italic;">"${message}"</p>
                </div>
              ` : ''}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="margin-bottom: 20px;">Ready to collaborate and create an amazing event together?</p>
              
              <a href="${invitationLink}" 
                 style="background: #667eea; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;
                        font-weight: bold; margin: 0 10px;">
                Accept Invitation
              </a>
              
              <a href="${invitationLink}&action=decline" 
                 style="background: #6c757d; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;
                        font-weight: bold; margin: 0 10px;">
                Decline Invitation
              </a>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h4 style="color: #1976d2; margin-top: 0;">What does co-organizing mean?</h4>
              <ul style="color: #555; line-height: 1.6;">
                <li>Share in planning and promoting the event</li>
                <li>Receive ${revenueShare}% of net revenue from ticket sales</li>
                <li>Collaborate on event marketing and execution</li>
                <li>Build stronger community partnerships</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              This invitation was sent through CEO Bazaar's event management platform. 
              If you have any questions, please contact the main organizer directly.
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">© 2024 CEO Bazaar - Event Management Platform</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;">
              Building connections, creating experiences
            </p>
          </div>
        </div>
      `;

      const textContent = `
        CEO BAZAAR - Co-Organizer Invitation
        
        You've been invited to co-organize: ${eventTitle}
        
        Event Date: ${new Date(eventDate).toDateString()}
        Main Organizer: ${organizerName}
        Your Organization: ${invitedOrganization}
        Revenue Share: ${revenueShare}%
        
        ${message ? `Personal Message: "${message}"` : ''}
        
        Accept or decline this invitation by visiting: ${invitationLink}
        
        What does co-organizing mean?
        - Share in planning and promoting the event
        - Receive ${revenueShare}% of net revenue from ticket sales
        - Collaborate on event marketing and execution
        - Build stronger community partnerships
        
        This invitation was sent through CEO Bazaar's event management platform.
      `;

      // Send to multiple recipients
      const emailPromises = recipientEmails.map(email => 
        this.emailTransporter.sendMail({
          from: `"CEO Bazaar Events" <${process.env.EMAIL_USER}>`,
          to: email,
          subject,
          text: textContent,
          html: htmlContent
        })
      );

      await Promise.all(emailPromises);
      
      return {
        success: true,
        message: 'Invitation emails sent successfully',
        recipientCount: recipientEmails.length
      };

    } catch (error) {
      console.error('Error sending co-organizer invitation:', error);
      return {
        success: false,
        message: 'Failed to send invitation emails',
        error: error.message
      };
    }
  }

  /**
   * Send invitation response notification to main organizer
   */
  async sendInvitationResponseNotification({
    eventTitle,
    respondingOrganization,
    response,
    revenueShare,
    mainOrganizerEmails,
    eventId
  }) {
    try {
      const isAccepted = response === 'accept';
      const subject = `${isAccepted ? '✅' : '❌'} Co-Organizer Invitation ${isAccepted ? 'Accepted' : 'Declined'}: ${eventTitle}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${isAccepted ? '#4caf50' : '#f44336'}; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">CEO BAZAAR</h1>
            <h2 style="color: white; margin: 10px 0 0 0;">Invitation ${isAccepted ? 'Accepted' : 'Declined'}</h2>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h3 style="color: #333; margin-bottom: 20px;">
              ${respondingOrganization} has ${isAccepted ? 'accepted' : 'declined'} your co-organizer invitation
            </h3>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h4 style="color: #667eea; margin-top: 0;">${eventTitle}</h4>
              <p><strong>Organization:</strong> ${respondingOrganization}</p>
              ${isAccepted ? `<p><strong>Revenue Share:</strong> ${revenueShare}%</p>` : ''}
            </div>
            
            ${isAccepted ? `
              <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h4 style="color: #2e7d32; margin-top: 0;">🎉 Great news!</h4>
                <p>You now have a co-organizer for your event. You can start collaborating on:</p>
                <ul>
                  <li>Event planning and coordination</li>
                  <li>Marketing and promotion strategies</li>
                  <li>Resource sharing and networking</li>
                  <li>Audience expansion</li>
                </ul>
              </div>
            ` : `
              <div style="background: #ffebee; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h4 style="color: #c62828; margin-top: 0;">Invitation Declined</h4>
                <p>Don't worry! You can still run a successful event on your own, or consider inviting other organizations to co-organize.</p>
              </div>
            `}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/events/${eventId}" 
                 style="background: #667eea; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;
                        font-weight: bold;">
                View Event Details
              </a>
            </div>
          </div>
        </div>
      `;

      // Send to main organizer admins
      const emailPromises = mainOrganizerEmails.map(email => 
        this.emailTransporter.sendMail({
          from: `"CEO Bazaar Events" <${process.env.EMAIL_USER}>`,
          to: email,
          subject,
          html: htmlContent
        })
      );

      await Promise.all(emailPromises);
      
      return {
        success: true,
        message: 'Response notification sent successfully'
      };

    } catch (error) {
      console.error('Error sending response notification:', error);
      return {
        success: false,
        message: 'Failed to send response notification',
        error: error.message
      };
    }
  }

  /**
   * Send revenue share update notification
   */
  async sendRevenueShareUpdateNotification({
    eventTitle,
    organizationName,
    oldShare,
    newShare,
    recipientEmails,
    eventId
  }) {
    try {
      const subject = `💰 Revenue Share Updated: ${eventTitle}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ff9800; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">CEO BAZAAR</h1>
            <h2 style="color: white; margin: 10px 0 0 0;">Revenue Share Updated</h2>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h3 style="color: #333;">Your revenue share has been updated</h3>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h4 style="color: #667eea; margin-top: 0;">${eventTitle}</h4>
              <p><strong>Organization:</strong> ${organizationName}</p>
              <p><strong>Previous Share:</strong> ${oldShare}%</p>
              <p><strong>New Share:</strong> ${newShare}%</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/events/${eventId}" 
                 style="background: #667eea; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;
                        font-weight: bold;">
                View Event Details
              </a>
            </div>
          </div>
        </div>
      `;

      const emailPromises = recipientEmails.map(email => 
        this.emailTransporter.sendMail({
          from: `"CEO Bazaar Events" <${process.env.EMAIL_USER}>`,
          to: email,
          subject,
          html: htmlContent
        })
      );

      await Promise.all(emailPromises);
      
      return {
        success: true,
        message: 'Revenue share update notification sent successfully'
      };

    } catch (error) {
      console.error('Error sending revenue share update notification:', error);
      return {
        success: false,
        message: 'Failed to send update notification',
        error: error.message
      };
    }
  }

  /**
   * Send SMS notification (placeholder for future SMS integration)
   */
  async sendSMSNotification({ phoneNumber, message }) {
    // TODO: Integrate with SMS service (Twilio, etc.)
    console.log(`SMS to ${phoneNumber}: ${message}`);
    return { success: true, message: 'SMS notification sent (simulated)' };
  }

  /**
   * Send push notification (placeholder for future push notifications)
   */
  async sendPushNotification({ userId, title, body, data }) {
    // TODO: Integrate with push notification service
    console.log(`Push notification to ${userId}: ${title} - ${body}`);
    return { success: true, message: 'Push notification sent (simulated)' };
  }
}

module.exports = new NotificationService();