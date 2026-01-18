'use client';

import { useState } from 'react';
import { createCase } from '@/app/actions/cases';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Plus } from "lucide-react";

export function CreateCaseForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        const res = await createCase(formData);
        setIsLoading(false);
        if (res.success) {
            setIsOpen(false);
            // Optional: Show toast
        } else {
            console.error(res.error);
        }
    }

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Plus size={18} />
                New Intake
            </Button>
        );
    }

    return (
        <Card className="p-4 mb-6 border-indigo-100 bg-indigo-50/50">
            <h3 className="font-semibold mb-3 text-indigo-900">Create New Client Intake</h3>
            <form action={onSubmit} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-slate-700">Client Name</label>
                    <Input name="clientName" placeholder="e.g. John Doe" required />
                </div>
                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email (Optional)</label>
                    <Input name="email" type="email" placeholder="client@example.com" />
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-indigo-600 text-white">
                        {isLoading ? 'Creating...' : 'Create Link'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
