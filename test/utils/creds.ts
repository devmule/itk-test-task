import { ISignUpCredentials, } from "../../src/server/interfaces";

function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = result[i] as T;
        result[i] = result[j] as T;
        result[j] = temp;
    }
    return result;
}

const numbers = "0123456789".split('');
const lowercase = "abcdefghijklmnopqrstuvwxyz".split('');
const uppercase = lowercase.map(char => char.toUpperCase());
const specials = "!@#$%^&*".split('');

export function randomString(chars: string[], len: number): string {
    const chrs: string[] = [];
    for (let i = 0; i < len; i++) {
        chrs.push(chars[Math.floor(Math.random() * chars.length)] as string);
    }
    return chrs.join("");
}

export function randomPass(min: number = 8, max: number = 255): string {
    const length = Math.floor(Math.random() * (max - min)) + min;
    const banks = [numbers, lowercase, uppercase, specials];
    const chars: string[] = [];
    for (let i = 0; i < length; i++) {
        const char = randomString(banks[i % banks.length] as string[], 1);
        chars.push(char)
    }
    return shuffle(chars).join("");
}

export function randomName(): string {
    return randomString(uppercase, 1) + randomString(lowercase, 10);
}

export function randomEmail(): string {
    return `${randomString(lowercase, 20)}@example.com`;
}

export function randomCredentials(): ISignUpCredentials {
    return {
        email: randomEmail(),
        password: randomPass(),
    }
}
