import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';
import { IssuedCredential } from '../types';

export class DatabaseService {
  private db: Database;
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'data', 'credentials.db');
    this.db = new sqlite3.Database(this.dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS credentials (
        id TEXT PRIMARY KEY,
        holderName TEXT NOT NULL,
        credentialType TEXT NOT NULL,
        issueDate TEXT NOT NULL,
        expiryDate TEXT,
        issuerName TEXT NOT NULL,
        data TEXT NOT NULL,
        issuedBy TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating credentials table:', err);
      } else {
        console.log('Credentials table initialized successfully');
      }
    });
  }

  async saveCredential(credential: IssuedCredential): Promise<void> {
    return new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO credentials (
          id, holderName, credentialType, issueDate, expiryDate, 
          issuerName, data, issuedBy, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        credential.id,
        credential.holderName,
        credential.credentialType,
        credential.issueDate,
        credential.expiryDate || null,
        credential.issuerName,
        JSON.stringify(credential.data),
        credential.issuedBy,
        credential.timestamp
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

  async findCredentialById(id: string): Promise<IssuedCredential | null> {
    return new Promise((resolve, reject) => {
      const selectQuery = 'SELECT * FROM credentials WHERE id = ?';
      
      this.db.get(selectQuery, [id], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (row) {
          const credential: IssuedCredential = {
            id: row.id,
            holderName: row.holderName,
            credentialType: row.credentialType,
            issueDate: row.issueDate,
            expiryDate: row.expiryDate,
            issuerName: row.issuerName,
            data: JSON.parse(row.data),
            issuedBy: row.issuedBy,
            timestamp: row.timestamp
          };
          resolve(credential);
        } else {
          resolve(null);
        }
      });
    });
  }

  async getAllCredentials(): Promise<IssuedCredential[]> {
    return new Promise((resolve, reject) => {
      const selectQuery = 'SELECT * FROM credentials ORDER BY created_at DESC';
      
      this.db.all(selectQuery, [], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const credentials: IssuedCredential[] = rows.map(row => ({
            id: row.id,
            holderName: row.holderName,
            credentialType: row.credentialType,
            issueDate: row.issueDate,
            expiryDate: row.expiryDate,
            issuerName: row.issuerName,
            data: JSON.parse(row.data),
            issuedBy: row.issuedBy,
            timestamp: row.timestamp
          }));
          resolve(credentials);
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