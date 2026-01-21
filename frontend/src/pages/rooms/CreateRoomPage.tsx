import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoomHeader } from '@/components/rooms/RoomHeader';
import { Plus, Trash, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { storyRoomApi } from '@/lib/api';
import { toast } from 'sonner';

interface Character {
    name: string;
    description: string;
}

const CreateRoomPage = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        basePlot: '',
        turnTimeLimit: 60,
        wordLimit: 100,
        totalTurns: 20,
    });

    const [characters, setCharacters] = useState<Character[]>([
        { name: '', description: '' },
    ]);

    const handleCharacterChange = (index: number, field: 'name' | 'description', value: string) => {
        const newChars = [...characters];
        newChars[index][field] = value;
        setCharacters(newChars);
    };

    const addCharacter = () => {
        setCharacters([...characters, { name: '', description: '' }]);
    };

    const removeCharacter = (index: number) => {
        const newChars = characters.filter((_, i) => i !== index);
        setCharacters(newChars);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;

        const validCharacters = characters.filter((c) => c.name.trim() !== '');

        try {
            setLoading(true);
            const payload = {
                ...formData,
                characters: validCharacters,
                turnTimeSec: formData.turnTimeLimit, // mapping for backend
            };

            const response = await storyRoomApi.create(payload, accessToken);

            toast.success('Room created successfully!');
            navigate(`/rooms/${response.id}/lobby`);
        } catch (error: any) {
            console.error("Create room error", error)
            toast.error(error.response?.data?.error || 'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <RoomHeader title="Create New Story Room" />

            <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Room Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Room Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Room Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. The Mystery of the Lost Key"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="plot">Base Plot / Premise</Label>
                                <Textarea
                                    id="plot"
                                    value={formData.basePlot}
                                    onChange={(e) => setFormData({ ...formData, basePlot: e.target.value })}
                                    placeholder="Set the scene..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rules */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Game Rules</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="turnTime">Turn Timer (sec)</Label>
                                <Input
                                    id="turnTime"
                                    type="number"
                                    min="30"
                                    value={formData.turnTimeLimit}
                                    onChange={(e) => setFormData({ ...formData, turnTimeLimit: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="wordLimit">Word Limit / Turn</Label>
                                <Input
                                    id="wordLimit"
                                    type="number"
                                    min="20"
                                    value={formData.wordLimit}
                                    onChange={(e) => setFormData({ ...formData, wordLimit: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalTurns">Total Turns</Label>
                                <Input
                                    id="totalTurns"
                                    type="number"
                                    min="5"
                                    value={formData.totalTurns}
                                    onChange={(e) => setFormData({ ...formData, totalTurns: parseInt(e.target.value) })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Characters */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Characters</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={addCharacter}>
                                <Plus className="h-4 w-4 mr-1" /> Add Character
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {characters.map((char, index) => (
                                <div key={index} className="flex gap-4 items-start border p-3 rounded-md bg-secondary/10">
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            placeholder="Character Name"
                                            value={char.name}
                                            onChange={(e) => handleCharacterChange(index, 'name', e.target.value)}
                                        />
                                        <Input
                                            placeholder="Short Description (Optional)"
                                            value={char.description}
                                            onChange={(e) => handleCharacterChange(index, 'description', e.target.value)}
                                        />
                                    </div>
                                    {characters.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => removeCharacter(index)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Room'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomPage;
