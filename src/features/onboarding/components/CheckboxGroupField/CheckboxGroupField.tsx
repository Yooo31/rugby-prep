"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Option } from "@/features/onboarding/labels";

type CheckboxGroupFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: Option[];
};

export function CheckboxGroupField<T extends FieldValues>({
  control,
  name,
  label,
  options,
}: CheckboxGroupFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const values = (field.value ?? []) as string[];
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="grid grid-cols-2 gap-2">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 text-sm font-normal"
                >
                  <Checkbox
                    checked={values.includes(option.value)}
                    onCheckedChange={(checked) => {
                      field.onChange(
                        checked
                          ? [...values, option.value]
                          : values.filter((v) => v !== option.value),
                      );
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
