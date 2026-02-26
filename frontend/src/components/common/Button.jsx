const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-dapur-orange text-white hover:bg-orange-600 shadow-orange-100',
    secondary: 'bg-orange-50 text-dapur-orange hover:bg-orange-100',
    outline: 'border-2 border-dapur-orange text-dapur-orange hover:bg-orange-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button 
      className={`px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;