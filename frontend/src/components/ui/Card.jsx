const Card = ({ children, className = '', noPadding = false, ...props }) => {
  // Finis les ombres douces et les gros arrondis. 
  // Place à des blocs francs, un fond gris clair ou blanc avec une bordure fine.
  const baseStyles = 'bg-white border border-brand-border';
  
  return (
    <div className={`${baseStyles} ${!noPadding ? 'p-6 md:p-8' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
