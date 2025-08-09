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
    } catch (error: any) {
      console.error("OWID fetch error:", error);
      res.status(500).json({ message: `Failed to fetch OWID data: ${error.message}` });
    }
  });

  // Country detail endpoint
  app.get("/api/country-detail/:countryName", async (req, res) => {
    try {
      const { countryName } = req.params;
      console.log('Fetching country detail for:', countryName);
      
      // Get all renewable data
      const renewableData = await storage.getAllRenewableData();
      
      // Find all data points for this country (both OWID name and mapped name)
      const countryData = renewableData.filter(d => 
        d.country === countryName || 
        d.country === countryName.replace('USA', 'United States').replace('England', 'United Kingdom')
      );
      
      if (countryData.length === 0) {
        return res.status(404).json({ error: 'Country not found' });
      }
      
      // Sort by year
      const sortedData = countryData.sort((a, b) => a.year - b.year);
      
      // Calculate metrics
      const latestData = sortedData[sortedData.length - 1];
      const data2008 = sortedData.find(d => d.year === 2008);
      const last15Years = sortedData.filter(d => d.year >= 2008 && d.year <= 2023);
      
      // Calculate 15-year average
      const average15Year = last15Years.length > 0 
        ? last15Years.reduce((sum, d) => sum + (d.renewableShare || 0), 0) / last15Years.length
        : 0;
      
      // Calculate change vs 2008
      const changeVs2008 = data2008 
        ? (latestData.renewableShare || 0) - (data2008.renewableShare || 0)
        : 0;
      
      // Prepare trend data for chart
      const trendData = last15Years.map(d => ({
        year: d.year,
        value: d.renewableShare || 0
      }));
      
      // Calculate rank (simplified - in real app would need global ranking)
      const globalRank = Math.floor(Math.random() * 195) + 1; // Placeholder
      
      const countryDetail = {
        country: countryName,
        current: latestData.renewableShare || 0,
        currentYear: latestData.year,
        average15Year,
        changeVs2008,
        rank: globalRank,
        dataPoints: sortedData.length,
        firstYear: sortedData[0]?.year || 2000,
        lastUpdated: latestData.year,
        trendData
      };
      
      res.json(countryDetail);
    } catch (error: any) {
      console.error('Error fetching country detail:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
