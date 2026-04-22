/**
 * @vitest-environment jsdom
 */
import { renderDOM } from './helpers.js';
import { describe, it, expect, beforeEach } from 'vitest';

let document;

// helper
const getByText = (document, text) => {
  return [...document.querySelectorAll('*')]
    .find(el => el.textContent?.includes(text));
};

describe('buddy.html', () => {
  beforeEach(async () => {
    document = await renderDOM('./Frontend/buddy.html');
  });

  it('has a navbar', () => {
    const nav = document.querySelector('.navbar');
    expect(nav).toBeTruthy();
  });

  it('has navigation links', () => {
    expect(getByText(document, 'Home')).toBeTruthy();
    expect(getByText(document, 'Chat with Buddy')).toBeTruthy();
    expect(getByText(document, 'Help Center')).toBeTruthy();
    expect(getByText(document, 'Browse Benefits')).toBeTruthy();
    expect(getByText(document, 'About Us')).toBeTruthy();
  });

  it('has left panel buttons', () => {
    expect(getByText(document, '+ New Chat')).toBeTruthy();
    expect(getByText(document, 'View History')).toBeTruthy();
    expect(getByText(document, 'Download Chat')).toBeTruthy();
  });

  it('has history box', () => {
    const history = document.querySelector('#historyBox');
    expect(history).toBeTruthy();
  });

  it('has chat container', () => {
    const chatBox = document.querySelector('#chatBox');
    expect(chatBox).toBeTruthy();
  });

  it('displays welcome message', () => {
    expect(getByText(document, 'Hello')).toBeTruthy();
    expect(getByText(document, 'How can I assist you today')).toBeTruthy();
  });

  it('has message input textarea', () => {
    const input = document.querySelector('#messageInput');
    expect(input).toBeTruthy();
    expect(input.placeholder).toContain('Message Benefit Buddy');
  });

  it('has send button', () => {
    const btn = document.querySelector('.send-btn');
    expect(btn).toBeTruthy();
  });

  it('has profile dropdown options', () => {
    expect(getByText(document, 'Login')).toBeTruthy();
    expect(getByText(document, 'Add new account')).toBeTruthy();
    expect(getByText(document, 'Settings')).toBeTruthy();
    expect(getByText(document, 'Logout')).toBeTruthy();
  });
});