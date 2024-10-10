import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { makeVariantStyles } from './makeVariantStyles.styles';

vi.mock('@griffel/react', () => ({
  makeStyles: vi.fn(
    (styles) => () =>
      Object.keys(styles).reduce<Record<string, string>>((acc, key) => {
        acc[key] = key;
        return acc;
      }, {})
  ),

  mergeClasses: vi.fn((...args) => args.filter(Boolean).join(' ')),
}));

describe('makeVariantStyles', () => {
  it('should apply base styles', () => {
    const useStyles = makeVariantStyles({
      base: { color: 'red' },
      variants: {},
    });

    const TestComponent = () => {
      const styles = useStyles();
      return <div className={styles()}>Test</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText('Test')).toHaveClass('base');
  });

  it('should apply variant styles', () => {
    const useStyles = makeVariantStyles({
      base: {},
      variants: {
        color: {
          blue: { color: 'blue' },
          green: { color: 'green' },
        },
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '18px' },
        },
      },
    });

    const TestComponent = ({
      color,
      size,
    }: {
      color: 'blue' | 'green';
      size: 'small' | 'large';
    }) => {
      const styles = useStyles();
      return <div className={styles({ color, size })}>Test</div>;
    };

    const { rerender } = render(<TestComponent color="blue" size="small" />);
    expect(screen.getByText('Test')).toHaveClass('base color_blue size_small');

    rerender(<TestComponent color="green" size="large" />);
    expect(screen.getByText('Test')).toHaveClass('base color_green size_large');
  });

  it('should apply compound variant styles', () => {
    const useStyles = makeVariantStyles({
      base: {},
      variants: {
        color: {
          blue: { color: 'blue' },
          green: { color: 'green' },
        },
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '18px' },
        },
      },
      compoundVariants: [
        {
          variants: { color: 'blue', size: 'large' },
          style: { fontWeight: 'bold' },
        },
      ],
    });

    const TestComponent = ({
      color,
      size,
    }: {
      color: 'blue' | 'green';
      size: 'small' | 'large';
    }) => {
      const styles = useStyles();
      return <div className={styles({ color, size })}>Test</div>;
    };

    const { rerender } = render(<TestComponent color="blue" size="small" />);
    expect(screen.getByText('Test')).toHaveClass('base color_blue size_small');

    rerender(<TestComponent color="blue" size="large" />);
    expect(screen.getByText('Test')).toHaveClass(
      'base color_blue size_large blue_large'
    );
  });

  it('should apply default variants', () => {
    const useStyles = makeVariantStyles({
      base: {},
      variants: {
        color: {
          blue: { color: 'blue' },
          green: { color: 'green' },
        },
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '18px' },
        },
      },
      defaultVariants: {
        color: 'blue',
        size: 'small',
      },
    });

    const TestComponent = () => {
      const styles = useStyles();
      return <div className={styles()}>Test</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText('Test')).toHaveClass('base color_blue size_small');
  });
});
