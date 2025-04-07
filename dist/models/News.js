"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
// src/models/News.ts
const kysely_1 = require("kysely");
const db_1 = require("../config/db");
class News {
    // Get all news items, sorted by creation date in descending order
    static find() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Select all fields except the binary image data to keep response size smaller
                const result = yield db_1.db
                    .selectFrom('news')
                    .select(['id', 'title', 'description', 'image_name', 'image_mime', 'created_at'])
                    .orderBy('created_at', 'desc')
                    .execute();
                return result.filter(item => item.created_at !== null);
            }
            catch (error) {
                console.error('Error fetching news:', error);
                throw error;
            }
        });
    }
    // Find a news item by ID
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.db
                    .selectFrom('news')
                    .selectAll()
                    .where('id', '=', id)
                    .executeTakeFirst();
                if (result && result.created_at === null) {
                    throw new Error('Invalid data: created_at cannot be null');
                }
                return result || null;
            }
            catch (error) {
                console.error('Error finding news by ID:', error);
                throw error;
            }
        });
    }
    // Get image data for a specific news item
    static getImageData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.db
                    .selectFrom('news')
                    .select(['image_data', 'image_mime'])
                    .where('id', '=', id)
                    .executeTakeFirst();
                if (!result)
                    return null;
                return { data: result.image_data, mime: result.image_mime };
            }
            catch (error) {
                console.error('Error fetching image data:', error);
                throw error;
            }
        });
    }
    // Create a new news item
    static create(newsData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Use raw SQL for the insert to avoid TypeScript issues
                const query = (0, kysely_1.sql) `
        INSERT INTO news (title, description, image_data, image_name, image_mime)
        VALUES (${newsData.title}, ${newsData.description}, ${newsData.image_data}, ${newsData.image_name}, ${newsData.image_mime})
        RETURNING id, title, description, image_name, image_mime, created_at
      `;
                const result = yield query.execute(db_1.db);
                if (!result.rows || result.rows.length === 0) {
                    throw new Error('Failed to create news item');
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Error creating news:', error);
                throw error;
            }
        });
    }
    // Update an existing news item
    static update(id, newsData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Start building the update query
                let updateQuery = db_1.db.updateTable('news');
                // Add SET clauses dynamically based on provided data
                if (newsData.title !== undefined) {
                    updateQuery = updateQuery.set({ title: newsData.title });
                }
                if (newsData.description !== undefined) {
                    updateQuery = updateQuery.set({ description: newsData.description });
                }
                if (newsData.image_data !== undefined) {
                    updateQuery = updateQuery.set({ image_data: newsData.image_data });
                }
                if (newsData.image_name !== undefined) {
                    updateQuery = updateQuery.set({ image_name: newsData.image_name });
                }
                if (newsData.image_mime !== undefined) {
                    updateQuery = updateQuery.set({ image_mime: newsData.image_mime });
                }
                // If there's nothing to update, just return the existing record
                if (Object.keys(newsData).length === 0) {
                    return this.findById(id);
                }
                // Complete the query with WHERE clause and RETURNING
                const result = yield updateQuery
                    .where('id', '=', id)
                    .returning(['id', 'title', 'description', 'image_name', 'image_mime', 'created_at'])
                    .executeTakeFirst();
                return result || null;
            }
            catch (error) {
                console.error('Error updating news:', error);
                throw error;
            }
        });
    }
    // Delete a news item
    static delete(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.db
                    .deleteFrom('news')
                    .where('id', '=', id)
                    .execute();
                return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.numDeletedRows) > 0;
            }
            catch (error) {
                console.error('Error deleting news:', error);
                throw error;
            }
        });
    }
}
exports.News = News;
