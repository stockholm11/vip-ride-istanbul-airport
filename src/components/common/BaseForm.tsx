import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Define possible field value types
export type FieldValue = string | number | boolean | null;

export interface BaseFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'time' | 'select' | 'number' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  icon?: ReactNode;
}

export interface BaseFormProps {
  fields: BaseFormField[];
  onSubmit: (data: Record<string, FieldValue>) => void;
  onChange?: (name: string, value: FieldValue) => void;
  initialValues?: Record<string, FieldValue>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

/**
 * A reusable base form component that can be extended for different form types
 */
export default function BaseForm({
  fields,
  onSubmit,
  onChange,
  initialValues = {},
  submitLabel = 'Submit',
  cancelLabel,
  onCancel,
  isSubmitting = false,
  className = '',
}: BaseFormProps) {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Collect form data
    const formData: Record<string, FieldValue> = {};
    const form = e.target as HTMLFormElement;

    fields.forEach(field => {
      const element = form.elements.namedItem(field.name) as HTMLInputElement;

      if (field.type === 'checkbox') {
        formData[field.name] = element.checked;
      } else if (field.type === 'number') {
        formData[field.name] = element.value ? Number(element.value) : null;
      } else {
        formData[field.name] = element.value;
      }
    });

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    const checkbox = e.target as HTMLInputElement;

    if (onChange) {
      onChange(
        name,
        type === 'checkbox' ? checkbox.checked :
        type === 'number' ? (value ? Number(value) : null) :
        value
      );
    }
  };

  const renderField = (field: BaseFormField) => {
    const { name, label, type, placeholder, required, options, min, max, icon } = field;
    const value = initialValues[name] !== undefined ? initialValues[name] : '';

    const fieldClassName = "w-full px-4 py-2 border border-gray-300 rounded-md focus:border-secondary focus:outline-none transition-colors";

    return (
      <div key={name} className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}

          {type === 'textarea' ? (
            <textarea
              id={name}
              name={name}
              defaultValue={value as string}
              placeholder={placeholder}
              required={required}
              onChange={handleChange}
              className={`${fieldClassName} ${icon ? 'pl-10' : ''}`}
              rows={4}
            />
          ) : type === 'select' ? (
            <select
              id={name}
              name={name}
              defaultValue={value as string}
              required={required}
              onChange={handleChange}
              className={`${fieldClassName} ${icon ? 'pl-10' : ''}`}
            >
              <option value="">{placeholder || `${t('form.select')}...`}</option>
              {options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'checkbox' ? (
            <div className="flex items-center">
              <input
                id={name}
                name={name}
                type="checkbox"
                defaultChecked={value as boolean}
                onChange={handleChange}
                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
              />
              <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
                {placeholder}
              </label>
            </div>
          ) : (
            <input
              id={name}
              name={name}
              type={type}
              defaultValue={value as string}
              placeholder={placeholder}
              required={required}
              min={min}
              max={max}
              onChange={handleChange}
              className={`${fieldClassName} ${icon ? 'pl-10' : ''}`}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        {fields.map(renderField)}
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        {cancelLabel && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
        >
          {isSubmitting ? `${t('form.submitting')}...` : submitLabel}
        </button>
      </div>
    </form>
  );
}
