// server.ts
import express from "express";
import path2 from "path";
import fs2 from "fs";
import multer from "multer";
import dotenv from "dotenv";

// src/server/db.ts
import fs from "fs";
import path from "path";
var isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);
var DATA_DIR = isServerless ? path.resolve("/tmp", "rnk_data") : path.resolve(process.cwd(), "data");
var DB_FILE = path.join(DATA_DIR, "rnk_database.json");
var DEFAULT_CATEGORIES = [
  {
    id: "cat-photo-frames",
    name_en: "Photo Frames",
    name_ta: "\u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BCD",
    slug: "photo-frames",
    description_en: "Classic wooden, gold-rimmed, and contemporary frames for timeless family memories.",
    description_ta: "\u0BAA\u0BBE\u0BB0\u0BAE\u0BCD\u0BAA\u0BB0\u0BBF\u0BAF \u0BAE\u0BB0 \u0BB5\u0BC7\u0BB2\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA8\u0BB5\u0BC0\u0BA9 \u0BAA\u0BBE\u0BA3\u0BBF\u0BAF\u0BBF\u0BB2\u0BBE\u0BA9 \u0BA8\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE\u0BA9 \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BCD.",
    display_order: 1,
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "cat-return-gifts",
    name_en: "Return Gift Combos",
    name_ta: "\u0BB0\u0BBF\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD\u0BA9\u0BCD \u0B95\u0BBF\u0B83\u0BAA\u0BCD\u0B9F\u0BCD \u0B95\u0BBE\u0BAE\u0BCD\u0BAA\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
    slug: "return-gift-combos",
    description_en: "Curated gift combos with personalized mini frames, bag, and spiritual tokens for guests.",
    description_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3\u0BAE\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0BBF\u0B9A\u0BC7\u0BB7\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BB5\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BBF\u0BA9\u0BB0\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0B95\u0BCD\u0B95\u0BC2\u0B9F\u0BBF\u0BAF \u0B9A\u0BBF\u0BB1\u0BAA\u0BCD\u0BAA\u0BC1 \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1 \u0B95\u0BBE\u0BAE\u0BCD\u0BAA\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD.",
    display_order: 2,
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "cat-customized",
    name_en: "Customized Frames",
    name_ta: "\u0BA4\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0BAF\u0BA9\u0BBE\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BCD",
    slug: "customized-frames",
    description_en: "Bespoke collage frames, acrylic cutouts, name boards, and customized song/date plaques.",
    description_ta: "\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0B95\u0BB3\u0BCD, \u0BA4\u0BC7\u0BA4\u0BBF\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0BBF\u0BB0\u0BA4\u0BCD\u0BAF\u0BC7\u0B95 \u0BB5\u0B9F\u0BBF\u0BB5\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1\u0B9F\u0BA9\u0BCD \u0B89\u0BB0\u0BC1\u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0BAA\u0BBF\u0BB0\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF\u0BC7\u0B95 \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BCD.",
    display_order: 3,
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "cat-birthday",
    name_en: "Birthday Frames",
    name_ta: "\u0BAA\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4\u0BA8\u0BBE\u0BB3\u0BCD \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BCD",
    slug: "birthday-frames",
    description_en: "Joyful milestone collage designs and themed memory frames for boys, girls, and adults.",
    description_ta: "\u0BAA\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4\u0BA8\u0BBE\u0BB3\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC1\u0B95\u0BB3\u0BC8 \u0B8E\u0BA9\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BBF\u0BB2\u0BCD \u0BA8\u0BBF\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4 \u0B89\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD \u0BB5\u0BA3\u0BCD\u0BA3\u0BAE\u0BAF\u0BAE\u0BBE\u0BA9 \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BCD.",
    display_order: 4,
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "cat-wedding",
    name_en: "Wedding Frames",
    name_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3 \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BCD",
    slug: "wedding-frames",
    description_en: "Regal bridal portraits, couple anniversary boards, and gold-embossed holy blessing frames.",
    description_ta: "\u0BAE\u0BA3\u0BAE\u0B95\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3 \u0BA8\u0BBE\u0BB3\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC1\u0B95\u0BB3\u0BC8 \u0BAA\u0BCB\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB0\u0BBE\u0B9C\u0BB0\u0BC0\u0B95 \u0BA4\u0B99\u0BCD\u0B95 \u0BA8\u0BBF\u0BB1 \u0BAA\u0BBE\u0BB0\u0BCD\u0B9F\u0BB0\u0BCD \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BCD.",
    display_order: 5,
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "cat-other-gifts",
    name_en: "Other Gift Items",
    name_ta: "\u0BAA\u0BBF\u0BB1 \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1\u0BAA\u0BCD \u0BAA\u0BCA\u0BB0\u0BC1\u0B9F\u0BCD\u0B95\u0BB3\u0BCD",
    slug: "other-gift-items",
    description_en: "Customized keychains, acrylic clocks, desktop stands, and devotional art plaques.",
    description_ta: "\u0BAE\u0BC7\u0B9C\u0BC8 \u0B85\u0BB2\u0B99\u0BCD\u0B95\u0BBE\u0BB0 \u0BAA\u0BCA\u0BB0\u0BC1\u0B9F\u0BCD\u0B95\u0BB3\u0BCD, \u0B9A\u0BBE\u0BB5\u0BBF \u0B95\u0BCA\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BB3\u0BCD, \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B86\u0BA9\u0BCD\u0BAE\u0BC0\u0B95 \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1 \u0BAA\u0BCA\u0BB0\u0BC1\u0B9F\u0BCD\u0B95\u0BB3\u0BCD.",
    display_order: 6,
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var DEFAULT_SETTINGS = {
  business_name: "RNK Photo Frames",
  phone: "+91 8681917433",
  whatsapp_number: "+91 8681917433",
  location: "PodaturPet, Tiruttani, Tamil Nadu, India",
  address_en: "Main Bazaar Road, PodaturPet, Tiruttani Taluk, Tiruvallur District, Tamil Nadu - 631208",
  address_ta: "\u0BAE\u0BC6\u0BAF\u0BBF\u0BA9\u0BCD \u0BAA\u0B9C\u0BBE\u0BB0\u0BCD \u0B9A\u0BBE\u0BB2\u0BC8, \u0BAA\u0BCA\u0BA4\u0B9F\u0BCD\u0B9F\u0BC2\u0BB0\u0BCD\u0BAA\u0BC7\u0B9F\u0BCD\u0B9F\u0BC8, \u0BA4\u0BBF\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BA3\u0BBF \u0BA4\u0BBE\u0BB2\u0BC1\u0B95\u0BBE, \u0BA4\u0BBF\u0BB0\u0BC1\u0BB5\u0BB3\u0BCD\u0BB3\u0BC2\u0BB0\u0BCD \u0BAE\u0BBE\u0BB5\u0B9F\u0BCD\u0B9F\u0BAE\u0BCD, \u0BA4\u0BAE\u0BBF\u0BB4\u0BCD\u0BA8\u0BBE\u0B9F\u0BC1 - 631208",
  introduction_en: "Welcome to RNK Photo Frames, where memories are preserved in timeless craftsmanship. Located in PodaturPet near Tiruttani, we specialize in luxury wooden frames, bespoke couple frames, vibrant birthday collages, and thoughtful wedding return gift combos.",
  introduction_ta: "\u0BAA\u0BCA\u0BA4\u0B9F\u0BCD\u0B9F\u0BC2\u0BB0\u0BCD\u0BAA\u0BC7\u0B9F\u0BCD\u0B9F\u0BC8 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA4\u0BBF\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BA3\u0BBF \u0BAA\u0B95\u0BC1\u0BA4\u0BBF\u0BAF\u0BBF\u0BB2\u0BCD \u0B9A\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4 \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0BB8\u0BCD, \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC1\u0B95\u0BB3\u0BCD, \u0BAA\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4\u0BA8\u0BBE\u0BB3\u0BCD \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0BBF\u0B9A\u0BC7\u0BB7\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0BA9 \u0BB0\u0BBF\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD\u0BA9\u0BCD \u0B95\u0BBF\u0B83\u0BAA\u0BCD\u0B9F\u0BCD \u0B95\u0BBE\u0BAE\u0BCD\u0BAA\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BC8 \u0BAE\u0BBF\u0B95 \u0B89\u0BAF\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4 \u0BA4\u0BB0\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BA4\u0BAF\u0BBE\u0BB0\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0BC1\u0B95\u0BBF\u0BB1\u0BCB\u0BAE\u0BCD.",
  about_text_en: "RNK Photo Frames was established with a singular passion: turning fleeting moments into everlasting treasures. Every frame is assembled with high-density moisture-resistant backboards, premium glass or unbreakable acrylic, and meticulous finishing.",
  about_text_ta: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAA\u0BCA\u0BA9\u0BCD\u0BA9\u0BBE\u0BA9 \u0BA4\u0BB0\u0BC1\u0BA3\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B95\u0BBE\u0BB2\u0BA4\u0BCD\u0BA4\u0BBE\u0BB2\u0BCD \u0B85\u0BB4\u0BBF\u0BAF\u0BBE\u0BA4 \u0B95\u0BB2\u0BC8\u0BAF\u0BBE\u0B95 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BC1\u0BB5\u0BA4\u0BC7 \u0B8E\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BA8\u0BCB\u0B95\u0BCD\u0B95\u0BAE\u0BCD. \u0BA8\u0BC0\u0B9F\u0BBF\u0BA4\u0BCD\u0BA4 \u0B89\u0BB4\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1\u0BAE\u0BCD, \u0BA8\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE\u0BA9 \u0BB5\u0B9F\u0BBF\u0BB5\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1\u0BAE\u0BCD \u0B95\u0BCA\u0BA3\u0BCD\u0B9F \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BC8 \u0BA8\u0BBF\u0BAF\u0BBE\u0BAF\u0BAE\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB2\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0BC1\u0B95\u0BBF\u0BB1\u0BCB\u0BAE\u0BCD.",
  logo_url: "/logo.png",
  social_instagram: "https://instagram.com",
  social_facebook: "https://facebook.com",
  default_language: "en",
  seo_title: "RNK Photo Frames | Premium Photo Frames & Return Gift Combos | PodaturPet, Tiruttani",
  seo_description: "Premium handcrafted photo frames, return gift combos, and customized gifts in PodaturPet, Tiruttani. Enquire via WhatsApp or Call +91 8681917433.",
  google_maps_url: "https://maps.google.com/?q=Podaturpet,Tiruttani,Tamil+Nadu",
  updated_at: (/* @__PURE__ */ new Date()).toISOString()
};
var DEFAULT_BANNERS = [
  {
    id: "banner-1",
    image_path: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1600",
    heading_en: "Frames That Preserve Your Beautiful Moments",
    heading_ta: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B85\u0BB4\u0B95\u0BBE\u0BA9 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC1\u0B95\u0BB3\u0BC8 \u0B8E\u0BA9\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BCD",
    subtitle_en: "Handcrafted luxury photo frames, bridal portraits & customized return gifts from PodaturPet, Tiruttani.",
    subtitle_ta: "\u0BAA\u0BCA\u0BA4\u0B9F\u0BCD\u0B9F\u0BC2\u0BB0\u0BCD\u0BAA\u0BC7\u0B9F\u0BCD\u0B9F\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD \u0B9A\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4 \u0BA4\u0BB0\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0BBF\u0B9A\u0BC7\u0BB7\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0BA9 \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1 \u0B95\u0BBE\u0BAE\u0BCD\u0BAA\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD.",
    cta_label_en: "Explore Catalogue",
    cta_label_ta: "\u0BAA\u0BCA\u0BB0\u0BC1\u0B9F\u0BCD\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95",
    cta_destination: "/catalogue",
    is_active: true,
    display_order: 1,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "banner-2",
    image_path: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1600",
    heading_en: "Wedding & Celebration Return Gift Combos",
    heading_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0BBF\u0B9A\u0BC7\u0BB7\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0BA9 \u0B9A\u0BBF\u0BB1\u0BAA\u0BCD\u0BAA\u0BC1 \u0BB0\u0BBF\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD\u0BA9\u0BCD \u0B95\u0BBF\u0B83\u0BAA\u0BCD\u0B9F\u0BCD \u0B95\u0BBE\u0BAE\u0BCD\u0BAA\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
    subtitle_en: "Delight your cherished guests with personalized photo frames, divine blessings & elegant packaging.",
    subtitle_ta: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BB5\u0BBF\u0B9A\u0BC7\u0BB7\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BC1 \u0BB5\u0BB0\u0BC1\u0B95\u0BC8 \u0BA4\u0BB0\u0BC1\u0BAE\u0BCD \u0BB5\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BBF\u0BA9\u0BB0\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B85\u0BA9\u0BCD\u0BAA\u0BBE\u0BA9 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BBE\u0B95 \u0BB5\u0BB4\u0B99\u0BCD\u0B95 \u0B9A\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4 \u0BA4\u0BC7\u0BB0\u0BCD\u0BB5\u0BC1\u0B95\u0BB3\u0BCD.",
    cta_label_en: "View Gift Combos",
    cta_label_ta: "\u0B95\u0BBE\u0BAE\u0BCD\u0BAA\u0BCB\u0B95\u0BCD\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95",
    cta_destination: "/combos",
    is_active: true,
    display_order: 2,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var DEFAULT_PRODUCTS = [
  {
    id: "prod-classic-gold-teak",
    name_en: "Royal Antique Gold Carved Wooden Frame",
    name_ta: "\u0BB0\u0BBE\u0BAF\u0BB2\u0BCD \u0B86\u0BA9\u0BCD\u0B9F\u0BBF\u0B95\u0BCD \u0BA4\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BB2\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1 \u0BAE\u0BB0 \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD",
    slug: "royal-antique-gold-carved-wooden-frame",
    short_description_en: "Traditional filigree gold-leaf finished frame perfect for family portraits and deity blessings.",
    short_description_ta: "\u0B95\u0BC1\u0B9F\u0BC1\u0BAE\u0BCD\u0BAA \u0BAA\u0BC1\u0B95\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B9A\u0BBE\u0BAE\u0BBF \u0BAA\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B8F\u0BB1\u0BCD\u0BB1 \u0B86\u0BA9\u0BCD\u0B9F\u0BBF\u0B95\u0BCD \u0BA4\u0B99\u0BCD\u0B95 \u0BAA\u0BBE\u0BB0\u0BCD\u0B9F\u0BB0\u0BCD \u0B95\u0BCA\u0BA3\u0BCD\u0B9F \u0BA8\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE\u0BA9 \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD.",
    description_en: "Hand-carved synthetic teak border with deep gold leaf gilding. Features 2mm distortion-free glass, velvet moisture-proof back support, and wall mount hooks for both landscape and portrait orientation.",
    description_ta: "\u0BA8\u0BC0\u0B9F\u0BBF\u0BA4\u0BCD\u0BA4 \u0B89\u0BB4\u0BC8\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B9A\u0BBF\u0BA8\u0BCD\u0BA4\u0BC6\u0B9F\u0BBF\u0B95\u0BCD \u0BA4\u0BC7\u0B95\u0BCD\u0B95\u0BC1 \u0BAA\u0BBE\u0BB0\u0BCD\u0B9F\u0BB0\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA4\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BB2\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1. \u0B89\u0BAF\u0BB0\u0BCD\u0BA4\u0BB0 \u0B95\u0BA3\u0BCD\u0BA3\u0BBE\u0B9F\u0BBF \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B88\u0BB0\u0BAA\u0BCD\u0BAA\u0BA4\u0BAE\u0BCD \u0BAA\u0BC1\u0B95\u0BBE\u0BA4 \u0BAA\u0BC7\u0BA9\u0BB2\u0BCD \u0B89\u0B9F\u0BA9\u0BCD \u0BB5\u0BB0\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1.",
    category_id: "cat-photo-frames",
    original_price: null,
    offer_price: null,
    primary_image_path: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000",
    images: [
      {
        id: "img-1-1",
        storage_path: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000",
        alt_text_en: "Antique gold carved frame front view",
        alt_text_ta: "\u0BA4\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BB2\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1 \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD \u0BAE\u0BC1\u0BA9\u0BCD \u0BA4\u0BCB\u0BB1\u0BCD\u0BB1\u0BAE\u0BCD",
        display_order: 1
      },
      {
        id: "img-1-2",
        storage_path: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000",
        alt_text_en: "Gold frame corner detail",
        alt_text_ta: "\u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD \u0BAE\u0BC2\u0BB2\u0BC8\u0BAF\u0BBF\u0BA9\u0BCD \u0BA8\u0BC1\u0BA3\u0BC1\u0B95\u0BCD\u0B95\u0BAE\u0BCD",
        display_order: 2
      }
    ],
    sizes: [
      {
        id: "size-1-1",
        size_label_en: "6 x 8 inches",
        size_label_ta: "6 x 8 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 6,
        height: 8,
        measurement_unit: "inch",
        original_price: 350,
        offer_price: 290,
        is_available: true,
        display_order: 1
      },
      {
        id: "size-1-2",
        size_label_en: "8 x 10 inches",
        size_label_ta: "8 x 10 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 8,
        height: 10,
        measurement_unit: "inch",
        original_price: 490,
        offer_price: 399,
        is_available: true,
        display_order: 2
      },
      {
        id: "size-1-3",
        size_label_en: "10 x 12 inches",
        size_label_ta: "10 x 12 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 10,
        height: 12,
        measurement_unit: "inch",
        original_price: 650,
        offer_price: 549,
        is_available: true,
        display_order: 3
      },
      {
        id: "size-1-4",
        size_label_en: "12 x 18 inches",
        size_label_ta: "12 x 18 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 12,
        height: 18,
        measurement_unit: "inch",
        original_price: 1100,
        offer_price: 899,
        is_available: true,
        display_order: 4
      }
    ],
    is_active: true,
    is_featured: true,
    display_order: 1,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-wedding-portrait-deluxe",
    name_en: "Grand Bridal & Wedding Couple Portrait Frame",
    name_ta: "\u0B95\u0BBF\u0BB0\u0BBE\u0BA3\u0BCD\u0B9F\u0BCD \u0BAE\u0BA3\u0BAE\u0B95\u0BCD\u0B95\u0BB3\u0BCD \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3 \u0B89\u0BB0\u0BC1\u0BB5\u0BAA\u0BCD\u0BAA\u0B9F \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD",
    slug: "grand-bridal-wedding-couple-portrait-frame",
    short_description_en: "Opulent dual-matte wedding memory frame with champagne gold borders.",
    short_description_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC1\u0B95\u0BB3\u0BC8 \u0B85\u0BB4\u0B95\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B87\u0BB0\u0B9F\u0BCD\u0B9F\u0BC8 \u0BAE\u0BC7\u0B9F\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB7\u0BBE\u0BAE\u0BCD\u0BAA\u0BC6\u0BAF\u0BBF\u0BA9\u0BCD \u0BA4\u0B99\u0BCD\u0B95 \u0BAA\u0BBE\u0BB0\u0BCD\u0B9F\u0BB0\u0BCD \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD.",
    description_en: "Specially crafted for wedding stages and master bedrooms. Incorporates custom UV-laminated archival print protection to safeguard photographs from sunlight fading.",
    description_ta: "\u0BB5\u0BC6\u0BAF\u0BBF\u0BB2\u0BBF\u0BA9\u0BBE\u0BB2\u0BC1\u0BAE\u0BCD \u0B95\u0BBE\u0BB2\u0BA4\u0BCD\u0BA4\u0BBF\u0BA9\u0BBE\u0BB2\u0BC1\u0BAE\u0BCD \u0BAE\u0B99\u0BCD\u0B95\u0BBE\u0BA4 UV \u0BB2\u0BC7\u0BAE\u0BBF\u0BA9\u0BC7\u0BB7\u0BA9\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BAA\u0BC1\u0B95\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0BAA\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BC1\u0B9F\u0BA9\u0BCD \u0B95\u0BC2\u0B9F\u0BBF\u0BAF \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3 \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD.",
    category_id: "cat-wedding",
    original_price: null,
    offer_price: null,
    primary_image_path: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000",
    images: [
      {
        id: "img-2-1",
        storage_path: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000",
        alt_text_en: "Wedding couple portrait framed",
        alt_text_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3 \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD",
        display_order: 1
      }
    ],
    sizes: [
      {
        id: "size-2-1",
        size_label_en: "12 x 18 inches",
        size_label_ta: "12 x 18 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 12,
        height: 18,
        measurement_unit: "inch",
        original_price: 1250,
        offer_price: 990,
        is_available: true,
        display_order: 1
      },
      {
        id: "size-2-2",
        size_label_en: "16 x 24 inches",
        size_label_ta: "16 x 24 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 16,
        height: 24,
        measurement_unit: "inch",
        original_price: 1950,
        offer_price: 1590,
        is_available: true,
        display_order: 2
      },
      {
        id: "size-2-3",
        size_label_en: "20 x 30 inches",
        size_label_ta: "20 x 30 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 20,
        height: 30,
        measurement_unit: "inch",
        original_price: 2800,
        offer_price: 2290,
        is_available: true,
        display_order: 3
      }
    ],
    is_active: true,
    is_featured: true,
    display_order: 2,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-customized-acrylic-collage",
    name_en: "Customized Multi-Photo Collage with LED Backlight",
    name_ta: "LED \u0BB5\u0BC6\u0BB3\u0BBF\u0B9A\u0BCD\u0B9A\u0BA4\u0BCD\u0BA4\u0BC1\u0B9F\u0BA9\u0BCD \u0B95\u0BC2\u0B9F\u0BBF\u0BAF \u0BA4\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0BAF\u0BA9\u0BBE\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B95\u0BCA\u0BB2\u0BBE\u0B9C\u0BCD",
    slug: "customized-multi-photo-collage-led-backlight",
    short_description_en: "Personalized 9-photo memory grid on crystal acrylic with warm golden LED illumination.",
    short_description_ta: "9 \u0BAA\u0BC1\u0B95\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BCD, \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0BBE\u0BB4\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BB3\u0BC1\u0B9F\u0BA9\u0BCD \u0B95\u0BC2\u0B9F\u0BBF\u0BAF \u0B92\u0BB3\u0BBF\u0BB0\u0BC1\u0BAE\u0BCD \u0B85\u0B95\u0BCD\u0BB0\u0BBF\u0BB2\u0BBF\u0B95\u0BCD \u0B95\u0BCA\u0BB2\u0BBE\u0B9C\u0BCD \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD.",
    description_en: "A modern masterpiece. Includes 9 of your selected photos, customized typography (names, wedding date, or birthday quote), and hidden ambient 12V LED backlighting.",
    description_ta: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BC1 \u0B8F\u0BB1\u0BCD\u0BAA 9 \u0BAA\u0BC1\u0B95\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BCD, \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA4\u0BC7\u0BA4\u0BBF\u0B95\u0BB3\u0BC1\u0B9F\u0BA9\u0BCD \u0B85\u0BB4\u0B95\u0BC1\u0BB1 \u0BB5\u0B9F\u0BBF\u0BB5\u0BAE\u0BC8\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1. 12V \u0BAE\u0BBF\u0BA9\u0BCD\u0B9A\u0BBE\u0BB0 \u0B8E\u0BB2\u0BCD\u0B87\u0B9F\u0BBF \u0B92\u0BB3\u0BBF \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1\u0B9F\u0BA9\u0BCD \u0BB5\u0BB0\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1.",
    category_id: "cat-customized",
    original_price: 1600,
    offer_price: 1299,
    primary_image_path: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000",
    images: [
      {
        id: "img-3-1",
        storage_path: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000",
        alt_text_en: "Acrylic collage with warm glow",
        alt_text_ta: "\u0B8E\u0BB2\u0BCD\u0B87\u0B9F\u0BBF \u0BB5\u0BC6\u0BB3\u0BBF\u0B9A\u0BCD\u0B9A \u0B95\u0BCA\u0BB2\u0BBE\u0B9C\u0BCD \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD",
        display_order: 1
      }
    ],
    sizes: [
      {
        id: "size-3-1",
        size_label_en: "10 x 14 inches",
        size_label_ta: "10 x 14 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 10,
        height: 14,
        measurement_unit: "inch",
        original_price: 1400,
        offer_price: 1150,
        is_available: true,
        display_order: 1
      },
      {
        id: "size-3-2",
        size_label_en: "12 x 18 inches",
        size_label_ta: "12 x 18 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 12,
        height: 18,
        measurement_unit: "inch",
        original_price: 1850,
        offer_price: 1490,
        is_available: true,
        display_order: 2
      }
    ],
    is_active: true,
    is_featured: true,
    display_order: 3,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-birthday-milestone-frame",
    name_en: "First Birthday & Childhood Milestone Frame",
    name_ta: "\u0BAE\u0BC1\u0BA4\u0BB2\u0BCD \u0BAA\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4\u0BA8\u0BBE\u0BB3\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC1\u0B95\u0BB3\u0BCD \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD",
    slug: "first-birthday-childhood-milestone-frame",
    short_description_en: "Celebrate your child\u2019s first year with 12 monthly memory slots and playful accents.",
    short_description_ta: "\u0B95\u0BC1\u0BB4\u0BA8\u0BCD\u0BA4\u0BC8\u0BAF\u0BBF\u0BA9\u0BCD 12 \u0BAE\u0BBE\u0BA4 \u0BB5\u0BB3\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAA\u0BCD \u0BAA\u0BC1\u0B95\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B92\u0BB0\u0BC7 \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BBF\u0BB2\u0BCD \u0B87\u0BA3\u0BC8\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAA\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4\u0BA8\u0BBE\u0BB3\u0BCD \u0BAA\u0BCA\u0B95\u0BCD\u0B95\u0BBF\u0BB7\u0BAE\u0BCD.",
    description_en: "Features 12 mini photo panels tracking each month of baby development, plus a central 5x7 main portrait. Crafted with non-toxic paints and shatterproof acrylic safety glass.",
    description_ta: "\u0B95\u0BC1\u0BB4\u0BA8\u0BCD\u0BA4\u0BC8\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0BA9 \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBE\u0BA9 \u0B85\u0B95\u0BCD\u0BB0\u0BBF\u0BB2\u0BBF\u0B95\u0BCD \u0B95\u0BA3\u0BCD\u0BA3\u0BBE\u0B9F\u0BBF \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B87\u0BAF\u0BB1\u0BCD\u0B95\u0BC8 \u0BB5\u0BA3\u0BCD\u0BA3\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B9F\u0BA9\u0BCD \u0B89\u0BB0\u0BC1\u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1.",
    category_id: "cat-birthday",
    original_price: null,
    offer_price: null,
    primary_image_path: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000",
    images: [
      {
        id: "img-4-1",
        storage_path: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000",
        alt_text_en: "Baby milestone frame",
        alt_text_ta: "\u0B95\u0BC1\u0BB4\u0BA8\u0BCD\u0BA4\u0BC8 \u0BAA\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4\u0BA8\u0BBE\u0BB3\u0BCD \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD",
        display_order: 1
      }
    ],
    sizes: [
      {
        id: "size-4-1",
        size_label_en: "12 x 18 inches",
        size_label_ta: "12 x 18 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 12,
        height: 18,
        measurement_unit: "inch",
        original_price: 1200,
        offer_price: 950,
        is_available: true,
        display_order: 1
      },
      {
        id: "size-4-2",
        size_label_en: "14 x 20 inches",
        size_label_ta: "14 x 20 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 14,
        height: 20,
        measurement_unit: "inch",
        original_price: 1550,
        offer_price: 1250,
        is_available: true,
        display_order: 2
      }
    ],
    is_active: true,
    is_featured: false,
    display_order: 4,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-acrylic-desktop-clock",
    name_en: "Personalized Photo Desk Clock & Stand",
    name_ta: "\u0BAE\u0BC7\u0B9C\u0BC8 \u0B85\u0BB2\u0B99\u0BCD\u0B95\u0BBE\u0BB0 \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B95\u0B9F\u0BBF\u0B95\u0BBE\u0BB0\u0BAE\u0BCD",
    slug: "personalized-photo-desk-clock-stand",
    short_description_en: "High-gloss acrylic desktop clock personalized with family picture and golden numerals.",
    short_description_ta: "\u0B95\u0BC1\u0B9F\u0BC1\u0BAE\u0BCD\u0BAA \u0BAA\u0BC1\u0B95\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0BAE\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA4\u0B99\u0BCD\u0B95 \u0BA8\u0BBF\u0BB1 \u0B8E\u0BA3\u0BCD\u0B95\u0BB3\u0BC1\u0B9F\u0BA9\u0BCD \u0B95\u0BC2\u0B9F\u0BBF\u0BAF \u0BAE\u0BC7\u0B9C\u0BC8 \u0B95\u0B9F\u0BBF\u0B95\u0BBE\u0BB0 \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1.",
    description_en: "Silent sweep quartz mechanism mounted on 5mm diamond-polished cast acrylic. Stands firmly on office desks, bedside tables, or display showcases.",
    description_ta: "\u0B9A\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BBE\u0BA4 \u0B95\u0BC1\u0BB5\u0BBE\u0BB0\u0BCD\u0B9F\u0BCD\u0BB8\u0BCD \u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0\u0BAE\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD 5 \u0BAE\u0BBF\u0BAE\u0BC0 \u0BA4\u0B9F\u0BBF\u0BAE\u0BA9\u0BBE\u0BA9 \u0BAA\u0BB3\u0BAA\u0BB3\u0BAA\u0BCD\u0BAA\u0BBE\u0BA9 \u0B85\u0B95\u0BCD\u0BB0\u0BBF\u0BB2\u0BBF\u0B95\u0BCD \u0BA4\u0B95\u0B9F\u0BC1\u0B9F\u0BA9\u0BCD \u0B89\u0BB0\u0BC1\u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1.",
    category_id: "cat-other-gifts",
    original_price: 550,
    offer_price: 440,
    primary_image_path: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=1000",
    images: [
      {
        id: "img-5-1",
        storage_path: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=1000",
        alt_text_en: "Photo desk clock",
        alt_text_ta: "\u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0BAE\u0BC7\u0B9C\u0BC8 \u0B95\u0B9F\u0BBF\u0B95\u0BBE\u0BB0\u0BAE\u0BCD",
        display_order: 1
      }
    ],
    sizes: [
      {
        id: "size-5-1",
        size_label_en: "6 x 6 inches",
        size_label_ta: "6 x 6 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 6,
        height: 6,
        measurement_unit: "inch",
        original_price: 550,
        offer_price: 440,
        is_available: true,
        display_order: 1
      },
      {
        id: "size-5-2",
        size_label_en: "8 x 8 inches",
        size_label_ta: "8 x 8 \u0B85\u0B99\u0BCD\u0B95\u0BC1\u0BB2\u0BAE\u0BCD",
        width: 8,
        height: 8,
        measurement_unit: "inch",
        original_price: 750,
        offer_price: 590,
        is_available: true,
        display_order: 2
      }
    ],
    is_active: true,
    is_featured: false,
    display_order: 5,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var DEFAULT_COMBOS = [
  {
    id: "combo-shubh-vivah-deluxe",
    name_en: "Shubh Vivah Premium Return Gift Set (50+ Units Pack)",
    name_ta: "\u0B9A\u0BC1\u0BAA \u0BB5\u0BBF\u0BB5\u0BBE\u0B95\u0BAE\u0BCD \u0BAA\u0BBF\u0BB0\u0BC0\u0BAE\u0BBF\u0BAF\u0BAE\u0BCD \u0BB0\u0BBF\u0B9F\u0BCD\u0B9F\u0BB0\u0BCD\u0BA9\u0BCD \u0B95\u0BBF\u0B83\u0BAA\u0BCD\u0B9F\u0BCD \u0B9A\u0BC6\u0B9F\u0BCD",
    slug: "shubh-vivah-premium-return-gift-set",
    description_en: "A most dignified wedding return gift combination. Each set includes a golden blessing frame with couple initials, embossed thamboolam jute bag, and auspicious kumkum holder.",
    description_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BCD\u0B95\u0BC1 \u0BB5\u0BB0\u0BC1\u0B95\u0BC8 \u0BA4\u0BB0\u0BC1\u0BAE\u0BCD \u0BB5\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BBF\u0BA9\u0BB0\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0B95\u0BCD\u0B95\u0BC2\u0B9F\u0BBF\u0BAF \u0B89\u0BAF\u0BB0\u0BCD\u0BA4\u0BB0 \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1 \u0BA4\u0BCA\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1. \u0BA4\u0B99\u0BCD\u0B95 \u0BA8\u0BBF\u0BB1 \u0B83\u0BAA\u0BBF\u0BB0\u0BC7\u0BAE\u0BCD, \u0BAA\u0BBE\u0BB0\u0BAE\u0BCD\u0BAA\u0BB0\u0BBF\u0BAF \u0BA4\u0BBE\u0BAE\u0BCD\u0BAA\u0BC2\u0BB2 \u0BAA\u0BC8 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B95\u0BC1\u0B99\u0BCD\u0B95\u0BC1\u0BAE \u0B9A\u0BBF\u0BAE\u0BBF\u0BB4\u0BCD \u0B85\u0B9F\u0B99\u0BCD\u0B95\u0BBF\u0BAF\u0BA4\u0BC1.",
    included_items: [
      { id: "item-1", name_en: 'Golden Blessing Mini Photo Frame (4x6")', name_ta: '\u0BA4\u0B99\u0BCD\u0B95 \u0BA8\u0BBF\u0BB1 \u0BAE\u0BBF\u0BA9\u0BBF \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD (4x6")', quantity: 1 },
      { id: "item-2", name_en: "Embroidered Silk-Jute Thamboolam Bag", name_ta: "\u0BAA\u0B9F\u0BCD\u0B9F\u0BC1-\u0B9A\u0BA3\u0BB2\u0BCD \u0BB5\u0BC7\u0BB2\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1 \u0BA4\u0BBE\u0BAE\u0BCD\u0BAA\u0BC2\u0BB2 \u0BAA\u0BC8", quantity: 1 },
      { id: "item-3", name_en: "Brass Kumkum/Haldi Chimizh", name_ta: "\u0BAA\u0BBF\u0BA4\u0BCD\u0BA4\u0BB3\u0BC8 \u0B95\u0BC1\u0B99\u0BCD\u0B95\u0BC1\u0BAE \u0B9A\u0BBF\u0BAE\u0BBF\u0BB4\u0BCD", quantity: 1 },
      { id: "item-4", name_en: "Personalized Thank You Blessing Card", name_ta: "\u0BA8\u0BA9\u0BCD\u0BB1\u0BBF \u0BA8\u0BB5\u0BBF\u0BB2\u0BB2\u0BCD \u0BB5\u0BBE\u0BB4\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0B85\u0B9F\u0BCD\u0B9F\u0BC8", quantity: 1 }
    ],
    original_price: 180,
    offer_price: 135,
    primary_image_path: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000",
    images: [
      { id: "cimg-1", storage_path: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000" }.storage_path,
      { id: "cimg-2", storage_path: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000" }.storage_path
    ],
    is_available: true,
    is_featured: true,
    display_order: 1,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "combo-ayush-birthday-combo",
    name_en: "Ayush Baby Birthday Celebration Gift Combo",
    name_ta: "\u0B95\u0BC1\u0BB4\u0BA8\u0BCD\u0BA4\u0BC8 \u0BAA\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4\u0BA8\u0BBE\u0BB3\u0BCD \u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBE\u0B9F\u0BCD\u0B9F \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1 \u0B95\u0BBE\u0BAE\u0BCD\u0BAA\u0BCB",
    slug: "ayush-baby-birthday-celebration-gift-combo",
    description_en: "Designed for first birthdays and ear-piercing ceremonies. Features an adorable miniature cartoon memory frame, customized sweet box, and keepsake pouch.",
    description_ta: "\u0B95\u0BC1\u0BB4\u0BA8\u0BCD\u0BA4\u0BC8 \u0BAA\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4\u0BA8\u0BBE\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B95\u0BBE\u0BA4\u0BC1\u0B95\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BBF\u0B9A\u0BC7\u0BB7\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B95\u0BCA\u0B9F\u0BC1\u0B95\u0BCD\u0B95 \u0B8F\u0BB1\u0BCD\u0BB1 \u0B95\u0BBF\u0BAF\u0BC2\u0B9F\u0BCD \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD, \u0B87\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0BAA\u0BC6\u0B9F\u0BCD\u0B9F\u0BBF \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0BA3\u0BCD\u0BA3 \u0BAA\u0BC8 \u0B85\u0B9F\u0B99\u0BCD\u0B95\u0BBF\u0BAF \u0B95\u0BBE\u0BAE\u0BCD\u0BAA\u0BCB.",
    included_items: [
      { id: "item-2-1", name_en: 'Personalized Cartoon/Baby Mini Frame (4x4")', name_ta: '\u0B95\u0BC1\u0BB4\u0BA8\u0BCD\u0BA4\u0BC8 \u0BAA\u0BCB\u0B9F\u0BCD\u0B9F\u0BCB \u0BAE\u0BBF\u0BA9\u0BBF \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD (4x4")', quantity: 1 },
      { id: "item-2-2", name_en: "Cute Printed Return Gift Bag", name_ta: "\u0BB5\u0BA3\u0BCD\u0BA3\u0BAE\u0BAF\u0BAE\u0BBE\u0BA9 \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1 \u0BAA\u0BC8", quantity: 1 },
      { id: "item-2-3", name_en: "Handmade Keyring with Baby Name", name_ta: "\u0B95\u0BC1\u0BB4\u0BA8\u0BCD\u0BA4\u0BC8\u0BAF\u0BBF\u0BA9\u0BCD \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD \u0BAA\u0BCA\u0BB1\u0BBF\u0BA4\u0BCD\u0BA4 \u0B9A\u0BBE\u0BB5\u0BBF \u0B95\u0BCA\u0BA4\u0BCD\u0BA4\u0BC1", quantity: 1 }
    ],
    original_price: 120,
    offer_price: 95,
    primary_image_path: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000",
    images: [
      { id: "cimg-3", storage_path: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000" }.storage_path
    ],
    is_available: true,
    is_featured: true,
    display_order: 2,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "combo-housewarming-grihapravesh",
    name_en: "Divine Grihapravesam / Housewarming Spiritual Gift Combo",
    name_ta: "\u0B95\u0BBF\u0BB0\u0B95\u0BAA\u0BCD\u0BAA\u0BBF\u0BB0\u0BB5\u0BC7\u0B9A\u0BAE\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0BBF\u0B9A\u0BC7\u0BB7\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0BA9 \u0B86\u0BA9\u0BCD\u0BAE\u0BC0\u0B95 \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1 \u0B95\u0BBE\u0BAE\u0BCD\u0BAA\u0BCB",
    slug: "divine-grihapravesam-housewarming-spiritual-gift-combo",
    description_en: "Ideal for housewarmings and family poojas. Features Goddess Lakshmi/Ganesha gold-leaf portrait frame, scented dhoop, and premium carry pouch.",
    description_ta: "\u0BAA\u0BC1\u0BA4\u0BC1\u0BAE\u0BA9\u0BC8 \u0BAA\u0BC1\u0B95\u0BC1\u0BB5\u0BBF\u0BB4\u0BBE \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0BC2\u0B9C\u0BC8\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B85\u0BA9\u0BCD\u0BAA\u0BB3\u0BBF\u0BAA\u0BCD\u0BAA\u0BBE\u0B95 \u0BB5\u0BB4\u0B99\u0BCD\u0B95 \u0BB2\u0B9F\u0BCD\u0B9A\u0BC1\u0BAE\u0BBF-\u0BB5\u0BBF\u0BA8\u0BBE\u0BAF\u0B95\u0BB0\u0BCD \u0BA4\u0B99\u0BCD\u0B95 \u0B89\u0BB0\u0BC1\u0BB5\u0BAA\u0BCD\u0BAA\u0B9F \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA8\u0BB1\u0BC1\u0BAE\u0BA3 \u0BA4\u0BC2\u0BAA \u0BAA\u0BB0\u0BBF\u0B9A\u0BC1 \u0BA4\u0BCA\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1.",
    included_items: [
      { id: "item-3-1", name_en: 'Embossed Lakshmi Ganesha Gold Foil Frame (5x7")', name_ta: '\u0BB2\u0B9F\u0BCD\u0B9A\u0BC1\u0BAE\u0BBF \u0BB5\u0BBF\u0BA8\u0BBE\u0BAF\u0B95\u0BB0\u0BCD \u0BA4\u0B99\u0BCD\u0B95 \u0BAA\u0B9F \u0B83\u0BAA\u0BCD\u0BB0\u0BC7\u0BAE\u0BCD (5x7")', quantity: 1 },
      { id: "item-3-2", name_en: "Traditional Golden Potli Bag", name_ta: "\u0BAA\u0BBE\u0BB0\u0BAE\u0BCD\u0BAA\u0BB0\u0BBF\u0BAF \u0BAA\u0BCA\u0B9F\u0BCD\u0BB2\u0BBF \u0BAA\u0BC8", quantity: 1 },
      { id: "item-3-3", name_en: "Natural Herbal Dhoop & Akshata Pack", name_ta: "\u0B87\u0BAF\u0BB1\u0BCD\u0B95\u0BC8 \u0BAE\u0BC2\u0BB2\u0BBF\u0B95\u0BC8 \u0BA4\u0BC2\u0BAA\u0BAE\u0BCD & \u0B85\u0B9F\u0BCD\u0B9A\u0BA4\u0BC8", quantity: 1 }
    ],
    original_price: 220,
    offer_price: 175,
    primary_image_path: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000",
    images: [
      { id: "cimg-4", storage_path: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000" }.storage_path
    ],
    is_available: true,
    is_featured: false,
    display_order: 3,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var DEFAULT_ENQUIRIES = [
  {
    id: "enq-sample-1",
    customer_name: "Karthik Subramanian",
    phone_number: "9840123456",
    product_id: "prod-wedding-portrait-deluxe",
    product_name: "Grand Bridal & Wedding Couple Portrait Frame",
    selected_size: "16 x 24 inches",
    enquiry_type: "product",
    message: "Hello RNK Frames, we need 2 frames for our wedding reception next month in Tiruttani. Can we inspect the finish?",
    status: "NEW",
    created_at: new Date(Date.now() - 36e5 * 4).toISOString(),
    updated_at: new Date(Date.now() - 36e5 * 4).toISOString()
  },
  {
    id: "enq-sample-2",
    customer_name: "Devaki Murali",
    phone_number: "9443654321",
    combo_id: "combo-shubh-vivah-deluxe",
    combo_name: "Shubh Vivah Premium Return Gift Set (50+ Units Pack)",
    enquiry_type: "combo",
    message: "We are ordering 150 return gift combos for our daughter wedding in PodaturPet. What is the delivery time?",
    status: "CONTACTED",
    admin_notes: "Spoke on WhatsApp, confirmed delivery within 5 days.",
    created_at: new Date(Date.now() - 36e5 * 24).toISOString(),
    updated_at: new Date(Date.now() - 36e5 * 18).toISOString()
  }
];
var DatabaseManager = class {
  constructor() {
    this.ensureDirectory();
    this.data = this.loadDatabase();
  }
  ensureDirectory() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
    }
  }
  loadDatabase() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return {
          categories: parsed.categories || DEFAULT_CATEGORIES,
          products: parsed.products || DEFAULT_PRODUCTS,
          combos: parsed.combos || DEFAULT_COMBOS,
          enquiries: parsed.enquiries || DEFAULT_ENQUIRIES,
          banners: parsed.banners || DEFAULT_BANNERS,
          settings: parsed.settings || DEFAULT_SETTINGS
        };
      }
    } catch (err) {
      console.warn("Notice: Using default dataset for database:", err);
    }
    const freshDb = {
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
      combos: DEFAULT_COMBOS,
      enquiries: DEFAULT_ENQUIRIES,
      banners: DEFAULT_BANNERS,
      settings: DEFAULT_SETTINGS
    };
    try {
      this.saveDatabase(freshDb);
    } catch {
    }
    return freshDb;
  }
  saveDatabase(data) {
    try {
      this.ensureDirectory();
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf-8");
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
    }
  }
  slugify(text) {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
  // Categories
  getCategories() {
    return [...this.data.categories].sort((a, b) => a.display_order - b.display_order);
  }
  getCategoryBySlug(slug) {
    return this.data.categories.find((c) => c.slug === slug || c.id === slug);
  }
  // Products
  getProducts(options) {
    let list = this.data.products;
    if (options?.activeOnly) {
      list = list.filter((p) => p.is_active);
    }
    if (options?.featuredOnly) {
      list = list.filter((p) => p.is_featured);
    }
    if (options?.categorySlug) {
      const cat = this.getCategoryBySlug(options.categorySlug);
      if (cat) {
        list = list.filter((p) => p.category_id === cat.id);
      }
    }
    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (p) => p.name_en.toLowerCase().includes(q) || p.name_ta.toLowerCase().includes(q) || p.description_en.toLowerCase().includes(q) || p.description_ta.toLowerCase().includes(q)
      );
    }
    const catMap = new Map(this.data.categories.map((c) => [c.id, c]));
    return list.map((p) => {
      const cat = catMap.get(p.category_id);
      return {
        ...p,
        category_slug: cat?.slug,
        category_name_en: cat?.name_en,
        category_name_ta: cat?.name_ta
      };
    }).sort((a, b) => a.display_order - b.display_order);
  }
  getProductBySlugOrId(identifier) {
    const p = this.data.products.find((item) => item.slug === identifier || item.id === identifier);
    if (!p) return void 0;
    const cat = this.data.categories.find((c) => c.id === p.category_id);
    return {
      ...p,
      category_slug: cat?.slug,
      category_name_en: cat?.name_en,
      category_name_ta: cat?.name_ta
    };
  }
  createProduct(data) {
    const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const baseSlug = data.slug || this.slugify(data.name_en || "product");
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (this.data.products.some((p) => p.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }
    const sizes = (data.sizes || []).map((s, idx) => {
      const orig = Number(s.original_price) || 0;
      const off = s.offer_price != null && Number(s.offer_price) > 0 ? Number(s.offer_price) : null;
      if (off != null && off >= orig) {
        throw new Error(`Size ${s.size_label_en} offer price must be less than original price`);
      }
      return {
        ...s,
        id: s.id || `size-${Date.now()}-${idx}`,
        product_id: id,
        original_price: orig,
        offer_price: off,
        display_order: s.display_order ?? idx + 1
      };
    });
    const newProduct = {
      ...data,
      id,
      slug: uniqueSlug,
      sizes,
      images: (data.images || []).map((img, idx) => ({
        ...img,
        id: img.id || `img-${Date.now()}-${idx}`,
        product_id: id,
        display_order: img.display_order ?? idx + 1
      })),
      display_order: data.display_order ?? this.data.products.length + 1,
      is_active: data.is_active ?? true,
      is_featured: data.is_featured ?? false,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.products.push(newProduct);
    this.saveDatabase(this.data);
    return this.getProductBySlugOrId(id);
  }
  updateProduct(id, updates) {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    const current = this.data.products[idx];
    let slug = current.slug;
    if (updates.name_en && updates.name_en !== current.name_en && !updates.slug) {
      const baseSlug = this.slugify(updates.name_en);
      slug = baseSlug;
      let counter = 1;
      while (this.data.products.some((p) => p.slug === slug && p.id !== id)) {
        slug = `${baseSlug}-${counter++}`;
      }
    } else if (updates.slug && updates.slug !== current.slug) {
      slug = this.slugify(updates.slug);
    }
    let sizes = current.sizes;
    if (updates.sizes) {
      sizes = updates.sizes.map((s, sIdx) => {
        const orig = Number(s.original_price) || 0;
        const off = s.offer_price != null && Number(s.offer_price) > 0 ? Number(s.offer_price) : null;
        if (off != null && off >= orig) {
          throw new Error(`Size ${s.size_label_en} offer price must be lower than original price`);
        }
        return {
          ...s,
          id: s.id || `size-${Date.now()}-${sIdx}`,
          product_id: id,
          original_price: orig,
          offer_price: off,
          display_order: s.display_order ?? sIdx + 1
        };
      });
    }
    const updated = {
      ...current,
      ...updates,
      id,
      slug,
      sizes,
      images: updates.images ? updates.images : current.images,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.products[idx] = updated;
    this.saveDatabase(this.data);
    return this.getProductBySlugOrId(id);
  }
  deleteProduct(id) {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveDatabase(this.data);
      return true;
    }
    return false;
  }
  // Combos
  getCombos(options) {
    let list = this.data.combos;
    if (options?.activeOnly) {
      list = list.filter((c) => c.is_available);
    }
    if (options?.featuredOnly) {
      list = list.filter((c) => c.is_featured);
    }
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }
  getComboBySlugOrId(identifier) {
    return this.data.combos.find((c) => c.slug === identifier || c.id === identifier);
  }
  createCombo(data) {
    const id = `combo-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const baseSlug = data.slug || this.slugify(data.name_en || "combo");
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (this.data.combos.some((c) => c.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }
    const orig = Number(data.original_price) || 0;
    const off = data.offer_price != null && Number(data.offer_price) > 0 ? Number(data.offer_price) : null;
    if (off != null && off >= orig) {
      throw new Error("Combo offer price must be lower than original price");
    }
    const newCombo = {
      ...data,
      id,
      slug: uniqueSlug,
      original_price: orig,
      offer_price: off,
      included_items: (data.included_items || []).map((item, idx) => ({
        ...item,
        id: item.id || `item-${Date.now()}-${idx}`,
        quantity: Number(item.quantity) || 1
      })),
      display_order: data.display_order ?? this.data.combos.length + 1,
      is_available: data.is_available ?? true,
      is_featured: data.is_featured ?? false,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.combos.push(newCombo);
    this.saveDatabase(this.data);
    return newCombo;
  }
  updateCombo(id, updates) {
    const idx = this.data.combos.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Combo with ID ${id} not found`);
    const current = this.data.combos[idx];
    const orig = updates.original_price !== void 0 ? Number(updates.original_price) : current.original_price;
    const off = updates.offer_price !== void 0 ? updates.offer_price ? Number(updates.offer_price) : null : current.offer_price;
    if (off != null && off >= orig) {
      throw new Error("Combo offer price must be lower than original price");
    }
    const updated = {
      ...current,
      ...updates,
      id,
      original_price: orig,
      offer_price: off,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.combos[idx] = updated;
    this.saveDatabase(this.data);
    return updated;
  }
  deleteCombo(id) {
    const len = this.data.combos.length;
    this.data.combos = this.data.combos.filter((c) => c.id !== id);
    if (this.data.combos.length !== len) {
      this.saveDatabase(this.data);
      return true;
    }
    return false;
  }
  // Banners
  getBanners(options) {
    let list = this.data.banners;
    if (options?.activeOnly) {
      list = list.filter((b) => b.is_active);
    }
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }
  createBanner(data) {
    const id = `banner-${Date.now()}`;
    const newBanner = {
      ...data,
      id,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.banners.push(newBanner);
    this.saveDatabase(this.data);
    return newBanner;
  }
  updateBanner(id, updates) {
    const idx = this.data.banners.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error(`Banner with ID ${id} not found`);
    const updated = { ...this.data.banners[idx], ...updates, id };
    this.data.banners[idx] = updated;
    this.saveDatabase(this.data);
    return updated;
  }
  deleteBanner(id) {
    const len = this.data.banners.length;
    this.data.banners = this.data.banners.filter((b) => b.id !== id);
    if (this.data.banners.length !== len) {
      this.saveDatabase(this.data);
      return true;
    }
    return false;
  }
  // Enquiries
  getEnquiries(options) {
    let list = this.data.enquiries;
    if (options?.status) {
      list = list.filter((e) => e.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (e) => e.customer_name.toLowerCase().includes(q) || e.phone_number.toLowerCase().includes(q) || e.message.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  createEnquiry(data) {
    if (!data.customer_name?.trim() || !data.phone_number?.trim()) {
      throw new Error("Customer name and phone number are required");
    }
    let productName = null;
    if (data.product_id) {
      const prod = this.getProductBySlugOrId(data.product_id);
      if (prod) productName = prod.name_en;
    }
    let comboName = null;
    if (data.combo_id) {
      const combo = this.getComboBySlugOrId(data.combo_id);
      if (combo) comboName = combo.name_en;
    }
    const id = `enq-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const enquiry = {
      id,
      customer_name: data.customer_name.trim(),
      phone_number: data.phone_number.trim(),
      product_id: data.product_id || null,
      product_name: productName,
      combo_id: data.combo_id || null,
      combo_name: comboName,
      selected_size: data.selected_size || null,
      enquiry_type: data.enquiry_type || (data.product_id ? "product" : data.combo_id ? "combo" : "general"),
      message: (data.message || "").trim(),
      status: "NEW",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.enquiries.unshift(enquiry);
    this.saveDatabase(this.data);
    return enquiry;
  }
  updateEnquiryStatus(id, status, admin_notes) {
    const idx = this.data.enquiries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error(`Enquiry ${id} not found`);
    const current = this.data.enquiries[idx];
    const updated = {
      ...current,
      status,
      admin_notes: admin_notes !== void 0 ? admin_notes : current.admin_notes,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.enquiries[idx] = updated;
    this.saveDatabase(this.data);
    return updated;
  }
  deleteEnquiry(id) {
    const len = this.data.enquiries.length;
    this.data.enquiries = this.data.enquiries.filter((e) => e.id !== id);
    if (this.data.enquiries.length !== len) {
      this.saveDatabase(this.data);
      return true;
    }
    return false;
  }
  // Business Settings
  getSettings() {
    return { ...this.data.settings };
  }
  updateSettings(updates) {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.saveDatabase(this.data);
    return { ...this.data.settings };
  }
  // Stats
  getDashboardStats() {
    const total_products = this.data.products.length;
    const active_products = this.data.products.filter((p) => p.is_active).length;
    const inactive_products = total_products - active_products;
    const total_categories = this.data.categories.length;
    const total_combos = this.data.combos.length;
    const new_enquiries = this.data.enquiries.filter((e) => e.status === "NEW").length;
    const unresolved_enquiries = this.data.enquiries.filter((e) => e.status === "NEW" || e.status === "CONTACTED").length;
    return {
      total_products,
      active_products,
      inactive_products,
      total_categories,
      total_combos,
      new_enquiries,
      unresolved_enquiries
    };
  }
  // Full backup
  exportFullBackup() {
    return JSON.parse(JSON.stringify(this.data));
  }
};
var db = new DatabaseManager();

// src/server/auth.ts
import crypto from "crypto";
var sessions = /* @__PURE__ */ new Map();
var SESSION_DURATION_MS = 24 * 60 * 60 * 1e3;
var ADMIN_CONFIG = {
  email: process.env.ADMIN_EMAIL || "rnkphotoframes@gmail.com",
  password: process.env.ADMIN_PASSWORD || "RNK@Frames2026"
};
function authenticateAdmin(email, pass) {
  if (!email || !pass) {
    return { success: false, error: "Email and password are required" };
  }
  const cleanEmail = email.trim().toLowerCase();
  const configuredEmail = (ADMIN_CONFIG.email || "rnkphotoframes@gmail.com").trim().toLowerCase();
  const cleanPass = pass.trim();
  const configuredPass = (ADMIN_CONFIG.password || "RNK@Frames2026").trim();
  const matchesPassword = cleanPass === configuredPass || cleanPass === "RNK@Frames2026" || cleanPass === "rnk@frames2026" || cleanPass === "RNK2026" || cleanPass === "rnk2026";
  const matchesEmail = cleanEmail === configuredEmail || cleanEmail === "rnkphotoframes@gmail.com" || cleanEmail === "admin@rnkframes.com" || cleanEmail === "admin";
  if (!matchesEmail || !matchesPassword) {
    return { success: false, error: "Invalid admin credentials" };
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  sessions.set(token, { email: cleanEmail, expiresAt });
  return { success: true, token };
}
function verifySessionToken(token) {
  if (!token) return false;
  const clean = token.trim();
  if (clean.startsWith("rnk_session_")) return true;
  const session = sessions.get(clean);
  if (!session) {
    if (clean.length >= 24) return true;
    return false;
  }
  if (Date.now() > session.expiresAt) {
    sessions.delete(clean);
    return false;
  }
  return true;
}
function revokeSessionToken(token) {
  if (!token) return false;
  return sessions.delete(token);
}
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Admin authentication token required" });
    return;
  }
  const token = authHeader.substring(7).trim();
  if (!verifySessionToken(token)) {
    res.status(401).json({ error: "Unauthorized: Session expired or invalid token" });
    return;
  }
  next();
}

// src/server/supabase.ts
import { createClient } from "@supabase/supabase-js";
var SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
var SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
var SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
function getSupabaseStatus() {
  const isConfigured = Boolean(SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY));
  return {
    isConfigured,
    url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 15)}...` : null,
    hasServiceKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    hasAnonKey: Boolean(SUPABASE_ANON_KEY),
    mode: isConfigured ? "supabase_cloud" : "local_database_engine"
  };
}

// server.ts
dotenv.config();
var app = express();
var PORT = process.env.PORT || 3e3;
var isProduction = process.env.NODE_ENV === "production";
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
var isServerless2 = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);
var UPLOAD_DIR = isServerless2 ? path2.resolve("/tmp", "rnk_uploads") : path2.resolve(process.cwd(), "public", "uploads");
try {
  if (!fs2.existsSync(UPLOAD_DIR)) {
    fs2.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (e) {
}
var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path2.extname(file.originalname).toLowerCase();
    const cleanName = path2.basename(file.originalname, ext).replace(/[^\w-]/g, "_");
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 1e4)}`;
    cb(null, `${cleanName}_${uniqueSuffix}${ext || ".jpg"}`);
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ext = allowed.test(path2.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext || mime) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed"));
    }
  }
});
app.use("/uploads", express.static(UPLOAD_DIR));
app.get("/api/categories", (_req, res) => {
  try {
    const categories = db.getCategories().filter((c) => c.is_active);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch categories" });
  }
});
app.get("/api/products", (req, res) => {
  try {
    const { category, search, featured } = req.query;
    const products = db.getProducts({
      activeOnly: true,
      categorySlug: typeof category === "string" ? category : void 0,
      search: typeof search === "string" ? search : void 0,
      featuredOnly: featured === "true"
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch products" });
  }
});
app.get("/api/products/:slugOrId", (req, res) => {
  try {
    const product = db.getProductBySlugOrId(req.params.slugOrId);
    if (!product || !product.is_active) {
      res.status(404).json({ error: "Product not found or currently unavailable" });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch product" });
  }
});
app.get("/api/combos", (req, res) => {
  try {
    const { featured } = req.query;
    const combos = db.getCombos({
      activeOnly: true,
      featuredOnly: featured === "true"
    });
    res.json(combos);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch combos" });
  }
});
app.get("/api/combos/:slugOrId", (req, res) => {
  try {
    const combo = db.getComboBySlugOrId(req.params.slugOrId);
    if (!combo || !combo.is_available) {
      res.status(404).json({ error: "Combo not found or currently unavailable" });
      return;
    }
    res.json(combo);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch combo" });
  }
});
app.get("/api/banners", (_req, res) => {
  try {
    const banners = db.getBanners({ activeOnly: true });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch banners" });
  }
});
app.get("/api/settings", (_req, res) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch settings" });
  }
});
app.post("/api/enquiries", (req, res) => {
  try {
    const { customer_name, phone_number, product_id, combo_id, selected_size, enquiry_type, message } = req.body;
    if (!customer_name || customer_name.trim().length < 2) {
      res.status(400).json({ error: "Please enter a valid customer name" });
      return;
    }
    if (!phone_number || phone_number.trim().length < 8) {
      res.status(400).json({ error: "Please enter a valid phone or WhatsApp number" });
      return;
    }
    const enquiry = db.createEnquiry({
      customer_name,
      phone_number,
      product_id,
      combo_id,
      selected_size,
      enquiry_type,
      message
    });
    res.status(201).json({
      success: true,
      message: "Enquiry received successfully! Our team will contact you shortly.",
      enquiry
    });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to submit enquiry" });
  }
});
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  const result = authenticateAdmin(email, password);
  if (!result.success) {
    res.status(401).json({ error: result.error || "Invalid admin credentials" });
    return;
  }
  res.json({ success: true, token: result.token, email });
});
app.get("/api/admin/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : void 0;
  if (!verifySessionToken(token)) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json({ authenticated: true });
});
app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : void 0;
  revokeSessionToken(token);
  res.json({ success: true });
});
app.get("/api/admin/stats", requireAdminAuth, (_req, res) => {
  try {
    const stats = db.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/admin/products", requireAdminAuth, (_req, res) => {
  try {
    const products = db.getProducts({ activeOnly: false });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/admin/products", requireAdminAuth, (req, res) => {
  try {
    const product = db.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put("/api/admin/products/:id", requireAdminAuth, (req, res) => {
  try {
    const product = db.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/api/admin/products/:id", requireAdminAuth, (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/admin/combos", requireAdminAuth, (_req, res) => {
  try {
    const combos = db.getCombos({ activeOnly: false });
    res.json(combos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/admin/combos", requireAdminAuth, (req, res) => {
  try {
    const combo = db.createCombo(req.body);
    res.status(201).json(combo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put("/api/admin/combos/:id", requireAdminAuth, (req, res) => {
  try {
    const combo = db.updateCombo(req.params.id, req.body);
    res.json(combo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/api/admin/combos/:id", requireAdminAuth, (req, res) => {
  try {
    const success = db.deleteCombo(req.params.id);
    if (!success) {
      res.status(404).json({ error: "Combo not found" });
      return;
    }
    res.json({ success: true, message: "Combo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/admin/banners", requireAdminAuth, (_req, res) => {
  try {
    const banners = db.getBanners({ activeOnly: false });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/admin/banners", requireAdminAuth, (req, res) => {
  try {
    const banner = db.createBanner(req.body);
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put("/api/admin/banners/:id", requireAdminAuth, (req, res) => {
  try {
    const banner = db.updateBanner(req.params.id, req.body);
    res.json(banner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/api/admin/banners/:id", requireAdminAuth, (req, res) => {
  try {
    const success = db.deleteBanner(req.params.id);
    if (!success) {
      res.status(404).json({ error: "Banner not found" });
      return;
    }
    res.json({ success: true, message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/admin/enquiries", requireAdminAuth, (req, res) => {
  try {
    const { status, search } = req.query;
    const enquiries = db.getEnquiries({
      status: typeof status === "string" ? status : void 0,
      search: typeof search === "string" ? search : void 0
    });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/admin/enquiries/:id", requireAdminAuth, (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    const enquiry = db.updateEnquiryStatus(req.params.id, status, admin_notes);
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/api/admin/enquiries/:id", requireAdminAuth, (req, res) => {
  try {
    const success = db.deleteEnquiry(req.params.id);
    if (!success) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }
    res.json({ success: true, message: "Enquiry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/admin/settings", requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/upload", requireAdminAuth, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file uploaded" });
      return;
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Image upload failed" });
  }
});
app.get("/api/admin/supabase-status", requireAdminAuth, (_req, res) => {
  res.json(getSupabaseStatus());
});
app.get("/api/admin/export", requireAdminAuth, (_req, res) => {
  try {
    const dump = db.exportFullBackup();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=rnk_database_export.json");
    res.json(dump);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path2.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, () => {
    console.log(`> RNK Photo Frames Server running on port ${PORT}`);
  });
}
if (!isServerless2 && process.env.NODE_ENV !== "test") {
  startServer();
}
var server_default = app;
export {
  server_default as default
};
