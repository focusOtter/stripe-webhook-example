import { Duration } from 'aws-cdk-lib'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'

type StripeWebhookFuncProps = {
	appName: string
	region: string
	account: string
	stripeSecretNameInSecretsManager: string
}

export const createStripeWebhookFunc = (
	scope: Construct,
	props: StripeWebhookFuncProps
) => {
	const stripeWebhookFunc = new NodejsFunction(
		scope,
		`${props.appName}-stripeWebhookFunc`,
		{
			functionName: `${props.appName}-stripeWebhookFunc`,
			runtime: Runtime.NODEJS_18_X,
			handler: 'handler',
			entry: path.join(__dirname, `./main.ts`),
			timeout: Duration.seconds(30),
			environment: {
				STRIPE_CREDENTIALS_WITH_WEBHOOK: props.stripeSecretNameInSecretsManager,
			},
		}
	)

	const stripeWebhookFuncURL = stripeWebhookFunc.addFunctionUrl({
		authType: FunctionUrlAuthType.NONE,
	})

	stripeWebhookFunc.addToRolePolicy(
		new PolicyStatement({
			actions: ['secretsmanager:GetSecretValue'],
			resources: [
				`arn:aws:secretsmanager:${props.region}:${props.account}:secret:${props.stripeSecretNameInSecretsManager}-*`,
			],
		})
	)

	return { stripeWebhookFunc, stripeWebhookFuncURL: stripeWebhookFuncURL.url }
}
