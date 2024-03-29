# AWS CDK Stripe Webhook Lambda
![image](https://github.com/focusOtter/stripe-webhook-example/assets/5106417/0a803461-e8be-4493-9248-14620a3a4fe4)

## Description

AWS CDK Stripe Webhook Lambda is a NodeJS and TypeScript based application designed to generate a Lambda function deployable via AWS CDK. This Lambda function is specifically tailored for handling Stripe webhooks with enhanced security through webhook signature verification.

## Features

- **NodeJS and TypeScript Integration**: Built using NodeJS and TypeScript within the AWS Cloud Development Kit (CDK) for a robust and type-safe development experience.
- **Stripe Webhook Handling**: Configured to process Stripe webhook events, with a primary focus on validating webhook signatures for security.
- **AWS Lambda Function**: Utilizes AWS Lambda, leveraging Node 18, to provide a scalable and efficient serverless backend.
- **AWS Secrets Manager Integration**: Automatically retrieves necessary secrets (Stripe secret and webhook secret) stored in AWS Secrets Manager, ensuring secure and convenient access to sensitive data.
- **Simplified Deployment**: Streamlined deployment process using AWS CDK commands, abstracting away the complexity of AWS infrastructure management.

## Pre-requisites

Before deploying this application, ensure that:

1. **Stripe Secrets in AWS Secrets Manager**: A secret named `STRIPE_TEST_CREDENTIALS_WITH_WEBHOOK` is pre-stored in AWS Secrets Manager. This secret should be an object containing:
   - `STRIPE_SECRET_KEY`: Your Stripe test secret key.
   - `STRIPE_SECRET_WEBHOOK`: Stripe webhook secret obtained after configuring the Lambda function URL in the Stripe developer dashboard (You won't have this until after you deploy, but can update the value then.)
  
<img width="1381" alt="image" src="https://github.com/focusOtter/stripe-webhook-example/assets/5106417/45a251a1-8213-4258-8849-90450ced2533">


## Setup and Deployment

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/focusOtter/stripe-webhook-example.git
   ```
2. **Install Dependencies**:
   Navigate to the cloned directory and run:
   ```bash
   npm install
   ```
3. **Synthesize CloudFormation Template**:
   Ensure there are no errors in the CloudFormation template generation:
   ```bash
   npx aws-cdk synth
   ```
4. **Deploy to AWS**:
   Deploy your application to AWS:
   ```bash
   npx aws-cdk deploy
   ```

## Testing

Once deployed, the Lambda function will log event data to AWS CloudWatch, particularly focusing on `checkout.session.completed` events, allowing you to monitor and debug the Stripe webhook interactions.
<img width="828" alt="image" src="https://github.com/focusOtter/stripe-webhook-example/assets/5106417/d10e9ff6-8fb8-4a17-a4e4-a51093bdf11c">


## License

This project is released under the MIT License.

---

**Note**: This README assumes a basic understanding of AWS services, including Lambda, AWS CDK, and AWS Secrets Manager, along with familiarity with Stripe's webhook system. It is essential to ensure all AWS and Stripe configurations comply with your project's requirements and security guidelines.
