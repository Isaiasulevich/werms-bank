interface CoinIndicatorProps {
  value: number;
  type: "bronze" | "silver" | "gold";
}

const COIN_STYLES = {
  bronze: {
    bg: "bg-orange-100",
    border: "border-orange-300",
    text: "text-orange-900"
  },
  silver: {
    bg: "bg-gray-100", 
    border: "border-gray-300",
    text: "text-gray-900"
  },
  gold: {
    bg: "bg-yellow-100",
    border: "border-yellow-300", 
    text: "text-yellow-900"
  }
} as const;

const COIN_VALUES = {
  bronze: 1,
  silver: 8,
  gold: 32
} as const;

export function CoinIndicator({ value, type }: CoinIndicatorProps) {
  const styles = COIN_STYLES[type];
  const coinValue = COIN_VALUES[type];
  const totalValue = value * coinValue;

  return (
    <div 
      className={`
        flex items-center justify-center
        size-12 rounded-full
        ${styles.bg}
        border-2 ${styles.border}
        ${styles.text}
        font-bold
      `}
      title={`${value} ${type} coins (${totalValue} werms)`}
    >
      {value}
    </div>
  );
}