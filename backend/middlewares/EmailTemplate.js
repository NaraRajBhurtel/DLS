export const Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email - LearnX</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #1E88E5; /* LearnX blue */
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #1E88E5;
              background: #E3F2FD;
              border: 1px dashed #1E88E5;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email - LearnX</div>
          <div class="content">
              <p>Hello,</p>
              <p>Thank you for registering with LearnX! To complete your signup, please verify your email by entering the following code:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you did not sign up for LearnX, please ignore this email.</p>
              <p>If you need any help, contact our support team at <a href="mailto:support@learnx.com">support@learnx.com</a>.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} LearnX. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;



export const Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to LearnX</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #1E88E5; /* LearnX blue */
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .welcome-message {
              font-size: 18px;
              margin: 20px 0;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              background-color: #1E88E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #1565C0;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Welcome to LearnX!</div>
          <div class="content">
              <p class="welcome-message">Hello {name},</p>
              <p>We're excited to have you as part of the LearnX community. Your registration was successful!</p>
              <p>Here’s how you can get started:</p>
              <ul>
                  <li>Explore our courses and find topics that interest you.</li>
                  <li>Track your learning progress and earn certificates.</li>
                  <li>Connect with instructors and fellow learners.</li>
              </ul>
              
              <p>If you have any questions or need assistance, feel free to contact us anytime at <a href="mailto:support@learnx.com">support@learnx.com</a>.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} LearnX. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

export const Scheduled_Meeting_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Scheduled Meeting Notification - LearnX</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0; padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      border: 1px solid #ddd;
      overflow: hidden;
    }
    .header {
      background-color: #1E88E5;
      color: white;
      padding: 20px;
      font-size: 24px;
      text-align: center;
      font-weight: bold;
    }
    .content {
      padding: 25px;
      line-height: 1.6;
    }
    .meeting-info {
      background: #E3F2FD;
      border: 1px dashed #1E88E5;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
      font-weight: bold;
      font-size: 18px;
      color: #1E88E5;
    }
    .footer {
      background-color: #f4f4f4;
      text-align: center;
      font-size: 12px;
      color: #777;
      padding: 15px;
      border-top: 1px solid #ddd;
    }
    a {
      color: #1E88E5;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Scheduled Meeting Notification</div>
    <div class="content">
      <p>Hi {name},</p>
      <p>A new live meeting has been scheduled for the course <strong>{courseTitle}</strong>.</p>
      <div class="meeting-info">
        Scheduled Date & Time: {startTime}
      </div>
      <p>Please be ready to join the meeting at the scheduled time.</p>
      <p>If you have any questions, feel free to contact us at <a href="mailto:support@learnx.com">support@learnx.com</a>.</p>
      <p>Best regards,<br/>The LearnX Team</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} LearnX. All rights reserved.
    </div>
  </div>
</body>
</html>
`;


