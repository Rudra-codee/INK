import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColorPickerProps {
    currentColor?: string;
    onChange: (color: string) => void;
    type?: 'text' | 'highlight';
}

const TEXT_COLORS = [
    { name: 'Black', value: '#0A0A0A' },
    { name: 'Blue Ink', value: '#0057D8' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Orange', value: '#EA580C' },
    { name: 'Purple', value: '#9333EA' },
    { name: 'Gray', value: '#6B7280' },
];

const HIGHLIGHT_COLORS = [
    { name: 'None', value: 'transparent' },
    { name: 'Yellow', value: '#FEF08A' },
    { name: 'Blue', value: '#BFDBFE' },
    { name: 'Green', value: '#BBF7D0' },
    { name: 'Red', value: '#FECACA' },
    { name: 'Purple', value: '#E9D5FF' },
    { name: 'Orange', value: '#FED7AA' },
];

export const ColorPicker = ({ currentColor, onChange, type = 'text' }: ColorPickerProps) => {
    const colors = type === 'text' ? TEXT_COLORS : HIGHLIGHT_COLORS;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-md hover:bg-primary/10 hover:text-primary transition-all"
                    title={type === 'text' ? 'Text Color' : 'Highlight Color'}
                >
                    <Palette className="h-4 w-4" />
                    <div
                        className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: currentColor || (type === 'text' ? '#000000' : 'transparent') }}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="p-2 min-w-[170px]">
                <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => onChange(color.value)}
                            className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 ${currentColor === color.value ? 'border-primary' : 'border-gray-200'
                                }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
