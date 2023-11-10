import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailToProvisionerDto } from 'src/provisioner/dto/mail-to-provisioner.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailToProvisioner(
    to: string,
    subject: string,
    products: MailToProvisionerDto,
  ) {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    });

    const htmlContent = `
      <html>
        <head>
          <!-- Add Bootstrap CDN link here -->
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        </head>
        <body>
          <div class="container mt-4">
            <div class="jumbotron">
              <h1 class="display-4">Hello, Provisioner!</h1>
              <p class="lead">You have a new order. Please review the details below:</p>
              <hr class="my-4">
              <p class="lead">Sent on: ${currentDate}</p>
            </div>
            
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Quantity</th>
                  <!-- Add more table headers if needed -->
                </tr>
              </thead>
              <tbody>
                ${products.products
                  .map(
                    (product) => `
                  <tr>
                    <td>${product.product}</td>
                    <td>${product.quantity}</td>
                    <!-- Add more table cells if needed -->
                  </tr>
                `,
                  )
                  .join('')}
              </tbody>
            </table>
            
          </div>
        </body>
      </html>
    `;

    await this.mailerService.sendMail({
      to,
      subject,
      html: htmlContent,
    });
  }
}
