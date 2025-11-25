import { useState, useEffect, useRef } from 'react';

interface UseAutosaveOptions {
    onSave: (title: string, content: string) => Promise<void>;
    interval?: number; // milliseconds
}

export const useAutosave = (
    title: string,
    content: string,
    options: UseAutosaveOptions
) => {
    const { onSave, interval = 5000 } = options;
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const titleRef = useRef(title);
    const contentRef = useRef(content);

    useEffect(() => {
        const autosaveInterval = setInterval(async () => {
            // Check if content or title has changed
            if (titleRef.current !== title || contentRef.current !== content) {
                try {
                    setSaving(true);
                    await onSave(title, content);
                    setLastSaved(new Date());
                    titleRef.current = title;
                    contentRef.current = content;
                } catch (error) {
                    console.error('Autosave failed:', error);
                } finally {
                    setSaving(false);
                }
            }
        }, interval);

        return () => clearInterval(autosaveInterval);
    }, [title, content, onSave, interval]);

    const manualSave = async () => {
        try {
            setSaving(true);
            await onSave(title, content);
            setLastSaved(new Date());
            titleRef.current = title;
            contentRef.current = content;
        } catch (error) {
            console.error('Manual save failed:', error);
            throw error;
        } finally {
            setSaving(false);
        }
    };

    return { saving, lastSaved, manualSave };
};
