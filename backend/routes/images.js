const express = require("express");
const multer = require("multer");
const router = express.Router();
const cloudinary = require("../utils/cloudinary"); // adjust path if needed
const streamifier = require("streamifier");
const authenticateToken = require("../utils/authentication");
const rateLimit = require("express-rate-limit");

const upload = multer(); // No need for disk storage, Cloudinary handles it

// shared limiter: 20 calls per IP every 60 seconds
const burstLimiter = rateLimit({
  windowMs:  60_000,  // 1 minute
  max:       20,      // limit each IP to 20 requests per windowMs
  standardHeaders: true,   // send rate-limit info in the RateLimit-* headers
  legacyHeaders:   false,  // disable the deprecated X-RateLimit-* headers
});

//Upload Image to cloudinary route
router.post("/api/upload-image", authenticateToken, burstLimiter, upload.single("image"), async (req, res) => {
  try {
    const streamUpload = (req) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "images" }, // optional folder in Cloudinary
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload(req);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// Delete single image from cloudinary routes
router.post("/api/delete-image", authenticateToken, burstLimiter, async (req, res) => {
  // console.log("Received body:", req.body); // 👈 log here
  const { public_id } = req.body;
  if (!public_id) {
    console.error("Missing public_id in request body:", req.body);
    return res.status(400).json({ error: "Missing image Public ID" });
  }
  try {
    const deletion = await cloudinary.uploader.destroy(public_id);
    const result = {public_id: public_id, result: deletion};
    res.json({ message: "Deleted", result });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// Route for deleting multiple images from cloudinary.
router.post("/api/delete-images", authenticateToken, burstLimiter, async (req, res) => {
  const { images } = req.body; // Expecting: [{ public_id: "...", url: "..." }, ...]

  if (!Array.isArray(images) || images.length === 0) { //First check if req contains images array.
    return res.status(400).json({ error: "No images provided" })
  }

  try {
    const results = [];

    for (const img of images) {
      if (img.public_id && img.url?.startsWith("https://res.cloudinary.com")) {
        const deletion = await cloudinary.uploader.destroy(img.public_id);
        results.push({ public_id: img.public_id, result: deletion });
      } else {
        results.push({ public_id: img.public_id, error: "Invalid or missing public_id/url" });
      }
    }
    res.json({ message: "Batch deletion complete", results });
  } catch (err) {
    console.error("Batch delete error:", err);
    res.status(500).json({ error: "Failed to delete some images" });
  }
});

module.exports = router;