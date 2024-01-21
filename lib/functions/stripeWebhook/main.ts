import {
	SecretsManagerClient,
	GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager'

import Stripe from 'stripe'

const client = new SecretsManagerClient()

type StripeSecrets = {
	STRIPE_SECRET_KEY: string
	STRIPE_SECRET_WEBHOOK: string
}
const fetchSecrets = async (secretName: string | undefined) => {
	try {
		const command = new GetSecretValueCommand({ SecretId: secretName })
		const response = await client.send(command)
		const secretValue = response.SecretString

		if (!secretValue) return null
		const stripeSecrets = JSON.parse(secretValue) as StripeSecrets
		return stripeSecrets
	} catch (error) {
		console.error('Error fetching secret:', error)
		return null
	}
}

exports.handler = async (event: any) => {
	const eventData = JSON.parse(event.body).data.object
	console.log('the eventData', eventData)

	// fetch the secrets from Secrets Manager
	const stripeSecrets = await fetchSecrets(
		process.env.STRIPE_CREDENTIALS_WITH_WEBHOOK as string
	)

	if (!stripeSecrets) return { error: 'Missing secrets' }

	const stripe = new Stripe(stripeSecrets.STRIPE_SECRET_KEY)

	// Grab the unique signature provided by Stripe
	const sig = event.headers['stripe-signature']
	let verifiedEvent

	// Verify the function is being invoked by Stripe
	try {
		verifiedEvent = stripe.webhooks.constructEvent(
			event.body,
			sig,
			stripeSecrets.STRIPE_SECRET_WEBHOOK
		)
	} catch (err: any) {
		console.log('uh there was an error', err)
		return { error: err.message }
	}

	switch (verifiedEvent.type) {
		case 'checkout.session.completed':
			try {
				//the stuff you want to do. ie put an item in a db, call an api, etc
			} catch (e) {
				console.log('error', e)
			}
			break
		default:
			console.log(`Unhandled verifiedEvent type ${verifiedEvent.type}`)
	}
}
