// server.ts
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import sharp from "sharp";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function getFallbackSvg(title = "Image") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
    <rect width="600" height="400" fill="#0047AB"/>
    <rect width="600" height="400" fill="url(#grad)" opacity="0.8"/>
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="600" y2="400" gradientUnits="userSpaceOnUse">
        <stop stop-color="#0047AB"/>
        <stop offset="1" stop-color="#002255"/>
      </linearGradient>
    </defs>
    <circle cx="300" cy="170" r="45" fill="#ffffff" opacity="0.15"/>
    <path d="M285 185L295 170L305 180L315 160L325 185H285Z" fill="#32CD32"/>
    <circle cx="292" cy="158" r="4" fill="#ffffff"/>
    <text x="300" y="245" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="600" text-anchor="middle" letter-spacing="1">TEMITOPE INITIATIVE</text>
    <text x="300" y="270" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">${title}</text>
  </svg>`;
}
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3e3;
  app.use((req, res, next) => {
    if (!req.url.startsWith("/@") && !req.url.startsWith("/src/") && !req.url.startsWith("/node_modules/")) {
      console.log(`${(/* @__PURE__ */ new Date()).toISOString()} - ${req.method} ${req.url}`);
    }
    next();
  });
  app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });
  app.use(cors());
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));
  const publicDir = path.join(__dirname, "public");
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }
  const uploadDir = path.join(__dirname, "uploads");
  const thumbsDir = path.join(uploadDir, "thumbs");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(thumbsDir)) {
    fs.mkdirSync(thumbsDir, { recursive: true });
  }
  async function syncAllThumbnails() {
    try {
      if (!fs.existsSync(uploadDir)) return;
      const files = fs.readdirSync(uploadDir);
      let generated = 0;
      for (const file of files) {
        if (file === "thumbs" || file.startsWith(".")) continue;
        const ext = path.extname(file).toLowerCase();
        if ([".webp", ".jpg", ".jpeg", ".png"].includes(ext)) {
          const sourcePath = path.join(uploadDir, file);
          const thumbName = ext === ".webp" ? file : file.replace(ext, ".webp");
          const thumbPath = path.join(thumbsDir, thumbName);
          if (!fs.existsSync(thumbPath)) {
            try {
              await sharp(sourcePath).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toFile(thumbPath);
              generated++;
            } catch (err) {
              console.warn(`Could not generate thumbnail for ${file}:`, err.message);
            }
          }
        }
      }
      if (generated > 0) {
        console.log(`[Thumbnail Service] Generated ${generated} missing thumbnails in uploads/thumbs/`);
      }
    } catch (e) {
      console.error("Error during initial thumbnail sync:", e.message);
    }
  }
  syncAllThumbnails();
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    limits: {
      fileSize: 50 * 1024 * 1024,
      // 50MB per file
      fieldSize: 50 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    }
  });
  app.get("/uploads/thumbs/:filename", async (req, res) => {
    const filename = req.params.filename;
    const thumbPath = path.join(thumbsDir, filename);
    if (fs.existsSync(thumbPath)) {
      res.setHeader("Cache-Control", "public, max-age=2592000");
      return res.sendFile(thumbPath);
    }
    const sourceWebp = path.join(uploadDir, filename);
    const sourceJpg = path.join(uploadDir, filename.replace(/\.webp$/i, ".jpg"));
    const sourceJpeg = path.join(uploadDir, filename.replace(/\.webp$/i, ".jpeg"));
    const sourcePng = path.join(uploadDir, filename.replace(/\.webp$/i, ".png"));
    let sourceFile = null;
    if (fs.existsSync(sourceWebp)) sourceFile = sourceWebp;
    else if (fs.existsSync(sourceJpg)) sourceFile = sourceJpg;
    else if (fs.existsSync(sourceJpeg)) sourceFile = sourceJpeg;
    else if (fs.existsSync(sourcePng)) sourceFile = sourcePng;
    if (sourceFile) {
      try {
        await sharp(sourceFile).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toFile(thumbPath);
        res.setHeader("Cache-Control", "public, max-age=2592000");
        return res.sendFile(thumbPath);
      } catch (err) {
        return res.sendFile(sourceFile);
      }
    }
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(getFallbackSvg("Community Image"));
  });
  app.get("/uploads/:filename", (req, res, next) => {
    const filename = req.params.filename;
    if (filename === "thumbs") return next();
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=2592000");
      return res.sendFile(filePath);
    }
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(getFallbackSvg("Image"));
  });
  app.use("/uploads", express.static(uploadDir));
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded or file is not an image" });
      }
      const filename = `file-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const filePath = path.join(uploadDir, filename);
      await sharp(req.file.buffer).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(filePath);
      const thumbPath = path.join(thumbsDir, filename);
      await sharp(req.file.buffer).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toFile(thumbPath);
      console.log(`Successfully uploaded and compressed file: ${req.file.originalname} to ${filename}`);
      const fileUrl = `/uploads/${filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
  });
  app.post("/api/upload-multiple", upload.array("files", 100), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded or files are not images" });
      }
      const files = req.files;
      const uploadPromises = files.map(async (file) => {
        const filename = `file-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const filePath = path.join(uploadDir, filename);
        await sharp(file.buffer).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(filePath);
        const thumbPath = path.join(thumbsDir, filename);
        await sharp(file.buffer).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toFile(thumbPath);
        return `/uploads/${filename}`;
      });
      const urls = await Promise.all(uploadPromises);
      console.log(`Successfully uploaded and compressed ${files.length} files`);
      res.json({ urls });
    } catch (error) {
      console.error("Multiple upload error:", error);
      res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
  });
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  function readJsonFile(filename, defaultVal = []) {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) return defaultVal;
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
      return defaultVal;
    }
  }
  function writeJsonFile(filename, data) {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }
  app.get("/api/events", (req, res) => {
    const events = readJsonFile("events.json", []);
    events.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    res.json(events);
  });
  app.post("/api/events", (req, res) => {
    try {
      const events = readJsonFile("events.json", []);
      const newEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: req.body.title || "",
        description: req.body.description || "",
        imageUrl: req.body.imageUrl || req.body.imageUrls?.[0] || "",
        imageUrls: req.body.imageUrls || (req.body.imageUrl ? [req.body.imageUrl] : []),
        date: req.body.date || (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      events.unshift(newEvent);
      writeJsonFile("events.json", events);
      res.json(newEvent);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put("/api/events/:id", (req, res) => {
    try {
      const events = readJsonFile("events.json", []);
      const idx = events.findIndex((e) => e.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Event not found" });
      events[idx] = {
        ...events[idx],
        title: req.body.title ?? events[idx].title,
        description: req.body.description ?? events[idx].description,
        imageUrl: req.body.imageUrl ?? req.body.imageUrls?.[0] ?? events[idx].imageUrl,
        imageUrls: req.body.imageUrls ?? events[idx].imageUrls,
        date: req.body.date ?? events[idx].date,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      writeJsonFile("events.json", events);
      res.json(events[idx]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/events/:id", (req, res) => {
    try {
      let events = readJsonFile("events.json", []);
      events = events.filter((e) => e.id !== req.params.id);
      writeJsonFile("events.json", events);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/team", (req, res) => {
    const team = readJsonFile("team.json", []);
    team.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json(team);
  });
  app.post("/api/team", (req, res) => {
    try {
      const team = readJsonFile("team.json", []);
      const newMember = {
        id: `tm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: req.body.name || "",
        role: req.body.role || "",
        bio: req.body.bio || "",
        imageUrl: req.body.imageUrl || "",
        isFounder: Boolean(req.body.isFounder),
        order: Number(req.body.order || 0)
      };
      team.push(newMember);
      writeJsonFile("team.json", team);
      res.json(newMember);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put("/api/team/:id", (req, res) => {
    try {
      const team = readJsonFile("team.json", []);
      const idx = team.findIndex((t) => t.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Team member not found" });
      team[idx] = {
        ...team[idx],
        name: req.body.name ?? team[idx].name,
        role: req.body.role ?? team[idx].role,
        bio: req.body.bio ?? team[idx].bio,
        imageUrl: req.body.imageUrl ?? team[idx].imageUrl,
        isFounder: req.body.isFounder !== void 0 ? Boolean(req.body.isFounder) : team[idx].isFounder,
        order: req.body.order !== void 0 ? Number(req.body.order) : team[idx].order
      };
      writeJsonFile("team.json", team);
      res.json(team[idx]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/team/:id", (req, res) => {
    try {
      let team = readJsonFile("team.json", []);
      team = team.filter((t) => t.id !== req.params.id);
      writeJsonFile("team.json", team);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/gallery", (req, res) => {
    const gallery = readJsonFile("gallery.json", []);
    gallery.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    res.json(gallery);
  });
  app.post("/api/gallery", (req, res) => {
    try {
      const gallery = readJsonFile("gallery.json", []);
      if (Array.isArray(req.body.imageUrls) && req.body.imageUrls.length > 0) {
        const created = req.body.imageUrls.map((url) => ({
          id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: req.body.title || "Outreach",
          description: req.body.description || "",
          imageUrl: url,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }));
        gallery.unshift(...created);
        writeJsonFile("gallery.json", gallery);
        return res.json({ success: true, count: created.length, items: created });
      }
      const newImage = {
        id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: req.body.title || "Outreach",
        description: req.body.description || "",
        imageUrl: req.body.imageUrl || "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      gallery.unshift(newImage);
      writeJsonFile("gallery.json", gallery);
      res.json(newImage);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put("/api/gallery/:id", (req, res) => {
    try {
      const gallery = readJsonFile("gallery.json", []);
      const idx = gallery.findIndex((g) => g.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Gallery item not found" });
      gallery[idx] = {
        ...gallery[idx],
        title: req.body.title ?? gallery[idx].title,
        description: req.body.description ?? gallery[idx].description,
        imageUrl: req.body.imageUrl ?? gallery[idx].imageUrl
      };
      writeJsonFile("gallery.json", gallery);
      res.json(gallery[idx]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/gallery/:id", (req, res) => {
    try {
      let gallery = readJsonFile("gallery.json", []);
      gallery = gallery.filter((g) => g.id !== req.params.id);
      writeJsonFile("gallery.json", gallery);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/settings/:id", (req, res) => {
    const settings = readJsonFile("settings.json", {});
    res.json(settings[req.params.id] || {});
  });
  app.post("/api/settings/:id", (req, res) => {
    try {
      const settings = readJsonFile("settings.json", {});
      settings[req.params.id] = {
        ...settings[req.params.id],
        ...req.body,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      writeJsonFile("settings.json", settings);
      res.json(settings[req.params.id]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/subscribers", (req, res) => {
    const subscribers = readJsonFile("subscribers.json", []);
    res.json(subscribers);
  });
  app.post("/api/subscribers", (req, res) => {
    try {
      const subscribers = readJsonFile("subscribers.json", []);
      const email = (req.body.email || "").toLowerCase().trim();
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Invalid email" });
      }
      if (!subscribers.some((s) => s.email === email)) {
        subscribers.unshift({
          id: `sub-${Date.now()}`,
          email,
          subscribedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        writeJsonFile("subscribers.json", subscribers);
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/subscribers/:id", (req, res) => {
    try {
      let subscribers = readJsonFile("subscribers.json", []);
      subscribers = subscribers.filter((s) => s.id !== req.params.id);
      writeJsonFile("subscribers.json", subscribers);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/admin/export-database", (req, res) => {
    try {
      const dump = {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        events: readJsonFile("events.json", []),
        team: readJsonFile("team.json", []),
        gallery: readJsonFile("gallery.json", []),
        settings: readJsonFile("settings.json", {}),
        subscribers: readJsonFile("subscribers.json", [])
      };
      res.setHeader("Content-Disposition", `attachment; filename="tssdi-database-backup-${Date.now()}.json"`);
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(dump, null, 2));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/admin/import-database", (req, res) => {
    try {
      const { events, team, gallery, settings, subscribers } = req.body;
      if (Array.isArray(events)) writeJsonFile("events.json", events);
      if (Array.isArray(team)) writeJsonFile("team.json", team);
      if (Array.isArray(gallery)) writeJsonFile("gallery.json", gallery);
      if (settings && typeof settings === "object") writeJsonFile("settings.json", settings);
      if (Array.isArray(subscribers)) writeJsonFile("subscribers.json", subscribers);
      res.json({ success: true, message: "Database restored successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/admin/optimize-existing-images", async (req, res) => {
    try {
      const files = fs.readdirSync(uploadDir);
      const results = {
        optimized: 0,
        skipped: 0,
        errors: 0,
        dbUpdates: 0,
        details: []
      };
      const fileMap = /* @__PURE__ */ new Map();
      console.log(`Starting bulk optimization of ${files.length} files...`);
      for (const file of files) {
        if (file === "thumbs" || file.startsWith(".")) continue;
        const ext = path.extname(file).toLowerCase();
        if ([".jpg", ".jpeg", ".png"].includes(ext)) {
          const oldPath = path.join(uploadDir, file);
          const newName = file.replace(ext, ".webp");
          const newPath = path.join(uploadDir, newName);
          if (!fs.existsSync(newPath)) {
            try {
              await sharp(oldPath).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(newPath);
              const thumbPath = path.join(thumbsDir, newName);
              await sharp(oldPath).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toFile(thumbPath);
              fileMap.set(file, newName);
              results.optimized++;
              results.details.push(`Optimized: ${file} -> ${newName}`);
            } catch (err) {
              console.error(`Error optimizing ${file}:`, err);
              results.errors++;
            }
          } else {
            const thumbPath = path.join(thumbsDir, newName);
            if (!fs.existsSync(thumbPath)) {
              try {
                await sharp(oldPath).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toFile(thumbPath);
              } catch (e) {
              }
            }
            fileMap.set(file, newName);
            results.skipped++;
          }
        } else if (ext === ".webp") {
          const thumbPath = path.join(thumbsDir, file);
          if (!fs.existsSync(thumbPath)) {
            try {
              const oldPath = path.join(uploadDir, file);
              await sharp(oldPath).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toFile(thumbPath);
            } catch (e) {
            }
          }
        }
      }
      if (fileMap.size > 0) {
        console.log("Updating local JSON records for optimized images...");
        let gallery = readJsonFile("gallery.json", []);
        let gUpdates = 0;
        gallery = gallery.map((item) => {
          if (item.imageUrl && item.imageUrl.startsWith("/uploads/")) {
            const fileName = item.imageUrl.split("/").pop();
            if (fileName && fileMap.has(fileName)) {
              gUpdates++;
              return { ...item, imageUrl: item.imageUrl.replace(fileName, fileMap.get(fileName)) };
            }
          }
          return item;
        });
        if (gUpdates > 0) writeJsonFile("gallery.json", gallery);
        results.dbUpdates += gUpdates;
        let events = readJsonFile("events.json", []);
        let eUpdates = 0;
        events = events.map((item) => {
          let modified = false;
          let imageUrl = item.imageUrl;
          if (imageUrl && imageUrl.startsWith("/uploads/")) {
            const fileName = imageUrl.split("/").pop();
            if (fileName && fileMap.has(fileName)) {
              imageUrl = imageUrl.replace(fileName, fileMap.get(fileName));
              modified = true;
            }
          }
          let imageUrls = item.imageUrls;
          if (Array.isArray(imageUrls)) {
            imageUrls = imageUrls.map((url) => {
              if (typeof url === "string" && url.startsWith("/uploads/")) {
                const fileName = url.split("/").pop() || "";
                if (fileMap.has(fileName)) {
                  modified = true;
                  return url.replace(fileName, fileMap.get(fileName));
                }
              }
              return url;
            });
          }
          if (modified) {
            eUpdates++;
            return { ...item, imageUrl, imageUrls };
          }
          return item;
        });
        if (eUpdates > 0) writeJsonFile("events.json", events);
        results.dbUpdates += eUpdates;
      }
      console.log("Optimization task finished:", results);
      res.json({
        message: "Optimization task completed successfully!",
        summary: `${results.optimized} images compressed, ${results.dbUpdates} database records updated.`,
        details: results
      });
    } catch (error) {
      console.error("Optimization route error:", error);
      res.status(500).json({ error: `Optimization failed: ${error.message}` });
    }
  });
  app.post("/api/admin/login", (req, res) => {
    try {
      const { username, password } = req.body;
      const settings = readJsonFile("settings.json", {});
      const adminCreds = settings.admin || { username: "Surprise-MFs", password: "Surprise" };
      if (username === adminCreds.username && password === adminCreds.password) {
        return res.json({ success: true, username: adminCreds.username });
      }
      return res.status(401).json({ error: "Invalid username or password" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.all("/api/*", (req, res) => {
    console.log(`404 API Route: ${req.method} ${req.url}`);
    res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
      details: process.env.NODE_ENV !== "production" ? err.stack : void 0
    });
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Error starting server:", err);
});
