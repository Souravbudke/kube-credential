import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { VerificationResult } from '../types';

export class DatabaseService {
  private db: Database;
  private dbPath: string;

  constructor() {
    // Use environment variable if provided, otherwise default to local path
    const dataDir = process.env.DATABASE_PATH 
      ? path.dirname(process.env.DATABASE_PATH)
      : path.join(process.cwd(), 'data');
    
    this.dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'verifications.db');
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    console.log(`Database initialized at: ${this.dbPath}`);
    this.db = new sqlite3.Database(this.dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        credential_id TEXT NOT NULL,
        is_valid BOOLEAN NOT NULL,
        verified_by TEXT NOT NULL,
        verification_timestamp TEXT NOT NULL,
        message TEXT NOT NULL,
        credential_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating verifications table:', err);
      } else {
        console.log('Verifications table initialized successfully');
      }
    });
  }

  async saveVerificationResult(credentialId: string, result: VerificationResult): Promise<void> {
    return new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO verifications (
          credential_id, is_valid, verified_by, verification_timestamp, 
          message, credential_data
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      const values = [
        credentialId,
        result.isValid ? 1 : 0,
        result.verifiedBy,
        result.verificationTimestamp,
        result.message,
        result.credential ? JSON.stringify(result.credential) : null
      ];

      this.db.run(insertQuery, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getVerificationHistory(credentialId?: string): Promise<VerificationResult[]> {
    return new Promise((resolve, reject) => {
      let selectQuery = 'SELECT * FROM verifications';
      let params: any[] = [];

      if (credentialId) {
        selectQuery += ' WHERE credential_id = ?';
        params = [credentialId];
      }

      selectQuery += ' ORDER BY created_at DESC';

      this.db.all(selectQuery, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const results: VerificationResult[] = rows.map(row => ({
            isValid: row.is_valid === 1,
            credential: row.credential_data ? JSON.parse(row.credential_data) : undefined,
            verifiedBy: row.verified_by,
            verificationTimestamp: row.verification_timestamp,
            message: row.message
          }));
          resolve(results);
        }
      });
    });
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}