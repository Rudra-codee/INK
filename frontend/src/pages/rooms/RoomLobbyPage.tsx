import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storyRoomApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { RoomHeader } from '@/components/rooms/RoomHeader';
import { InviteRoomModal } from '@/components/rooms/InviteRoomModal';
import { CharacterList } from '@/components/rooms/CharacterList';
import { MemberList } from '@/components/rooms/MemberList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

const RoomLobbyPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { accessToken, user } = useAuth();
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);

    const fetchRoom = async () => {
        try {
            if (!accessToken || !roomId) return;
            const data = await storyRoomApi.get(roomId, accessToken);
            setRoom(data);

            // Auto-redirect if active
            if (data.status === 'active') {
                navigate(`/rooms/${roomId}/play`);
            }
        } catch (error) {
            console.error('Fetch room error:', error);
            toast.error('Failed to load room');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken && roomId) {
            fetchRoom();
            // Poll for updates (simple approach for now)
            const interval = setInterval(fetchRoom, 2000);
            return () => clearInterval(interval);
        }
    }, [accessToken, roomId]);

    const handleJoin = async () => {
        try {
            if (!accessToken || !roomId) return;
            setJoining(true);
            await storyRoomApi.join(roomId, accessToken);
            toast.success('Joined room!');
            fetchRoom();
        } catch (error: any) {
            toast.error(error.message || 'Failed to join');
        } finally {
            setJoining(false);
        }
    };

    const handleStart = async () => {
        try {
            if (!accessToken || !roomId) return;
            await storyRoomApi.start(roomId, accessToken);
            toast.success('Starting game...');
            // Navigation handled by auto-redirect in effect
        } catch (error: any) {
            toast.error(error.message || 'Failed to start game');
        }
    };

    if (loading) {
        return (
            <div className="space-y-4 p-8">
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    if (!room) return <div>Room not found</div>;

    const isMember = room.members.some((m: any) => m.user.id === user?.id);
    const isLeader = room.members.find((m: any) => m.user.id === user?.id)?.role === 'LEADER';

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <RoomHeader
                title={room.title}
                roomStatus={room.status}
                showShare
                onInviteClick={() => setInviteOpen(true)}
            />

            <InviteRoomModal
                open={inviteOpen}
                onClose={() => setInviteOpen(false)}
                roomId={roomId || ''}
            />

            <main className="flex-1 container max-w-5xl mx-auto p-4 md:p-8 space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">{room.title}</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{room.basePlot}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Characters */}
                    <div className="md:col-span-1">
                        <CharacterList characters={room.characters} />
                    </div>

                    {/* Center: Actions */}
                    <div className="md:col-span-1 flex flex-col gap-4 justify-center items-center">
                        <Card className="w-full">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="text-sm font-medium text-muted-foreground">
                                    Status: <span className="uppercase text-foreground">{room.status}</span>
                                </div>
                                {/* Action Buttons */}
                                {!isMember ? (
                                    <Button size="lg" className="w-full" onClick={handleJoin} disabled={joining}>
                                        {joining ? 'Joining...' : 'Join Room'}
                                    </Button>
                                ) : (
                                    <div className="w-full space-y-2">
                                        <Button variant="outline" className="w-full cursor-default hover:bg-background">
                                            You are in the lobby
                                        </Button>
                                        {isLeader && (
                                            <Button size="lg" className="w-full" onClick={handleStart}>
                                                <Play className="mr-2 h-4 w-4" /> Start Game
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Members */}
                    <div className="md:col-span-1">
                        <MemberList members={room.members} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RoomLobbyPage;
