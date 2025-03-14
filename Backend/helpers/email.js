import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {google} from 'googleapis';
import * as htmlToText from 'html-to-text';
import nodemailer from 'nodemailer';
import pug from 'pug';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `e-commerce bookstore <${process.env.EMAIL_FROM}>`;
  }

  async newTransport() {
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
    oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});
    try {
      const accessTokenObject = await oAuth2Client.getAccessToken();
      const ACCESS_TOKEN = accessTokenObject.token;
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN
        }
      });
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../templates/${template}.pug`, {
      name: this.name,
      url: this.url,
      subject,
      ...this.data
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html)
    };

    try {
      const transporter = this.newTransport();
      const transporterResult = await transporter;
      await transporterResult.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the e-commerce bookstore!');
  }

  async sendPasswordReset() {
    await this.send('resetPassword', 'Password Reset Request');
  }

  async sendOrderConfiramtion() {
    await this.send('orderConfirmation', 'Your Order Confirmation');
  }

  async sendOrderStatus() {
    await this.send('orderStatus', 'Your Order Status has been updated');
  }
}
