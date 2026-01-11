import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface RoomHeaderProps {
    title: string;
    roomStatus?: string;
    onLeave?: () => void;
    showShare?: boolean;
    onInviteClick?: () => void;
}

export const RoomHeader = ({ title, roomStatus, onLeave, showShare = false, onInviteClick }: RoomHeaderProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onLeave) onLeave();
        else navigate('/rooms');
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        {title}
                        {roomStatus && (
                            <Badge variant={roomStatus === 'active' ? 'default' : 'secondary'} className="uppercase text-xs">
                                {roomStatus}
                            </Badge>
                        )}
                    </h1>
                </div>
            </div>

            {showShare && (
                <Button variant="outline" size="sm" onClick={onInviteClick} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Invite
                </Button>
            )}
        </div>
    );
};
