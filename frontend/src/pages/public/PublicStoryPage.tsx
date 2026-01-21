import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { storyRoomApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';
import { StoryViewer } from '@/components/rooms/StoryViewer';
import { CharacterList } from '@/components/rooms/CharacterList';

const PublicStoryPage = () => {
    const { slug } = useParams();
    const [story, setStory] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStory = async () => {
            try {
                if (!slug) return;
                const data = await storyRoomApi.getPublicStory(slug);
                setStory(data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load story');
            }
        };
        fetchStory();
    }, [slug]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <h1 className="text-2xl font-bold text-destructive">Oops!</h1>
                <p>{error}</p>
                <Link to="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        );
    }

    if (!story) {
        return <div className="p-10 text-center">Loading story...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
            {/* Header */}
            <header className="p-4 border-b bg-white dark:bg-zinc-950 sticky top-0 z-10 shadow-sm">
                <div className="container max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-2xl text-primary">
                        <Sparkles className="h-6 w-6" />
                        <span>Ink Relay</span>
                    </div>
                    <Link to="/rooms">
                        <Button>Create your own story <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                </div>
            </header>

            <main className="container max-w-5xl mx-auto p-4 md:p-10 space-y-8">
                <div className="text-center space-y-4 mb-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{story.title}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
                        "{story.basePlot}"
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 pt-4">
                        {story.members.map((m: any) => (
                            <span key={m.id} className="px-3 py-1 bg-secondary rounded-full text-sm font-medium">
                                {m.user.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <CharacterList characters={story.characters} />
                    </div>
                    <div className="lg:col-span-3">
                        <Card className="border-none shadow-lg bg-card">
                            <CardContent className="p-6 md:p-10">
                                <StoryViewer turns={story.turns} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <footer className="py-10 text-center text-muted-foreground border-t mt-10">
                <p>Created with Ink Relay</p>
            </footer>
        </div>
    );
};

export default PublicStoryPage;
