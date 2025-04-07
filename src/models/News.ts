// // src/models/News.ts
// import { sql } from 'kysely';
// import { db } from '../config/db';
// import { NewsInput, NewsOutput } from '../types';

// export class News {
//   static async find(): Promise<NewsOutput[]> {
//     try {
//       const result = await db
//         .selectFrom('news')
//         .select(['id', 'title', 'description', 'image_name', 'image_mime', 'created_at'])
//         .orderBy('created_at', 'desc')
//         .execute();
      
//       return result.filter(item => item.created_at !== null) as NewsOutput[];
//     } catch (error) {
//       console.error('Error fetching news:', error);
//       throw error;
//     }
//   }
//   static async findById(id: number): Promise<NewsOutput | null> {
//     try {
//       const result = await db
//         .selectFrom('news')
//         .selectAll()
//         .where('id', '=', id)
//         .executeTakeFirst();
      
//       if (result && result.created_at === null) {
//         throw new Error('Invalid data: created_at cannot be null');
//       }
//       return result as NewsOutput || null;
//     } catch (error) {
//       console.error('Error finding news by ID:', error);
//       throw error;
//     }
//   }
//   static async getImageData(id: number): Promise<{ data: Buffer; mime: string } | null> {
//     try {
//       const result = await db
//         .selectFrom('news')
//         .select(['image_data', 'image_mime'])
//         .where('id', '=', id)
//         .executeTakeFirst();
      
//       if (!result) return null;
//       return { data: result.image_data, mime: result.image_mime };
//     } catch (error) {
//       console.error('Error fetching image data:', error);
//       throw error;
//     }
//   }

//   // Create a new news item
//   static async create(newsData: NewsInput): Promise<NewsOutput> {
//     try {
//       // Use raw SQL for the insert to avoid TypeScript issues
//       const query = sql`
//         INSERT INTO news (title, description, image_data, image_name, image_mime)
//         VALUES (${newsData.title}, ${newsData.description}, ${newsData.image_data}, ${newsData.image_name}, ${newsData.image_mime})
//         RETURNING id, title, description, image_name, image_mime, created_at
//       `;
      
//       const result = await query.execute(db);
      
//       if (!result.rows || result.rows.length === 0) {
//         throw new Error('Failed to create news item');
//       }
      
//       return result.rows[0] as NewsOutput;
//     } catch (error) {
//       console.error('Error creating news:', error);
//       throw error;
//     }
//   }

//   // Update an existing news item
//   static async update(id: number, newsData: Partial<NewsInput>): Promise<NewsOutput | null> {
//     try {
//       // Start building the update query
//       let updateQuery = db.updateTable('news');
      
//       // Add SET clauses dynamically based on provided data
//       if (newsData.title !== undefined) {
//         updateQuery = updateQuery.set({ title: newsData.title });
//       }
      
//       if (newsData.description !== undefined) {
//         updateQuery = updateQuery.set({ description: newsData.description });
//       }
      
//       if (newsData.image_data !== undefined) {
//         updateQuery = updateQuery.set({ image_data: newsData.image_data });
//       }
      
//       if (newsData.image_name !== undefined) {
//         updateQuery = updateQuery.set({ image_name: newsData.image_name });
//       }
      
//       if (newsData.image_mime !== undefined) {
//         updateQuery = updateQuery.set({ image_mime: newsData.image_mime });
//       }
      
//       // If there's nothing to update, just return the existing record
//       if (Object.keys(newsData).length === 0) {
//         return this.findById(id);
//       }
      
//       // Complete the query with WHERE clause and RETURNING
//       const result = await updateQuery
//         .where('id', '=', id)
//         .returning(['id', 'title', 'description', 'image_name', 'image_mime', 'created_at'])
//         .executeTakeFirst();
      
//       return result as NewsOutput || null;
//     } catch (error) {
//       console.error('Error updating news:', error);
//       throw error;
//     }
//   }

//   // Delete a news item
//   static async delete(id: number): Promise<boolean> {
//     try {
//       const result = await db
//         .deleteFrom('news')
//         .where('id', '=', id)
//         .execute();
      
//       return result[0]?.numDeletedRows > 0;
//     } catch (error) {
//       console.error('Error deleting news:', error);
//       throw error;
//     }
//   }
// }


// src/models/News.ts
import { db } from '../config/db';
import { NewsInput, NewsOutput, NewsInsert } from '../types';

const find = async (): Promise<NewsOutput[]> => {
  try {
    const result = await db
      .selectFrom('news')
      .select(['id', 'title', 'description', 'image_name', 'image_mime', 'created_at'])
      .orderBy('created_at', 'desc')
      .execute();
    
    return result.filter(item => item.created_at !== null) as NewsOutput[];
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

const findById = async (id: number): Promise<NewsOutput | null> => {
  try {
    const result = await db
      .selectFrom('news')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    
    if (result && result.created_at === null) {
      throw new Error('Invalid data: created_at cannot be null');
    }
    return result as NewsOutput || null;
  } catch (error) {
    console.error('Error finding news by ID:', error);
    throw error;
  }
};

const getImageData = async (id: number): Promise<{ data: Buffer; mime: string } | null> => {
  try {
    const result = await db
      .selectFrom('news')
      .select(['image_data', 'image_mime'])
      .where('id', '=', id)
      .executeTakeFirst();
    
    if (!result) return null;
    return { data: result.image_data, mime: result.image_mime };
  } catch (error) {
    console.error('Error fetching image data:', error);
    throw error;
  }
};

const create = async (newsData: NewsInput): Promise<NewsOutput> => {
  try {
    const insertData: NewsInsert = {
      title: newsData.title,
      description: newsData.description,
      image_data: newsData.image_data,
      image_name: newsData.image_name,
      image_mime: newsData.image_mime,
      created_at: new Date()
    };

    const result = await db
      .insertInto('news')
      .values(insertData)
      .returning(['id', 'title', 'description', 'image_name', 'image_mime', 'created_at'])
      .executeTakeFirstOrThrow();
    
    return result as NewsOutput;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

const update = async (id: number, newsData: Partial<NewsInput>): Promise<NewsOutput | null> => {
  try {
    // Start building the update query
    let updateQuery = db.updateTable('news');
    
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
      return findById(id);
    }
    
    // Complete the query with WHERE clause and RETURNING
    const result = await updateQuery
      .where('id', '=', id)
      .returning(['id', 'title', 'description', 'image_name', 'image_mime', 'created_at'])
      .executeTakeFirst();
    
    return result as NewsOutput || null;
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

const deleteNews = async (id: number): Promise<boolean> => {
  try {
    const result = await db
      .deleteFrom('news')
      .where('id', '=', id)
      .execute();
    
    return result[0]?.numDeletedRows > 0;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

export const News = {
  find,
  findById,
  getImageData,
  create,
  update,
  delete: deleteNews
};