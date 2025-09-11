// jest.setup.js
jest.mock('expo-auth-session', () => ({
  ...jest.requireActual('expo-auth-session'),
  makeRedirectUri: jest.fn(() => 'mocked-redirect-uri'),
}));

jest.mock('expo-linking', () => ({
  ...jest.requireActual('expo-linking'),
  createURL: jest.fn(() => 'mocked-url'),
}));
