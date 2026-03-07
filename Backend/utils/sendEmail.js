import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
  
      from: 'LocalHub Admin <onboarding@resend.dev>', 
      
      // 🌟 DYNAMIC DATA: These pull exactly what the controller sends!
      to: options.email,       
      subject: options.subject, 
      html: options.message,    
    });
    
    console.log("✅ Email successfully sent via Resend API!", data);
    return data;
  } catch (error) {
    console.error("🚨 RESEND API ERROR:", error);
    throw error;
  }
};