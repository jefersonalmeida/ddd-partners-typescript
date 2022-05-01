export type NotificationErrorProps = {
    message: string;
    context: string;
}

export default class Notification {
    private errors: NotificationErrorProps[] = [];

    addError(error: NotificationErrorProps) {
        this.errors.push(error);
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    getMessages(context?: string): string {
        return this.errors
            .filter(e => !!context ? e.context === context : true)
            .map(e => `${e.context}: ${e.message}`)
            .join(', ');
    }

    getErrors(): NotificationErrorProps[] {
        return this.errors;
    }
}