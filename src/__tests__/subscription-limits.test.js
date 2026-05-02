const Subscription = require('../models/Subscription');

describe('Subscription Plan Limits', () => {
describe('TIERS', () => {
    it('should have free and freemium tiers defined', () => {
      expect(Subscription.TIERS.FREE).toBe('free');
      expect(Subscription.TIERS.FREEMIUM).toBe('freemium');
    });
  });

describe('FEATURES', () => {
    it('should have correct maxHistoryDays for each tier', () => {
      expect(Subscription.FEATURES.free.maxHistoryDays).toBe(3);
      expect(Subscription.FEATURES.freemium.maxHistoryDays).toBe(5);
    });

    it('should have different favorites limits', () => {
      expect(Subscription.FEATURES.free.maxFavorites).toBe(5);
      expect(Subscription.FEATURES.freemium.maxFavorites).toBe(8);
    });
  });

describe('UPGRADE_PATHS', () => {
    it('should allow free to upgrade to freemium', () => {
      const upgrades = Subscription.getAvailableUpgrades('free');
      expect(upgrades).toContain('freemium');
    });

    it('should not allow freemium to upgrade', () => {
      const upgrades = Subscription.getAvailableUpgrades('freemium');
      expect(upgrades).toHaveLength(0);
    });
  });

  describe('PRICING', () => {
    it('should have one-time prices for freemium', () => {
      expect(Subscription.PRICING.freemium.one_time).toBe(5.00);
    });
  });
});
