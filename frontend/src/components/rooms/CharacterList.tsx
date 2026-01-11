import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon } from 'lucide-react';

interface Character {
    id?: string;
    name: string;
    description?: string | null;
}

interface CharacterListProps {
    characters: Character[];
}

export const CharacterList = ({ characters }: CharacterListProps) => {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Characters
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {characters.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No characters defined.</p>
                ) : (
                    characters.map((char, index) => (
                        <div key={char.id || index} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                            <h3 className="font-semibold text-sm">{char.name}</h3>
                            {char.description && (
                                <p className="text-xs text-muted-foreground mt-1">{char.description}</p>
                            )}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};
