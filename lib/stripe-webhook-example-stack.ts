import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createStripeWebhookFunc } from './functions/stripeWebhook/contruct'

export class StripeWebhookExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)
		const appName = 'stripe-webhook-example'
		const stripeWebhookFunc = createStripeWebhookFunc(this, {
			appName,
			account: this.account,
			region: this.region,
			stripeSecretNameInSecretsManager: 'STRIPE_TEST_CREDENTIALS_WITH_WEBHOOK',
		})

		new cdk.CfnOutput(this, 'stripeWebhookFuncURL', {
			value: stripeWebhookFunc.stripeWebhookFuncURL,
		})
	}
}
