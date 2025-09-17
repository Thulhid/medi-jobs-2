"use client";

import { useState, useEffect, useRef } from "react";
import { Command, CommandEmpty, CommandGroup,CommandItem, CommandList } from "@/modules/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/ui/components/popover";
import { cn } from "@/lib/utils";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  cities: string[];
  placeholder?: string;
  className?: string;
  name?: string;
  required?: boolean;
}

export function CityAutocomplete({
  value,
  onChange,
  cities,
  placeholder = "Enter city name...",
  className,
  name,
  required = false,
}: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to highlight matching text
  const highlightMatch = (city: string, searchTerm: string) => {
    if (!searchTerm) return city;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = city.split(regex);
    
    return (
      <span>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <span key={index} className="bg-yellow-200 font-semibold">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };
  const filteredCities = searchValue.length >= 1 
    ? cities.filter(city => 
        city.toLowerCase().includes(searchValue.toLowerCase())
      ).slice(0, 10) 
    : [];

 
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleInputChange = (newValue: string) => {
    setSearchValue(newValue);
    onChange(newValue);
    
  
    if (newValue.length >= 2 && filteredCities.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (selectedCity: string) => {
    setSearchValue(selectedCity);
    onChange(selectedCity);
    setOpen(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputFocus = () => {
    if (searchValue.length >= 2 && filteredCities.length > 0) {
      setOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Longer delay to allow for clicking on suggestions
    setTimeout(() => {
      setOpen(false);
      // If user typed something but didn't select from suggestions, keep the typed value
      if (searchValue.length >= 2 && !filteredCities.includes(searchValue)) {
        // Keep the user's input even if it's not in the suggestions
        onChange(searchValue);
      }
    }, 200);
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <input
              ref={inputRef}
              name={name}
              value={searchValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              required={required}
              className={cn(
                "w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                className
              )}
              autoComplete="off"
            />
            {searchValue.length >= 1 && searchValue.length < 2 && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-gray-400">
                  {2 - searchValue.length} more
                </span>
              </div>
            )}
          </div>
        </PopoverTrigger>
        
        {open && filteredCities.length > 0 && (
          <PopoverContent 
            className="w-full p-0 mt-1" 
            align="start"
            side="bottom"
            style={{ width: inputRef.current?.offsetWidth || 'auto' }}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command>
              <CommandList className="max-h-48">
                <CommandEmpty>No cities found.</CommandEmpty>
                <CommandGroup>
                  {filteredCities.map((city, index) => (
                    <CommandItem
                      key={index}
                      value={city}
                      onSelect={() => handleSelect(city)}
                      onMouseDown={(e) => {
                        // Prevent input blur when clicking on items
                        e.preventDefault();
                      }}
                      onClick={() => handleSelect(city)}
                      className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 px-3 py-2 text-sm border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium">{highlightMatch(city, searchValue)}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}