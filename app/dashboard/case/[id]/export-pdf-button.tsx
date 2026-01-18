'use client';

import { Button } from "@/app/components/ui/button";
import { Download, Printer } from "lucide-react";

export function ExportPDFButton() {
    return (
        <Button
            variant="outline"
            className="gap-2 text-slate-600 print:hidden bg-white"
            onClick={() => window.print()}
        >
            <Printer className="w-4 h-4" /> Export / Print
        </Button>
    );
}
