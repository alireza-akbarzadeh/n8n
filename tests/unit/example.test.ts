import { describe, it, expect } from 'vitest';

describe('Example Utils Test', () => {
  it('adds two numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('handles string operations', () => {
    const text = 'Hello World';
    expect(text.toLowerCase()).toBe('hello world');
    expect(text).toHaveLength(11);
  });

  it('works with arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });
});
