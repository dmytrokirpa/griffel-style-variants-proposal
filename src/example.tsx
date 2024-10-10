import * as React from 'react';
import { makeStyles, mergeClasses } from '@fluentui/react-components';
import { makeVariantStyles, VariantProps } from './makeVariantStyles.styles';

/// ----------------EXISTING-API-------------------------

const useButtonStyles = makeStyles({
  base: {
    padding: '0.25rem',
    border: 'none',
    borderRadius: '0.5rem',
    margin: '1rem',
    cursor: 'pointer',
  },
  default: {
    backgroundColor: 'gray',
  },
  primary: {
    backgroundColor: 'blue',
    color: 'white',
    ':hover': {
      backgroundColor: 'darkblue',
    },
  },
  small: {
    fontSize: '0.75rem',
  },
  large: {
    fontSize: '1.25rem',
  },
  primaryLarge: {
    padding: '0.75rem',
  },
  primarySmall: {
    padding: '0.25rem',
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
});

type Props = {
  disabled?: boolean;
  primary?: boolean;
  size?: 'small' | 'large';
};

const RegularButton = ({
  disabled = false,
  primary = true,
  size = 'large',
}: Props) => {
  const styles = useButtonStyles();

  return (
    <button
      className={mergeClasses(
        styles.base,
        primary ? styles.primary : styles.default,
        size === 'small' && primary && styles.primarySmall,
        size === 'large' && primary && styles.primaryLarge,
        disabled && styles.disabled
      )}
      disabled={disabled}
    >
      Button created with existing API
    </button>
  );
};

/// ----------------PROPOSED-API-------------------------

const useButtonVariantStyles = makeVariantStyles({
  base: {
    padding: '0.25rem',
    border: 'none',
    borderRadius: '0.5rem',
    margin: '1rem',
    cursor: 'pointer',
  },
  variants: {
    primary: {
      true: {
        backgroundColor: 'blue',
        color: 'white',
        ':hover': {
          backgroundColor: 'darkblue',
        },
      },
      false: {
        backgroundColor: 'gray',
      },
    },
    size: {
      small: {
        fontSize: '0.75rem',
      },
      large: {
        padding: '0.5rem',
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
  },
  compoundVariants: [
    {
      variants: { primary: true, size: 'small' },
      style: { padding: '0.25rem' },
    },
    {
      variants: { primary: true, size: 'large' },
      style: { padding: '0.75rem' },
    },
  ],
});

type ButtonVariantProps = VariantProps<typeof useButtonVariantStyles>;

const ButtonWithVariants = ({
  disabled = false,
  primary = true,
  size = 'large',
}: ButtonVariantProps) => {
  const buttonStyles = useButtonVariantStyles();

  return (
    <button
      className={buttonStyles({ disabled, primary, size })}
      disabled={disabled}
    >
      Button created with NEW APIs
    </button>
  );
};

/// -------------------------------------------

export const Default = () => (
  <>
    <RegularButton primary size="large" />
    <ButtonWithVariants primary size="large" />
  </>
);
