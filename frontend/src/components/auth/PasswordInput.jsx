import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function PasswordInput({
  value,
  onChange,
  placeholder="Password"
}) {

  const [showPassword,setShowPassword] =
    useState(false);


  return (
    <div className="relative">

      <input
        type={
          showPassword
          ? "text"
          : "password"
        }
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
        w-full rounded-lg
        border border-slate-300
        px-4 py-3 pr-12
        outline-none
        focus:border-blue-600
        focus:ring-2
        focus:ring-blue-100
        "
      />


      <button
        type="button"
        onClick={() =>
          setShowPassword(!showPassword)
        }
        className="
        absolute right-3
        top-1/2
        -translate-y-1/2
        text-slate-500
        "
      >

        {
          showPassword
          ?
          <EyeOff size={20}/>
          :
          <Eye size={20}/>
        }

      </button>


    </div>
  );
}


export default PasswordInput;