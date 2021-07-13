import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    name: string;
    label: string;
    textarea?: boolean;
  };

export const InputField: React.FC<Props> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {textarea ? (
        <Textarea
          {...field}
          {...props}
          id={field.name}
          placeholder={props.placeholder}
        />
      ) : (
        <Input
          {...field}
          {...props}
          id={field.name}
          placeholder={props.placeholder}
        />
      )}

      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
