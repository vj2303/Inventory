import { Eye, EyeClosed } from "lucide-react";
import { useRef, useState } from "react";

export default function Input({ field, register, errors, index, col }) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`${col === 6 ? "w-[48%]" : "w-full"}`} key={index}>
      <label
        htmlFor={field.name}
        className={`block text-sm font-medium mb-2 ${
          errors[field.name]
            ? "text-red-500"
            : isFocused
            ? "text-black"
            : "text-G400"
        }`}
      >
        {field.label}
      </label>
      <div
        className={`appearance-none border rounded w-full py-3 px-4 text-base leading-tight flex items-center ${
          errors[field.name]
            ? "border-red-500 text-red-500"
            : isFocused
            ? "border-black text-black"
            : "border-G400 text-G500"
        } focus-within:ring-2 focus-within:ring-opacity-50 focus-within:ring-blue-500`}
      >
        <input
          ref={inputRef}
          id={field.name}
          type={
            field.type === "password"
              ? isPasswordVisible
                ? "text"
                : "password"
              : field.type
          }
          className="outline-none w-full text-ellipsis overflow-hidden"
          placeholder={field.placeholder}
          {...register(field.name, field.validation)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {field.type === "password" && (
          <span
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="ml-2 flex-shrink-0 cursor-pointer"
          >
            {!isPasswordVisible ? <Eye size={20} /> : <EyeClosed size={20} />}
          </span>
        )}
      </div>
      {errors[field.name] && (
        <p className="text-red-500 text-xs mt-2">
          {errors[field.name].message}
        </p>
      )}
    </div>
  );
}