import { db } from "@/lib/db";
import { caseLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card } from "@/app/components/ui/card";
import { History, User, Bot } from "lucide-react";

export async function AuditTrail({ caseId }: { caseId: number }) {
    const logs = await db
        .select()
        .from(caseLogs)
        .where(eq(caseLogs.caseId, caseId))
        .orderBy(desc(caseLogs.createdAt));

    return (
        <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-500" /> Audit Trail
            </h3>
            <div className="space-y-6 relative border-l-2 border-slate-100 ml-3">
                {logs.map((log, i) => (
                    <div key={i} className="pl-6 relative">
                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white ${log.actor === 'AI Assistant' ? 'border-indigo-500' : 'border-emerald-500'
                            }`}></div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                            <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                {log.actor === 'AI Assistant' ? <Bot className="w-3 h-3 text-indigo-500" /> : <User className="w-3 h-3 text-emerald-500" />}
                                {log.action.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                                {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Unknown'}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 inline-block">
                            {log.details}
                        </p>
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="pl-6 text-sm text-slate-400 italic">No activity recorded yet.</div>
                )}
            </div>
        </Card>
    );
}
