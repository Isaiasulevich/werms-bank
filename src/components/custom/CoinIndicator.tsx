interface CoinIndicatorProps {
  value: number;
  type: "bronze" | "silver" | "gold";
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

const COIN_STYLES = {
  bronze: {
    bg: "bg-gradient-to-br from-orange-200 to-orange-300",
    border: "border-orange-400",
    text: "text-orange-900",
    shadow: "shadow-orange-400/30"
  },
  silver: {
    bg: "bg-gradient-to-br from-gray-200 to-gray-300", 
    border: "border-gray-400",
    text: "text-gray-900",
    shadow: "shadow-gray-400/30"
  },
  gold: {
    bg: "bg-gradient-to-br from-yellow-200 to-yellow-400",
    border: "border-yellow-500", 
    text: "text-yellow-900",
    shadow: "shadow-yellow-400/30"
  }
} as const;

const COIN_SIZES = {
  xxs: "size-4",
  xs: "size-6",
  sm: "size-8", 
  md: "size-12",
  lg: "size-16",
  xl: "size-20"
} as const;

const COIN_VALUES = {
  bronze: 1,
  silver: 8,
  gold: 32
} as const;

export function CoinIndicator({ 
  value, 
  type, 
  size = "md", 
  animate = true 
}: CoinIndicatorProps) {
  const styles = COIN_STYLES[type];
  const sizeClass = COIN_SIZES[size];
  const coinValue = COIN_VALUES[type];
  const totalValue = value * coinValue;

  const containerClasses = animate 
    ? `coin-spinner ${sizeClass} ${styles.shadow}`
    : `${sizeClass} ${styles.shadow}`;
  
  const innerClasses = animate 
    ? "coin-3d-container relative size-full"
    : "relative size-full";

  return (
    <div 
      className={containerClasses}
      title={`${value} ${type} coins (${totalValue} werms)`}
    >
      <div className={innerClasses}>
        {/* Front face */}
        <div className={`
          coin-face coin-front
          ${styles.bg}
          border-2 ${styles.border}
          ${styles.text}
        `}>
        </div>
        
        {/* Back face */}
        <div className={`
          coin-face coin-back
          ${styles.bg}
          border-2 ${styles.border}
          ${styles.text}
        `}>
        </div>
        
        {/* Edge layers for 3D depth */}
        <div className={`coin-edge coin-face ${styles.bg} border-2 ${styles.border} ${styles.text}`}></div>
        <div className={`coin-edge coin-face ${styles.bg} border-2 ${styles.border} ${styles.text}`}></div>
        <div className={`coin-edge coin-face ${styles.bg} border-2 ${styles.border} ${styles.text}`}></div>
        <div className={`coin-edge coin-face ${styles.bg} border-2 ${styles.border} ${styles.text}`}></div>
        <div className={`coin-edge coin-face ${styles.bg} border-2 ${styles.border} ${styles.text}`}></div>
      </div>
    </div>
  );
}