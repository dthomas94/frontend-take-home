import { Slot } from "radix-ui";
import { forwardRef } from "react";

type SearchInputProps = {
  icon?: any;
  button?: any;
  placeholder?: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ icon, button, ...inputProps }, ref) => {
    const { onChange, placeholder, name } = inputProps;
    return (
      <div className="SearchInput">
        <Slot.Slottable>{icon}</Slot.Slottable>
        <input
          ref={ref}
          type="text"
          placeholder={placeholder ?? "Search..."}
          onChange={onChange}
          name={name}
        />
        <Slot.Slottable>{button}</Slot.Slottable>
      </div>
    );
  }
);
