import { Provider } from '@angular/core';
import { environment } from '../../../environments/environment';

// Real services
import { VictimService } from './api/victim.service';
import { AttemptService } from './api/attempt.service';
import { ReportService } from './api/report.service';
import { RewardService } from './api/reward.service';
import { ContentService } from './api/content.service';
import { UserService } from './api/user.service';

// Mock services
import { MockVictimService } from './mock/mock-victim.service';
import { MockAttemptService } from './mock/mock-attempt.service';
import { MockReportService } from './mock/mock-report.service';
import { MockRewardService } from './mock/mock-reward.service';
import { MockContentService } from './mock/mock-content.service';
import { MockAuthService } from './mock/mock-auth.service';

/**
 * Why: Creates Angular providers that switch between mock/real implementations
 *
 * How it works:
 * 1. Components inject VictimService (for example)
 * 2. Angular DI checks which provider to use
 * 3. If useMockServices=true, provides MockVictimService
 * 4. If useMockServices=false, provides real VictimService
 *
 * This is the Dependency Injection pattern - components don't care about implementation
 */

/**
 * Victim Service Provider
 * Why useClass: Tells Angular "when someone asks for VictimService, give them MockVictimService instead"
 */
export const provideVictimService = (): Provider => ({
  provide: VictimService,
  useClass: environment.useMockServices ? MockVictimService : VictimService
});

/**
 * Attempt Service Provider
 */
export const provideAttemptService = (): Provider => ({
  provide: AttemptService,
  useClass: environment.useMockServices ? MockAttemptService : AttemptService
});

/**
 * Report Service Provider
 */
export const provideReportService = (): Provider => ({
  provide: ReportService,
  useClass: environment.useMockServices ? MockReportService : ReportService
});

/**
 * Reward Service Provider
 */
export const provideRewardService = (): Provider => ({
  provide: RewardService,
  useClass: environment.useMockServices ? MockRewardService : RewardService
});

/**
 * Content Service Provider
 */
export const provideContentService = (): Provider => ({
  provide: ContentService,
  useClass: environment.useMockServices ? MockContentService : ContentService
});

/**
 * User Service Provider
 */
export const provideUserService = (): Provider => ({
  provide: UserService,
  useClass: environment.useMockServices ? UserService : UserService
});

/**
 * Auth Service Provider
 * Why special: Auth service needs mock for login, but uses same AuthService class
 * We inject MockAuthService into AuthService when in mock mode
 */
export const provideAuthMock = (): Provider => ({
  provide: 'AUTH_BACKEND',
  useClass: environment.useMockServices ? MockAuthService : Object
});

/**
 * Helper function: Get all service providers at once
 * Why: Convenient way to register all services in app.config.ts
 */
export function provideAppServices(): Provider[] {
  return [
    provideVictimService(),
    provideAttemptService(),
    provideReportService(),
    provideRewardService(),
    provideContentService(),
    provideUserService(),
    provideAuthMock()
  ];
}
