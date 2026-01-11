import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Crown, Eye, PenTool } from 'lucide-react';

interface Member {
    id: string;
    role: 'LEADER' | 'WRITER' | 'SPECTATOR';
    user: {
        id: string;
        name: string | null;
        avatar?: string | null;
    };
}

interface MemberListProps {
    members: Member[];
    currentWriterId?: string;
}

export const MemberList = ({ members, currentWriterId }: MemberListProps) => {
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'LEADER': return <Crown className="h-3 w-3 text-yellow-500" />;
            case 'WRITER': return <PenTool className="h-3 w-3 text-blue-500" />;
            case 'SPECTATOR': return <Eye className="h-3 w-3 text-gray-500" />;
            default: return null;
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Participants
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className={`flex items-center gap-3 p-2 rounded-md transition-colors ${currentWriterId === member.user.id
                                ? 'bg-primary/10 border border-primary/20 ring-1 ring-primary/20'
                                : 'hover:bg-accent/50'
                            }`}
                    >
                        <div className="relative">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={member.user.avatar || undefined} />
                                <AvatarFallback>{member.user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm border border-border">
                                {getRoleIcon(member.role)}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {member.user.name || 'Unknown User'}
                                {member.user.id === currentWriterId && (
                                    <span className="ml-2 text-xs text-primary animate-pulse">(Writing...)</span>
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground lowercase">{member.role}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
