// src/components/Input.tsx
import type { ComponentProps } from 'react';

type InputProps = {
  label: string;
  id: string;
} & ComponentProps<'input'>; // This combines our props with all standard input props like 'type', 'placeholder', etc.

const Input = ({ label, id, ...props }: InputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={id}
        className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500"
        {...props}
      />
    </div>
  );
};

export default Input;