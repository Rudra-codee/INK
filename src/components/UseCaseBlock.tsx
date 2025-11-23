interface UseCaseBlockProps {
  title: string;
  description: string;
}

export const UseCaseBlock = ({ title, description }: UseCaseBlockProps) => {
  return (
    <div className="border-l-[3px] border-primary pl-8 py-6 transition-all duration-200 ease-smooth hover:border-l-[4px]">
      <h3 className="mb-2 text-2xl font-semibold text-foreground">{title}</h3>
      <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
};
