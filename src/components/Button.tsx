import { ReactNode } from 'react'


interface ButtonProps {
    variant: 'dark' | 'border';
    children: ReactNode;
  }

  const Button: React.FC<ButtonProps> = ({ variant, children }) => {

    const baseStyle = "font-fira-sans text-white rounded-md p-4 mb-4 w-full block transition duration-300 ease-in-out transform"
    const variants={
        dark: "bg-primary-400 font-bold hover:bg-secondary-700",
        border:"bg-none border border-white hover:bg-secondary-600",
    }

    const variantClasses = variants[variant] || "bg-gray-200 hover:bg-gray-400"

  return (
    <button className={`${baseStyle} ${variantClasses}`}>
            {children}
        </button>
  )
}

export default Button