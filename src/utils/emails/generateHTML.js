
export const signUpHTML = (otp, name, subject) =>
    `
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Template</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    text-align: center;
                    background: #4CAF50;
                    color: white;
                    padding: 10px 0;
                    border-radius: 5px 5px 0 0;
                }
                .email-body {
                    margin: 20px 0;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333333;
                }
                .email-body .activation-button {
                    display: inline-block;
                    padding: 10px 15px;
                    margin: 10px 0;
                    color: #ffffff;
                    background-color: #4CAF50;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .email-footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777777;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>${subject}</h1>
                </div>
                <div class="email-body">
                    <h2>Hello ${name},</h2>
                    <p>Thank you for signing up with [Your Company Name]. To complete your registration and start using your account, please click the button below:</p>
                    <h2 class="activation-button">${otp}</h2>
                    <p>If you did not sign up for this account, please ignore this email.</p>
                    <p>Best regards,<br>Sara7a Team</p>
                </div>
                <div class="email-footer">
                    <p>&copy; 2024 [Your Company Name]. All rights reserved.</p>
                    <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
                </div>
            </div>
        </body>
    </html>
`

export const acceptanceEmailHTML = (name, jobTitle, companyName, subject) =>
    `
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    text-align: center;
                    background: #4CAF50;
                    color: white;
                    padding: 10px 0;
                    border-radius: 5px 5px 0 0;
                }
                .email-body {
                    margin: 20px 0;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333333;
                }
                .email-body .confirmation-button {
                    display: inline-block;
                    padding: 10px 15px;
                    margin: 10px 0;
                    color: #ffffff;
                    background-color: #4CAF50;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .email-footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777777;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>${subject}</h1>
                </div>
                <div class="email-body">
                    <h2>Hello ${name},</h2>
                    <p>We are pleased to inform you that you have been accepted for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>!</p>
                    <p>We were very impressed with your skills and experience, and we are excited to have you join our team.</p>
                    <p>Please confirm your acceptance by clicking the button below:</p>
                    <a href="[ConfirmationLink]" class="confirmation-button">Confirm Acceptance</a>
                    <p>If you have any questions or need further information, please don't hesitate to reach out.</p>
                    <p>We look forward to welcoming you on board!</p>
                    <p>Best regards,<br>${companyName} Team</p>
                </div>
                <div class="email-footer">
                    <p>&copy; 2024 ${companyName}. All rights reserved.</p>
                    <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
                </div>
            </div>
        </body>
    </html>
`

export const rejectionEmailHTML = (name, jobTitle, companyName) =>
    `
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application Update - Not Selected</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    text-align: center;
                    background: #d9534f;
                    color: white;
                    padding: 10px 0;
                    border-radius: 5px 5px 0 0;
                }
                .email-body {
                    margin: 20px 0;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333333;
                }
                .email-footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777777;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Application Update - Not Selected</h1>
                </div>
                <div class="email-body">
                    <h2>Hello ${name},</h2>
                    <p>We appreciate your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
                    <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
                    <p>We encourage you to apply for future opportunities that match your skills and experience.</p>
                    <p>Thank you again for your time and effort.</p>
                    <p>Best regards,<br>${companyName} Team</p>
                </div>
                <div class="email-footer">
                    <p>&copy; 2024 ${companyName}. All rights reserved.</p>
                    <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
                </div>
            </div>
        </body>
    </html>
`;

