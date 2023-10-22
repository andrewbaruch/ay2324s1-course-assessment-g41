import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { MultiValue, OptionBase, Select } from "chakra-react-select";
import { Control, useController, FieldValues } from "react-hook-form";

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

interface ControlledSelectProps {
  control: Control<FieldValues>;
  name: string;
  id: string;
  label: string;
  rules?: object;
  options: OptionType[];
  placeholder?: string;
  isMulti?: boolean;
}

const ControlledSelect: React.FC<ControlledSelectProps> = ({
  control,
  name,
  id,
  label,
  rules,
  options,
  ...props
}) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <FormControl isInvalid={invalid} id={id}>
      <FormLabel>{label}</FormLabel>
      <Select
        name={name}
        ref={ref}
        // onBlur={onBlur}
        options={options}
        value={options && value ? options.find((option) => option.value === value) : null}
        onChange={(option) => {
          if (Array.isArray(option)) {
            // This is multi-select mode
            // Apply logic for handling multiple values
            const values = option.map((o: OptionType) => o.value);
            onChange(values);
          } else if (option && "value" in option) {
            // This is single-select mode
            // Added a type check for option, to make sure it's not a MultiValue
            onChange(option.value);
          } else {
            // The select was cleared
            onChange(null);
          }
        }}
        {...props}
      />
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

export default ControlledSelect;
