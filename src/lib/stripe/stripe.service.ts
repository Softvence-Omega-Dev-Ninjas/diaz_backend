import { ENVEnum } from '@/common/enum/env.enum';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlanType } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.getOrThrow<string>(
      ENVEnum.STRIPE_SECRET_KEY,
    );
    this.stripe = new Stripe(secretKey);
  }

  // Product & Price Management
  async createProductWithPrice({
    title,
    description,
    price,
    planType,
  }: {
    title: string;
    description: string;
    price: number;
    planType: PlanType;
  }) {
    const product = await this.stripe.products.create({
      name: title,
      description,
    });

    const lookupKey = this.generateLookUpKey(planType);

    const stripePrice = await this.stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100),
      currency: 'usd',
      recurring: { interval: 'month' },
      lookup_key: lookupKey, // important for lookup
    });

    this.logger.log(
      `Created Stripe product ${product.id} with price ${stripePrice.id} and lookup_key ${lookupKey}`,
    );

    return { product, stripePrice };
  }

  async getActivePriceByPlanType(planType: PlanType) {
    const lookupKey = this.generateLookUpKey(planType);

    const prices = await this.stripe.prices.list({
      lookup_keys: [lookupKey],
      active: true,
      limit: 1,
    });

    return prices.data[0] ?? null;
  }

  // Webhook Utility
  constructWebhookEvent(rawBody: Buffer, signature: string) {
    const endpointSecret = this.configService.getOrThrow<string>(
      ENVEnum.STRIPE_WEBHOOK_SECRET,
    );
    try {
      return this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      this.logger.error('Invalid webhook signature', err);
      throw new Error('Invalid webhook signature');
    }
  }

  private generateLookUpKey(planType: PlanType) {
    return `subscription:${planType.toLowerCase()}:usd:month`;
  }
}
