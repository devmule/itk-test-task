export interface IUserSearch {
    email?: string;
    limit?: number;
    offset?: number;
}

export interface IUserGet {
    id: string;
}

export interface IUserUpdateName {
    id: string;
    firstName?: string;
    lastName?: string;
}