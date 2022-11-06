
export interface NOTIFICATION_SETTINGS_TYPE {
    mail: boolean
    sms: boolean
    web: boolean
}

export interface UserSettingType {
    notification_settings: NOTIFICATION_SETTINGS_TYPE;
    contact_settings: string;
}