import { transporter } from "./email.config.js";
import { Verification_Email_Template, Welcome_Email_Template, Scheduled_Meeting_Email_Template } from "./EmailTemplate.js";

export const sendVerificationEamil=async(email,verificationCode)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"LearnX" <bhurtelnardeep014@gmail.com>',

            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}

export const senWelcomeEmail=async(email,name)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"LearnX" <bhurtelnardeep014@gmail.com>',

            to: email, // list of receivers
            subject: "Welcome Email", // Subject line
            text: "Welcome Email", // plain text body
            html: Welcome_Email_Template.replace("{name}",name)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}

export const sendScheduledMeetingEmail = async (email, name, courseTitle, startTime) => {
  try {
    // Format startTime nicely
    const formattedTime = new Date(startTime).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const htmlContent = Scheduled_Meeting_Email_Template
      .replace("{name}", name)
      .replace("{courseTitle}", courseTitle)
      .replace("{startTime}", formattedTime);

    const response = await transporter.sendMail({
      from: '"LearnX" <bhurtelnardeep014@gmail.com>',
      to: email,
      subject: `Scheduled Meeting for ${courseTitle}`,
      text: `Hi ${name}, a new live meeting has been scheduled for your course "${courseTitle}" at ${formattedTime}. Please be ready to join.`,
      html: htmlContent,
    });

    console.log(`Scheduled meeting email sent to ${email}`, response);
  } catch (error) {
    console.error("Error sending scheduled meeting email:", error);
  }
};



