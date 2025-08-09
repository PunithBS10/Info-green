import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const renewableData = pgTable("renewable_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  country: text("country").notNull(),
  countryCode: text("country_code"),
  year: integer("year").notNull(),
  renewableShare: real("renewable_share"),
  region: text("region"),
  lastUpdated: text("last_updated").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRenewableDataSchema = createInsertSchema(renewableData).omit({
  id: true,
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RenewableData = typeof renewableData.$inferSelect;
export type InsertRenewableData = z.infer<typeof insertRenewableDataSchema>;
