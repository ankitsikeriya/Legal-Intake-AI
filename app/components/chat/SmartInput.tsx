import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Send, Calendar, MapPin, Upload } from "lucide-react";
import React, { useState } from 'react';

type InputType = 'text' | 'date' | 'location' | 'yes_no' | 'file' | 'number';

interface SmartInputProps {
    inputType: InputType;
    onSend: (value: string) => void;
    disabled?: boolean;
    options?: string[];
}

export function SmartInput({ inputType, onSend, disabled, options }: SmartInputProps) {
    const [value, setValue] = useState('');

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (value.trim()) {
            onSend(value);
            setValue('');
        }
    };

    if (inputType === 'yes_no') {
        return (
            <div className="flex gap-4 w-full">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-14 text-lg border-2 hover:border-indigo-600 hover:bg-slate-50 transition-all rounded-xl"
                    onClick={() => onSend('Yes')}
                    disabled={disabled}
                >
                    Yes
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-14 text-lg border-2 hover:border-slate-400 hover:bg-slate-50 transition-all rounded-xl"
                    onClick={() => onSend('No')}
                    disabled={disabled}
                >
                    No
                </Button>
            </div>
        );
    }

    if (inputType === 'date') {
        return (
            <form onSubmit={handleSubmit} className="flex gap-2 w-full relative">
                <div className="relative flex-1">
                    <Input
                        type="date"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="h-14 pl-12 text-lg bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-xl w-full"
                        disabled={disabled}
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                </div>
                <Button
                    type="submit"
                    disabled={!value || disabled}
                    className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
                >
                    Confirm
                </Button>
            </form>
        );
    }

    if (inputType === 'location') {
        return (
            <form onSubmit={handleSubmit} className="flex gap-2 w-full relative">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="City, State"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="h-14 pl-12 text-lg bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-xl w-full"
                        disabled={disabled}
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                </div>
                <Button
                    type="submit"
                    disabled={!value || disabled}
                    className="h-14 w-14 p-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </form>
        );
    }

    // Default Text Input
    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full relative">
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type your answer..."
                className="h-14 pl-4 text-base bg-white border-slate-200 focus:border-indigo-600 rounded-xl w-full shadow-sm"
                disabled={disabled}
                autoFocus
            />
            <Button
                type="submit"
                disabled={disabled || !value.trim()}
                className="h-14 w-14 p-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
                <Send className="w-5 h-5" />
            </Button>
        </form>
    );
}
