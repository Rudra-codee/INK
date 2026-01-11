import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { RoomHeader } from '@/components/rooms/RoomHeader';
import { StoryViewer } from '@/components/rooms/StoryViewer';
import { TurnEditor } from '@/components/rooms/TurnEditor';
import { TurnTimer } from '@/components/rooms/TurnTimer';
import { MemberList } from '@/components/rooms/MemberList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SkipForward, CheckCircle } from 'lucide-react';

const RoomPlayPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { accessToken, user } = useAuth();

    const [room, setRoom] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchRoom = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/story-rooms/${roomId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setRoom(response.data);
        } catch (error) {
            console.error('Fetch room error:', error);
        }
    };

    useEffect(() => {
        if (accessToken && roomId) {
            fetchRoom();
            const interval = setInterval(fetchRoom, 2000);
            return () => clearInterval(interval);
        }
    }, [accessToken, roomId]);

    useEffect(() => {
        if (room?.status === 'finished') {
            navigate(`/rooms/${roomId}/result`);
        }
    }, [room?.status, roomId, navigate]);

    const handleSubmitTurn = async (content: string) => {
        try {
            setIsSubmitting(true);
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/story-rooms/${roomId}/turn`,
                { content },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            toast.success('Turn submitted!');
            fetchRoom(); // refresh immediately
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to submit turn');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkipTurn = async () => {
        try {
            if (!confirm('Are you sure you want to skip the current writer?')) return;
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/story-rooms/${roomId}/skip`,
                {},
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            toast.info('Turn skipped');
            fetchRoom();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to skip');
        }
    };

    const handleFinishRoom = async () => {
        try {
            if (!confirm('Are you sure you want to finish the story now?')) return;
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/story-rooms/${roomId}/finish`,
                {},
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            toast.success('Story finished!');
            fetchRoom();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to finish story');
        }
    };

    if (!room) return <div className="p-8">Loading room...</div>;

    // Logic to determine current writer
    // Writers are filtered from members
    const writers = room.members
        .filter((m: any) => ['LEADER', 'WRITER'].includes(m.role))
        .sort((a: any, b: any) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());

    const currentWriterIndex = room.currentTurnIndex % writers.length;
    const currentWriter = writers[currentWriterIndex];
    const isMyTurn = currentWriter?.user.id === user?.id;
    const isLeader = room.members.find((m: any) => m.user.id === user?.id)?.role === 'LEADER';

    return (
        <div className="flex flex-col h-screen bg-background">
            <RoomHeader title={room.title} roomStatus={room.status} />

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content: Story & Editor */}
                <div className="flex-1 flex flex-col min-w-0 border-r border-border">
                    <div className="p-4 flex-1 overflow-hidden flex flex-col">
                        <StoryViewer turns={room.turns} />
                    </div>

                    {/* Turn Action Area */}
                    <div className="bg-card">
                        {/* Timer Bar */}
                        <div className="px-4 py-2 bg-secondary/10 border-t border-border">
                            <TurnTimer endsAt={room.turnEndsAt} totalDurationSec={room.turnTimeLimit} />
                        </div>

                        {isMyTurn ? (
                            <TurnEditor
                                onSubmit={handleSubmitTurn}
                                wordLimit={room.wordLimit}
                                isSubmitting={isSubmitting}
                            />
                        ) : (
                            <div className="p-6 text-center border-t border-border bg-secondary/20">
                                <p className="text-muted-foreground animate-pulse mb-2">
                                    Waiting for {currentWriter?.user.name || 'writer'} to finish their turn...
                                </p>
                                {isLeader && (
                                    <div className="flex gap-2 justify-center">
                                        <Button variant="outline" size="sm" onClick={handleSkipTurn}>
                                            <SkipForward className="h-4 w-4 mr-2" /> Skip Turn
                                        </Button>
                                        <Button variant="default" size="sm" onClick={handleFinishRoom}>
                                            <CheckCircle className="h-4 w-4 mr-2" /> Finish Story
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Info */}
                <div className="w-80 hidden md:block p-4 space-y-4 overflow-y-auto bg-secondary/5">
                    <MemberList members={room.members} currentWriterId={currentWriter?.user.id} />

                    <div className="border rounded-lg p-4 bg-card">
                        <h4 className="font-semibold mb-2 text-sm">Game Stats</h4>
                        <div className="text-sm space-y-1 text-muted-foreground">
                            <p>Turn: {room.currentTurnIndex + 1} / {room.totalTurns}</p>
                            <p>Word Limit: {room.wordLimit}</p>
                            <p>Time Limit: {room.turnTimeLimit}s</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomPlayPage;
