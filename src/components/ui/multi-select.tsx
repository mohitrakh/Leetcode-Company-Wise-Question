"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface Option {
    label: string;
    value: string;
    count?: number;
}

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select items...",
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between border-gray-700 bg-gray-900 text-white hover:bg-gray-800 hover:text-white", className)}
                >
                    <div className="flex gap-1 flex-wrap truncate">
                        {selected.length === 0 && placeholder}
                        {selected.length > 0 && selected.length <= 2 && (
                            selected.map((val) => (
                                <Badge key={val} variant="secondary" className="mr-1 bg-gray-700 text-gray-200 hover:bg-gray-600">
                                    {options.find((opt) => opt.value === val)?.label || val}
                                </Badge>
                            ))
                        )}
                        {selected.length > 2 && (
                            <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                                {selected.length} selected
                            </Badge>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 border-gray-700 bg-gray-900 text-white">
                <Command className="bg-gray-900 text-white">
                    <CommandInput placeholder="Search..." className="border-gray-700" />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value} // Use value for filtering
                                    onSelect={() => handleSelect(option.value)}
                                    className="text-gray-200 aria-selected:bg-gray-800 aria-selected:text-white cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="flex-1 capitalize">{option.label}</span>
                                    {option.count !== undefined && (
                                        <span className="ml-2 text-xs text-gray-500">({option.count})</span>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
