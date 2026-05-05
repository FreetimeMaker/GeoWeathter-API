const User = require('../models/User');

describe('User Model', () => {
  describe('create', () => {
    test('should create a new user', async () => {
      const user = await User.create('test@example.com', 'password123', 'Test User');
      expect(user).toHaveProperty('id');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
    });

    test('should throw error for duplicate email', async () => {
      await User.create('duplicate@example.com', 'password123', 'User 1');
      await expect(
        User.create('duplicate@example.com', 'password123', 'User 2')
      ).rejects.toThrow('Email bereits registriert');
    });
  });

  describe('findByEmail', () => {
    test('should find user by email', async () => {
      await User.create('findme@example.com', 'password123', 'Find Me');
      const user = await User.findByEmail('findme@example.com');
      expect(user).toBeTruthy();
      expect(user.email).toBe('findme@example.com');
    });
  });

  describe('verifyPassword', () => {
    test('should verify correct password', async () => {
      const user = await User.create('verify@example.com', 'correctpassword', 'Verify User');
      const isValid = await User.verifyPassword('correctpassword', user.password);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const user = await User.create('wrong@example.com', 'correctpassword', 'Wrong User');
      const isValid = await User.verifyPassword('wrongpassword', user.password);
      expect(isValid).toBe(false);
    });
  });
});
