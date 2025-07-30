

interface CoinIndicatorProps {
    value: number;
    label: string;
    type: "bronze" | "silver" | "gold";
    icon: React.ReactNode;
}

export function CoinIndicator({ value, label, type, icon }: CoinIndicatorProps) {
  return (
    <div>
        {type === "bronze" && (
                <div className="flex rounded-full items-center gap-2">
                    {icon}
                    <div className="text-sm text-muted-foreground">
                        <span className="font-bold">{value}</span> {label}
                    </div>
                </div>
        )}
        {type === "silver" && (
                <div className="flex rounded-full items-center gap-2">
                    {icon}  
                    <div className="text-sm text-muted-foreground">
                        <span className="font-bold">{value}</span> {label}
                    </div>
                </div>
        )}
        {type === "gold" && (
                <div className="flex rounded-full items-center gap-2">
                    {icon}
                    <div className="text-sm text-muted-foreground">
                        <span className="font-bold">{value}</span> {label}
                    </div>
                </div>
        )}
    </div>
  )
}