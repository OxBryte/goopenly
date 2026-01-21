import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
