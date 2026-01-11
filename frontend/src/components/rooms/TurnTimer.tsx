import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface TurnTimerProps {
    endsAt: string | null;
    totalDurationSec: number;
}

export const TurnTimer = ({ endsAt, totalDurationSec }: TurnTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!endsAt) {
            setTimeLeft(0);
            setProgress(0);
            return;
        }

        const interval = setInterval(() => {
            const end = new Date(endsAt).getTime();
            const now = Date.now();
            const remaining = Math.max(0, Math.ceil((end - now) / 1000));

            setTimeLeft(remaining);

            const percentage = Math.min(100, (remaining / totalDurationSec) * 1000);
            setProgress(percentage);

        }, 100); // update fast for smooth progress bar

        return () => clearInterval(interval);
    }, [endsAt, totalDurationSec]);

    if (!endsAt || timeLeft <= 0) {
        return (
            <div className="w-full text-center p-2 bg-destructive/10 text-destructive rounded-md">
                <span className="font-bold uppercase text-xs tracking-wider">Time's Up</span>
            </div>
        )
    }

    // Format mm:ss
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const isUrgent = timeLeft < 10;

    return (
        <div className="space-y-1 w-full">
            <div className="flex justify-between items-center text-xs uppercase font-bold tracking-wider text-muted-foreground">
                <span>Time Remaining</span>
                <span className={isUrgent ? 'text-destructive animate-pulse' : ''}>{timeString}</span>
            </div>
            <Progress value={(timeLeft / totalDurationSec) * 100} className={`h-2 ${isUrgent ? 'bg-destructive/20' : ''}`} />
        </div>
    );
};
