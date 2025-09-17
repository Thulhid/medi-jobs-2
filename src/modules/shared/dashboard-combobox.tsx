import {Popover, PopoverContent, PopoverTrigger,} from "@/modules/ui/components/popover";
import {Button} from "@/modules/ui/components/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/modules/ui/components/command";
import {cn} from "@/lib/utils";
import * as React from "react";

type Options = {
    label: string;
    value: string;
};

interface Props {
    options: Options[];
    name: string;
    onChange: (value: string) => void;
    value: string;
    label?: string;
}

export const DashboardCombobox = ({
                                      options,
                                      name,
                                      value,
                                      label,
                                      onChange,
                                  }: Props) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={"w-full text-start"}>
            <Popover open={open} onOpenChange={setOpen}>
                {label && <p className={"text-sm capitalize mb-1 ml-1"}>Select {label}: </p>}
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full text-xs lg:text-sm h-10 font-light justify-between capitalize"
                    >
                        {value
                            ? options.find((option) => option.value === value)?.label
                            : `Select ${name}`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder={`Search ${name}`}/>
                        <CommandList>
                            <CommandEmpty>No {name} found.</CommandEmpty>
                            <CommandGroup className="capitalize">
                                {options?.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};
