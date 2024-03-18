import React from "react";

const Input = React.forwardRef((props, ref) => {
  return (
    <div>
      <label htmlFor={props.input.id}>{props.label}</label>
      <input
        className="mx-2 text-center text-black border border-blue-950 bordered"
        ref={ref}
        {...props.input}
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;
