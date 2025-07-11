import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Search, X } from 'lucide-react';
import { debounce } from '../../utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  onClear?: () => void;
  className?: string;
  size?: 'sm' | 'lg';
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  onClear,
  className = '',
  size,
}) => {
  const [inputValue, setInputValue] = useState(value);

  // Debounced onChange
  const debouncedOnChange = React.useMemo(
    () => debounce(onChange, debounceMs),
    [onChange, debounceMs]
  );

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    debouncedOnChange(inputValue);
  }, [inputValue, debouncedOnChange]);

  const handleClear = () => {
    setInputValue('');
    onChange('');
    onClear?.();
  };

  return (
    <div className={`search-input ${className}`}>
      <InputGroup size={size}>
        <InputGroup.Text className="bg-white border-end-0">
          <Search size={16} className="text-muted" />
        </InputGroup.Text>
        <Form.Control
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="border-start-0 ps-0"
        />
        {inputValue && (
          <InputGroup.Text 
            className="bg-white border-start-0 cursor-pointer" 
            onClick={handleClear}
          >
            <X size={16} className="text-muted" />
          </InputGroup.Text>
        )}
      </InputGroup>
    </div>
  );
};

export default SearchInput;