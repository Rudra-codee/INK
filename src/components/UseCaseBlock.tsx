interface UseCaseBlockProps {
  title: string;
  description: string;
}

export const UseCaseBlock = ({ title, description }: UseCaseBlockProps) => {
  return (
    <div className="border-l-2 border-primary pl-6 py-4 transition-all duration-200 ease-smooth hover:border-l-[3px]">
      <h3 className="mb-1 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
