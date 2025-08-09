import { type User, type InsertUser, type RenewableData, type InsertRenewableData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Renewable data methods
  getAllRenewableData(): Promise<RenewableData[]>;
  getRenewableDataByCountry(country: string): Promise<RenewableData[]>;
  getRenewableDataByYear(year: number): Promise<RenewableData[]>;
  insertRenewableData(data: InsertRenewableData[]): Promise<RenewableData[]>;
  clearRenewableData(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private renewableData: Map<string, RenewableData>;

  constructor() {
    this.users = new Map();
    this.renewableData = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllRenewableData(): Promise<RenewableData[]> {
    return Array.from(this.renewableData.values());
  }

  async getRenewableDataByCountry(country: string): Promise<RenewableData[]> {
    return Array.from(this.renewableData.values()).filter(
      (data) => data.country === country
    );
  }

  async getRenewableDataByYear(year: number): Promise<RenewableData[]> {
    return Array.from(this.renewableData.values()).filter(
      (data) => data.year === year
    );
  }

  async insertRenewableData(dataArray: InsertRenewableData[]): Promise<RenewableData[]> {
    const inserted: RenewableData[] = [];
    
    for (const data of dataArray) {
      const id = randomUUID();
      const renewableDataEntry: RenewableData = {
        id,
        country: data.country,
        countryCode: data.countryCode || null,
        year: data.year,
        renewableShare: data.renewableShare || null,
        region: data.region || null,
        lastUpdated: new Date().toISOString(),
      };
      this.renewableData.set(id, renewableDataEntry);
      inserted.push(renewableDataEntry);
    }
    
    return inserted;
  }

  async clearRenewableData(): Promise<void> {
    this.renewableData.clear();
  }
}

export const storage = new MemStorage();
