import React, { useState, KeyboardEvent } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface ApplicableFieldsInputProps {
  value: string[];
  onChange: (fields: string[]) => void;
  className?: string;
}

const POPULAR_SUGGESTIONS = [
  'Textiles',
  'Automotive',
  'Packaging',
  'Electronics',
  'Footwear',
  'Medical & Healthcare',
  'Woodworking & Furniture',
  'Construction'
];

export const ApplicableFieldsInput: React.FC<ApplicableFieldsInputProps> = ({
  value = [],
  onChange,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');

  const addFields = (rawInput: string) => {
    if (!rawInput.trim()) return;

    // Support comma or newline separated entries
    const newItems = rawInput
      .split(/[,;\n]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const updated = [...value];
    newItems.forEach(item => {
      // Case-insensitive duplicate prevention
      if (!updated.some(existing => existing.toLowerCase() === item.toLowerCase())) {
        updated.push(item);
      }
    });

    onChange(updated);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addFields(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeField(value.length - 1);
    }
  };

  const removeField = (indexToRemove: number) => {
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  const toggleSuggestion = (suggestion: string) => {
    const exists = value.some(item => item.toLowerCase() === suggestion.toLowerCase());
    if (exists) {
      onChange(value.filter(item => item.toLowerCase() !== suggestion.toLowerCase()));
    } else {
      onChange([...value, suggestion]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <Tag size={13} className="text-blue-600" />
          <span>Applicable Fields / Industries</span>
        </label>
        <span className="text-[11px] text-gray-400 font-medium">
          Type and press Enter or comma
        </span>
      </div>

      {/* Main Tag Box & Input Field */}
      <div className="w-full bg-white/70 border border-white/80 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 rounded-xl p-2.5 transition-all shadow-xs min-h-[50px] flex flex-wrap items-center gap-2">
        {value.map((field, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold shadow-2xs group animate-in fade-in zoom-in-95 duration-150"
          >
            <span>{field}</span>
            <button
              type="button"
              onClick={() => removeField(idx)}
              className="text-blue-400 hover:text-red-600 rounded-full hover:bg-blue-100/80 p-0.5 transition-colors cursor-pointer"
              title={`Remove ${field}`}
            >
              <X size={13} />
            </button>
          </span>
        ))}

        <div className="flex-1 min-w-[180px] flex items-center gap-1">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue.trim()) addFields(inputValue);
            }}
            placeholder={value.length === 0 ? "e.g., Textiles, Automotive, Packaging..." : "Add another industry..."}
            className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder-gray-400 py-1 px-1"
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => addFields(inputValue)}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <Plus size={12} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold text-gray-500">Quick Suggest:</p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SUGGESTIONS.map(suggestion => {
            const isSelected = value.some(v => v.toLowerCase() === suggestion.toLowerCase());
            return (
              <button
                type="button"
                key={suggestion}
                onClick={() => toggleSuggestion(suggestion)}
                className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white/80 hover:bg-gray-100 text-gray-600 border-gray-200/80'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}{suggestion}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
