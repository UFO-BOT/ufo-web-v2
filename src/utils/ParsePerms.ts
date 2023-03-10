import {Command} from "@/types/Command";
import i18n from "@/plugins/i18n";

export default function ParsePerms(cmd: Command): string {
    let perms = '';
    const permissions = {
        ru: {
            Administrator: "Администратор",
            ViewAuditLog: "Просматривать журнал аудита",
            ViewGuildInsights: "Просматривать аналитики сервера",
            ManageGuild: "Управлять сервером",
            ManageRoles: "Управлять ролями",
            ManageChannels: "Управлять каналами",
            KickMembers: "Кикать участников",
            BanMembers: "Банить участников",
            CreateInstantInvite: "Создание приглашение",
            ChangeNickname: "Изменять никнейм",
            ManageNicknames: "Управлять никнеймами",
            ManageEmojisAndStickers: "Управлять эмодзи и стикерами",
            ManageWebhooks: "Управлять вебхуками",
            ViewChannel: "Видеть каналы",
            ManageEvents: "Управлять событиями",
            ModerateMembers: "Модерировать участников",
            SendMessages: "Отправлять сообщения",
            CreatePublicThreads: "Создавать публичные ветки",
            CreatePrivateThreads: "Создавать приватные ветки",
            SendMessagesInThreads: "Отправлять сообщения в ветках",
            SendTTSMessages: "Отправлять /tts сообщения",
            ManageMessages: "Управлять сообщениями",
            ManageThreads: "Управлять ветками",
            EmbedLinks: "Встраивать ссылки",
            AttachFiles: "Прикреплять файлы",
            ReadMessageHistory: "Читать историю сообщений",
            MentionEveryone: "Упоминать всех",
            UseExternalEmojis: "Использовать внешние эмодзи",
            UseExternalStickers: "Использовать внешние стикеры",
            AddReactions: "Добавлять реакции",
            UseApplicationCommands: "Использовать слеш команды",
            Connect: "Подключаться",
            Speak: "Говорить",
            Stream: "Стримить",
            RequestToSpeak: "Попросить выступить",
            MuteMembers: "Отключать участникам микрофон",
            DeafenMembers: "Отключать участникам звук",
            MoveMembers: "Перемещать участников",
            UseVAD: "Использовать режим активаци по голосу",
            PrioritySpeaker: "Приоритетный режим",
            UseEmbeddedActivities: "Использовать активности"
        },
        en: {
            Administrator: "Administrator",
            ViewAuditLog: "View audit logs",
            ViewGuildInsights: "View server insights",
            ManageGuild: "Manage server",
            ManageRoles: "Manage roles",
            ManageChannels: "Manage channels",
            KickMembers: "Kick members",
            BanMembers: "Ban members",
            CreateInstantInvite: "Create invite",
            ChangeNickname: "Change nickname",
            ManageNicknames: "Manage nicknames",
            ManageEmojisAndStickers: "Manage emojis and stickers",
            ManageWebhooks: "Manage webhooks",
            ViewChannel: "View channels",
            ManageEvents: "Manage events",
            ModerateMembers: "Moderate members",
            SendMessages: "Send messages",
            CreatePublicThreads: "Create public threads",
            CreatePrivateThreads: "Create private threads",
            SendMessagesInThreads: "Send messages in threads",
            SendTTSMessages: "Send /tts messages",
            ManageMessages: "Send messages",
            ManageThreads: "Manage threads",
            EmbedLinks: "Embed links",
            AttachFiles: "Attach files",
            ReadMessageHistory: "Read message history",
            MentionEveryone: "Mention everyone",
            UseExternalEmojis: "Use external emojis",
            UseExternalStickers: "Use external stickers",
            AddReactions: "Add reactions",
            UseApplicationCommands: "Use slash commands",
            Connect: "Connect",
            Speak: "Speak",
            Stream: "Stream",
            RequestToSpeak: "Request to speak",
            MuteMembers: "Mute members",
            DeafenMembers: "Deafen members",
            MoveMembers: "Move members",
            UseVAD: "Use voice activity detection",
            PrioritySpeaker: "Priority speaker",
            UseEmbeddedActivities: "Use embedded activities"
        }
    }
    cmd.defaultMemberPermissions?.forEach(perm => {
        perms += permissions[i18n.global.locale.value][perm as keyof typeof permissions.en] + '<br>';
    })
    return perms;
}