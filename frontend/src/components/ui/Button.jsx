import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  ...props 
}) => {
  // Style "Nike" : massif, bords francs ou très peu arrondis, texte en gras
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wide uppercase transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variants = {
    primary: 'bg-brand-black text-white hover:bg-gray-800',
    accent: 'bg-brand-red text-white hover:bg-red-700',
    outline: 'border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white',
    ghost: 'bg-transparent text-brand-black hover:bg-brand-light'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
