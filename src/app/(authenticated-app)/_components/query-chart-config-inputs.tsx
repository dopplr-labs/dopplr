import { Control } from 'react-hook-form'
import { match } from 'ts-pattern'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { QueryChartConfigInput } from '@/types/query-chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

type QueryChartConfigInputsProps = {
  inputs: QueryChartConfigInput[]
  control: Control<any>
  columns: string[]
}

export default function QueryChartConfigInputs({ inputs, control, columns }: QueryChartConfigInputsProps) {
  return inputs.map((input) => (
    <FormField
      key={input.key}
      control={control}
      name={input.key}
      render={({ field }) => (
        <FormItem>
          {input.type !== 'boolean' ? <FormLabel>{input.label}</FormLabel> : null}
          <FormControl>
            {match(input)
              .returnType<React.ReactNode>()
              .with({ type: 'col-select' }, ({ label }) => {
                return (
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              })
              .with({ type: 'boolean' }, ({ key, label, defaultValue }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    defaultChecked={defaultValue}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor={key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label}
                  </label>
                </div>
              ))
              .with({ type: 'select' }, ({ label, options, defaultValue }) => (
                <Select defaultValue={defaultValue} onValueChange={field.onChange} {...field}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))
              .with({ type: 'number' }, ({ label, defaultValue }) => (
                <Input type="number" placeholder={label} defaultValue={defaultValue} {...field} />
              ))
              .with({ type: 'slider' }, ({ min, max, step, defaultValue }) => (
                <Slider
                  {...field}
                  defaultValue={[defaultValue]}
                  min={min}
                  max={max}
                  step={step}
                  onValueChange={field.onChange}
                  value={Array.isArray(field.value) ? field.value : [field.value]}
                />
              ))
              .exhaustive()}
          </FormControl>
          <FormDescription>{input.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  ))
}
