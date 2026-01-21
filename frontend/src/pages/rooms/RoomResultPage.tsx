import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storyRoomApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { RoomHeader } from '@/components/rooms/RoomHeader';
import { StoryViewer } from '@/components/rooms/StoryViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Download, Globe, Copy, Check } from 'lucide-react';
import jsPDF from 'jspdf';

const RoomResultPage = () => {
    const { roomId } = useParams();
    const { accessToken, user } = useAuth();
    const [room, setRoom] = useState<any>(null);
    const [configOpen, setConfigOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                if (!accessToken || !roomId) return;
                const data = await storyRoomApi.get(roomId, accessToken);
                setRoom(data);
            } catch (error) {
                console.error('Fetch room error:', error);
            }
        };
        fetchRoom();
    }, [roomId, accessToken]);

    const handlePublish = async () => {
        try {
            if (!accessToken || !roomId) return;
            await storyRoomApi.publish(roomId, accessToken);
            setRoom((prev: any) => ({ ...prev, isPublic: true }));
            toast.success('Story published successfully!');
        } catch (error) {
            toast.error('Failed to publish story');
        }
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/story/${room.publicSlug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Public link copied!');
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(24);
        doc.text(room.title, 20, 20);

        doc.setFontSize(12);
        doc.text(`A story by Ink Relay`, 20, 30);

        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        let y = 45;
        const pageHeight = doc.internal.pageSize.height;

        room.turns.forEach((turn: any) => {
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Turn ${turn.turnOrder} - ${turn.user.name}`, 20, y);
            y += 5;

            doc.setFontSize(12);
            doc.setTextColor(0);
            const lines = doc.splitTextToSize(turn.content, 170);

            if (y + lines.length * 7 > pageHeight - 20) {
                doc.addPage();
                y = 20;
            }

            doc.text(lines, 20, y);
            y += lines.length * 7 + 10;
        });

        doc.save(`${room.publicSlug || 'story'}.pdf`);
        toast.success('PDF downloaded!');
    };

    if (!room) return <div className="p-8">Loading results...</div>;

    const isLeader = room.members.find((m: any) => m.user.id === user?.id)?.role === 'LEADER';

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <RoomHeader title="Story Completed!" roomStatus="finished" />

            <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Actions */}
                    <div className="md:col-span-1 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full" variant="outline" onClick={handleExportPDF}>
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                </Button>

                                {isLeader && !room.isPublic && (
                                    <Button className="w-full" onClick={handlePublish}>
                                        <Globe className="mr-2 h-4 w-4" /> Publish Story
                                    </Button>
                                )}

                                {room.isPublic && (
                                    <div className="space-y-2">
                                        <div className="text-xs text-muted-foreground uppercase font-bold">Public Link</div>
                                        <Button className="w-full" variant="secondary" onClick={handleCopyLink}>
                                            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                            {copied ? 'Copied' : 'Copy Link'}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Collaborators</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {room.members.map((m: any) => (
                                        <div key={m.id} className="flex items-center gap-2 text-sm">
                                            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                                                {m.user.name?.[0]}
                                            </div>
                                            <span>{m.user.name}</span>
                                            <span className="text-xs text-muted-foreground ml-auto">{m.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Story */}
                    <div className="md:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-2xl">{room.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <StoryViewer turns={room.turns} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomResultPage;
