import { SubscriptionStatus, UserRole, UserStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  // ===== Auth =====
  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  googleId?: string;

  @Expose()
  phone?: string;

  // ===== Profile =====
  @Expose()
  name: string;

  @Expose()
  avatarUrl: string;

  // ===== Address =====
  @Expose()
  country?: string;

  @Expose()
  city?: string;

  @Expose()
  state?: string;

  @Expose()
  zip?: string;

  // ===== Settings =====
  @Expose()
  role: UserRole;

  @Expose()
  status: UserStatus;

  @Expose()
  isVerified: boolean;

  @Expose()
  stripeCustomerId?: string;

  // ===== Subscription overview =====
  @Expose()
  currentPlanId?: string;

  @Expose()
  currentPlanStatus?: SubscriptionStatus;

  // ===== Activity tracking =====
  @Expose()
  isLoggedIn: boolean;

  @Expose()
  lastLoginAt?: Date;

  @Expose()
  lastLogoutAt?: Date;

  @Expose()
  lastActiveAt?: Date;

  // ===== Meta =====
  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
