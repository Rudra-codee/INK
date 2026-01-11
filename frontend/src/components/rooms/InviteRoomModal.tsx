import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface InviteRoomModalProps {
    open: boolean;
    onClose: () => void;
    roomId: string;
}

export const InviteRoomModal = ({ open, onClose, roomId }: InviteRoomModalProps) => {
    const [copied, setCopied] = useState(false);
    const inviteLink = `${window.location.origin}/rooms/${roomId}/lobby`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success('Invite link copied ✅');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite to Story Room</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2 my-4">
                    <div className="grid flex-1 gap-2">
                        <Input
                            id="link"
                            defaultValue={inviteLink}
                            readOnly
                            className="text-muted-foreground bg-secondary/50"
                        />
                    </div>
                    <Button type="button" size="icon" onClick={handleCopy} className={copied ? 'bg-green-600 hover:bg-green-700' : ''}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
