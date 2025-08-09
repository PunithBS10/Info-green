import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRenewableDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all renewable data
  app.get("/api/renewable-data", async (_req, res) => {
    try {
      const data = await storage.getAllRenewableData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch renewable data" });
    }
  });

  // Get renewable data by country
  app.get("/api/renewable-data/country/:country", async (req, res) => {
    try {
      const { country } = req.params;
      const data = await storage.getRenewableDataByCountry(country);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country data" });
    }
  });

  // Get renewable data by year
  app.get("/api/renewable-data/year/:year", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      if (isNaN(year)) {
        return res.status(400).json({ message: "Invalid year parameter" });
      }
      const data = await storage.getRenewableDataByYear(year);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch year data" });
    }
  });

  // Import renewable data from OWID CSV
  app.post("/api/renewable-data/import", async (req, res) => {
    try {
      const dataArray = z.array(insertRenewableDataSchema).parse(req.body);
      await storage.clearRenewableData();
      const inserted = await storage.insertRenewableData(dataArray);
      res.json({ message: `Imported ${inserted.length} records`, data: inserted });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to import data" });
    }
  });

  // Proxy for OWID CSV data to handle CORS
  app.get("/api/owid-proxy", async (_req, res) => {
    try {
      console.log("Fetching OWID data...");
      const response = await fetch("https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv", {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Dashboard/1.0)'
        }
      });
      console.log("OWID response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvData = await response.text();
      console.log("OWID data length:", csvData.length);
      res.setHeader('Content-Type', 'text/csv');
      res.send(csvData);
    } catch (error) {
      console.error("OWID fetch error:", error);
      res.status(500).json({ message: `Failed to fetch OWID data: ${error.message}` });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
