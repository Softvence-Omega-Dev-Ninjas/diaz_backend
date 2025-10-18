import { PrismaService } from '@/lib/prisma/prisma.service';
import { StripeService } from '@/lib/stripe/stripe.service';
import { Injectable, Logger } from '@nestjs/common';
import { PlanType } from '@prisma/client';

const planData = [
  {
    title: 'Gold Package',
    planType: PlanType.GOLD,
    description: 'Gold plan for boat owners',
    benefits: [
      'List in minutes!',
      'Fast, affordable, effective!',
      'Entry-Level Package Maximum Exposure!',
      'No social media drama - just real buyers!',
      '5 Pics and 500 word description!',
      'One month FREE plan opportunity with promo code!',
      'No overpay to sell your boat!',
    ],
    picLimit: 5,
    wordLimit: 500,
    isBest: false,
    currency: 'usd',
    price: 9.99,
    billingPeriodMonths: 1,
  },
  {
    title: 'Platinum Package',
    planType: PlanType.PLATINUM,
    description: 'Platinum plan for boat owners',
    benefits: [
      'List in minutes!',
      'Fast, affordable, effective!',
      'More space, more visuals, more opportunity!',
      'No social media drama - just real buyers!',
      '10 Pics and 1000 word description!',
      '2 months FREE plan opportunity with promo code',
      'No overpay to sell your boat!',
    ],
    picLimit: 10,
    wordLimit: 1000,
    isBest: true,
    currency: 'usd',
    price: 15.99,
    billingPeriodMonths: 1,
  },
  {
    title: 'Diamond Elite Brokerage',
    planType: PlanType.DIAMOND,
    description: 'Diamond plan for boat owners',
    benefits: [
      'Brokers & Pro Sales Agencies',
      'Fast, affordable, effective!',
      'Multiple listings included under one package!',
      'Showcase like a pro!',
      '75 Pics and 5000 word description!',
      '2 months FREE plan opportunity with promo code',
      'No overpay to sell your boat!',
    ],
    picLimit: 75,
    wordLimit: 5000,
    isBest: false,
    currency: 'usd',
    price: 29.99,
    billingPeriodMonths: 1,
  },
];

@Injectable()
export class SubscriptionPlanService {
  private readonly logger = new Logger(SubscriptionPlanService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeService,
  ) {}

  async seedPlans() {
    for (const plan of planData) {
      // 1. Check if plan already exists
      const existingPlan = await this.prisma.subscriptionPlan.findFirst({
        where: { planType: plan.planType },
      });

      if (existingPlan) {
        this.logger.log(`[EXIST] ${plan.title} already exists, skipping...`);
        continue;
      }

      // 2. Create Stripe Product & Price
      const { product, stripePrice } = await this.stripe.createProductWithPrice(
        {
          title: plan.title,
          description: plan.description,
          price: plan.price,
        },
      );

      // 3. Create Plan in DB
      await this.prisma.subscriptionPlan.create({
        data: {
          ...plan,
          stripeProductId: product.id,
          stripePriceId: stripePrice.id,
        },
      });

      this.logger.log(
        `[CREATED] ${plan.title} created with Product(${product.id}) & Price(${stripePrice.id})`,
      );
    }
  }
}
