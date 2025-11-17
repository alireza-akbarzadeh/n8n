import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows loading state and prevents clicks', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button isLoading onClick={handleClick}>
        Loading
      </Button>
    );
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-state', 'loading');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    let button = screen.getByRole('button');
    expect(button.className).toContain('bg-destructive');

    rerender(<Button variant="outline">Cancel</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('outline');
  });

  it('applies size classes correctly', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-8');
  });

  it('defaults to button type', () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('allows custom type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
