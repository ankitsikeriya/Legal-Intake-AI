'use client';

import dynamic from 'next/dynamic';
import { Button } from "@/app/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { HandoffDocument } from './HandoffDocument';

const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => (
            <Button disabled className="bg-indigo-600 opacity-50">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading PDF...
            </Button>
        ),
    }
);

interface DownloadButtonProps {
    data: {
        summary: any;
        timeline: any[];
        redFlags: any[];
    }
}

export function DownloadButton({ data }: DownloadButtonProps) {
    return (
        <PDFDownloadLink
            document={<HandoffDocument {...data} />}
            fileName={`handoff-pack-${data.summary.client.replace(/\s+/g, '_')}.pdf`}
        >
            {/* 
        // @ts-ignore - PDFDownloadLink children support matching roughly
      */}
            {({ blob, url, loading, error }) => (
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                    {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Generating PDF...' : 'Export Handoff Pack (PDF)'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
