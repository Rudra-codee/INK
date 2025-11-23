import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group bg-card rounded-lg p-6 sm:p-8 shadow-light hover:shadow-card-hover transition-all duration-200 ease-smooth hover:-translate-y-1.5">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center">
        <Icon className="h-6 w-6 text-primary" strokeWidth={2} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
};
