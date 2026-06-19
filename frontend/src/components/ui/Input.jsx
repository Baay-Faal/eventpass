import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-3 bg-brand-light border-b-2 rounded-none focus:outline-none transition-colors
          ${error 
            ? 'border-brand-error text-brand-error bg-red-50 focus:border-brand-error' 
            : 'border-transparent focus:border-brand-black focus:bg-white'
          }
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm font-medium text-brand-error">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
