import classNames from 'classnames';
import React from 'react';
import styles from './button.module.css';

type Variant = 'filled' | 'outlined';

type ButtonProps = {
  onClick: () => void,
  disabled?: false,
  variant?: Variant,
  className?: string,
  children?: React.ReactNode;
}

const getVariantClassName = (variant: Variant) => {
  switch (variant) {
    case 'filled':
      return styles.filled;
    case 'outlined':
      return styles.outlined;
  }
};

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled=false,
  variant='filled',
  className='',
  children,
}) => (
  <button
      className={classNames(styles.button, getVariantClassName(variant), className)}
      onClick={onClick}
      disabled={disabled}
  >
    { children }
  </button>
);
