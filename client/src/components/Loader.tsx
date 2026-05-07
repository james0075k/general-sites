interface Props {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export default function Loader({ size = "md", fullPage = false }: Props) {
  const spinner = (
    <div
      className={`${sizeMap[size]} animate-spin rounded-full border-2 border-border border-t-secondary`}
    />
  );
  if (fullPage) {
    return <div className="flex flex-1 items-center justify-center min-h-[60vh]">{spinner}</div>;
  }
  return spinner;
}
