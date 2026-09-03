import {
  INITIAL_STORE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_CONTACT_INQUIRIES,
  INITIAL_SERVICE_INQUIRIES
} from './mockData';

// In-memory data store with optional client-side local persistence
class MockDatabase {
  tables: Record<string, any[]>;
  currentUser: any = null;
  currentSession: any = null;
  authListeners: Array<(event: string, session: any) => void> = [];

  constructor() {
    this.tables = {
      store_settings: [{ ...INITIAL_STORE_SETTINGS }],
      categories: [...INITIAL_CATEGORIES],
      brands: [...INITIAL_BRANDS],
      products: [...INITIAL_PRODUCTS],
      users: [...INITIAL_USERS],
      orders: [...INITIAL_ORDERS],
      order_items: INITIAL_ORDERS.flatMap(o => o.order_items || []),
      stock_movements: [...INITIAL_STOCK_MOVEMENTS],
      contact_inquiries: [...INITIAL_CONTACT_INQUIRIES],
      service_inquiries: [...INITIAL_SERVICE_INQUIRIES]
    };

    // Hydrate from localStorage if in browser
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem('able_mock_db');
        if (saved) {
          const parsed = JSON.parse(saved);
          Object.keys(parsed).forEach(k => {
            if (Array.isArray(parsed[k]) && parsed[k].length > 0) {
              this.tables[k] = parsed[k];
            }
          });
        }
        const savedUser = window.localStorage.getItem('able_mock_user');
        if (savedUser) {
          this.currentUser = JSON.parse(savedUser);
          this.currentSession = {
            access_token: 'mock-jwt-token-' + this.currentUser.id,
            user: this.currentUser
          };
        }
      } catch (e) {
        console.warn('Could not restore mock database from localStorage:', e);
      }
    }
  }

  save() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('able_mock_db', JSON.stringify(this.tables));
      } catch (e) {
        // storage quota or disabled
      }
    }
  }

  getTable(name: string): any[] {
    if (!this.tables[name]) {
      this.tables[name] = [];
    }
    return this.tables[name];
  }
}

export const mockDb = new MockDatabase();

class MockQueryBuilder implements PromiseLike<any> {
  private db: MockDatabase;
  private tableName: string;
  private filters: Array<(row: any) => boolean> = [];
  private orderConfig: { column: string; ascending: boolean } | null = null;
  private limitCount: number | null = null;
  private isSingle = false;
  private isCount = false;
  private isHead = false;
  private operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private mutateData: any = null;

  constructor(db: MockDatabase, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  select(columns = '*', options?: { count?: string; head?: boolean }) {
    if (options?.count) {
      this.isCount = true;
    }
    if (options?.head) {
      this.isHead = true;
    }
    return this;
  }

  insert(values: any | any[]) {
    this.operation = 'insert';
    this.mutateData = values;
    return this;
  }

  update(values: any) {
    this.operation = 'update';
    this.mutateData = values;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push(row => {
      if (row[column] === undefined && column === 'id' && row._id) return row._id === value;
      return String(row[column]) === String(value);
    });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push(row => String(row[column]) !== String(value));
    return this;
  }

  ilike(column: string, pattern: string) {
    const cleanPattern = pattern.replace(/%/g, '').toLowerCase();
    this.filters.push(row => {
      const val = row[column];
      return typeof val === 'string' && val.toLowerCase().includes(cleanPattern);
    });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderConfig = {
      column,
      ascending: options?.ascending !== false
    };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  private execute() {
    const table = this.db.getTable(this.tableName);

    // INSERT
    if (this.operation === 'insert') {
      const rowsToInsert = Array.isArray(this.mutateData) ? this.mutateData : [this.mutateData];
      const inserted = rowsToInsert.map(item => {
        const row = {
          id: item.id || `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          created_at: item.created_at || new Date().toISOString(),
          ...item
        };
        // Normalize product schema
        if (this.tableName === 'products') {
          if (row.price !== undefined && row.base_price === undefined) row.base_price = row.price;
          if (row.base_price !== undefined && row.price === undefined) row.price = row.base_price;
          if (row.stock !== undefined && row.stock_quantity === undefined) row.stock_quantity = row.stock;
          if (row.stock_quantity !== undefined && row.stock === undefined) row.stock = row.stock_quantity;
        }
        table.unshift(row);
        return row;
      });
      this.db.save();

      if (this.isSingle) {
        return { data: inserted[0] || null, error: null };
      }
      return { data: inserted, error: null };
    }

    // Filter rows
    let matchingRows = table.filter(row => {
      for (const filter of this.filters) {
        if (!filter(row)) return false;
      }
      return true;
    });

    // UPDATE
    if (this.operation === 'update') {
      const updated: any[] = [];
      matchingRows.forEach(row => {
        Object.assign(row, this.mutateData);
        // Normalize product
        if (this.tableName === 'products') {
          if (row.price !== undefined && row.base_price === undefined) row.base_price = row.price;
          if (row.base_price !== undefined && row.price === undefined) row.price = row.base_price;
          if (row.stock !== undefined && row.stock_quantity === undefined) row.stock_quantity = row.stock;
          if (row.stock_quantity !== undefined && row.stock === undefined) row.stock = row.stock_quantity;
        }
        updated.push(row);
      });
      this.db.save();
      if (this.isSingle) {
        return { data: updated[0] || null, error: null };
      }
      return { data: updated, error: null };
    }

    // DELETE
    if (this.operation === 'delete') {
      const idsToDelete = new Set(matchingRows.map(r => r.id));
      this.db.tables[this.tableName] = table.filter(r => !idsToDelete.has(r.id));
      this.db.save();
      return { data: null, error: null };
    }

    // SELECT
    let result = [...matchingRows];

    // Sorting
    if (this.orderConfig) {
      const { column, ascending } = this.orderConfig;
      result.sort((a, b) => {
        const valA = a[column];
        const valB = b[column];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return ascending ? valA - valB : valB - valA;
        }
        const strA = String(valA);
        const strB = String(valB);
        return ascending ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }

    const totalCount = result.length;

    // Limit
    if (this.limitCount !== null && this.limitCount >= 0) {
      result = result.slice(0, this.limitCount);
    }

    // Head only for count queries
    if (this.isHead) {
      return {
        data: null,
        count: totalCount,
        error: null
      };
    }

    if (this.isSingle) {
      const item = result[0] || null;
      return {
        data: item,
        error: item ? null : { message: 'Row not found', code: 'PGRST116' },
        count: totalCount
      };
    }

    return {
      data: result,
      error: null,
      count: totalCount
    };
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    try {
      const result = this.execute();
      return Promise.resolve(result).then(onfulfilled, onrejected);
    } catch (err) {
      return Promise.reject(err).then(onfulfilled, onrejected);
    }
  }
}

export function createMockSupabaseClient() {
  return {
    from(tableName: string) {
      return new MockQueryBuilder(mockDb, tableName);
    },

    auth: {
      async getSession() {
        return {
          data: {
            session: mockDb.currentSession
          },
          error: null
        };
      },

      async getUser(token?: string) {
        if (mockDb.currentUser) {
          return { data: { user: mockDb.currentUser }, error: null };
        }
        // Default admin user fallback if token provided
        if (token) {
          const defaultAdmin = mockDb.getTable('users').find(u => u.role === 'ADMIN') || mockDb.getTable('users')[0];
          return { data: { user: defaultAdmin }, error: null };
        }
        return { data: { user: null }, error: null };
      },

      async signInWithPassword({ email, password }: { email?: string; password?: string }) {
        const users = mockDb.getTable('users');
        const cleanEmail = (email || '').trim().toLowerCase();

        // Check if user exists
        let user = users.find(u => u.email.toLowerCase() === cleanEmail);

        // Auto-provision admin if signing in with admin email
        if (!user && (cleanEmail.includes('admin') || cleanEmail === 'admin@abletechnologies.lk')) {
          user = {
            id: 'usr-admin-1',
            email: cleanEmail,
            role: 'ADMIN',
            full_name: 'System Administrator',
            phone: '+94 77 123 4567',
            created_at: new Date().toISOString()
          };
          users.push(user);
          mockDb.save();
        } else if (!user) {
          // Allow customer sign-in or auto-create demo user
          user = {
            id: `usr-cust-${Date.now()}`,
            email: cleanEmail,
            role: 'CUSTOMER',
            full_name: cleanEmail.split('@')[0],
            phone: '+94 71 000 0000',
            created_at: new Date().toISOString()
          };
          users.push(user);
          mockDb.save();
        }

        const session = {
          access_token: `mock-jwt-token-${user.id}`,
          token_type: 'bearer',
          expires_in: 3600,
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              full_name: user.full_name,
              phone: user.phone
            }
          }
        };

        mockDb.currentUser = session.user;
        mockDb.currentSession = session;

        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('able_mock_user', JSON.stringify(session.user));
          window.localStorage.setItem('auth_token', session.access_token);
        }

        mockDb.authListeners.forEach(listener => listener('SIGNED_IN', session));

        return {
          data: {
            user: session.user,
            session
          },
          error: null
        };
      },

      async signUp({ email, password, options }: any) {
        const cleanEmail = (email || '').trim().toLowerCase();
        const users = mockDb.getTable('users');

        let user = users.find(u => u.email.toLowerCase() === cleanEmail);
        if (!user) {
          user = {
            id: `usr-${Date.now()}`,
            email: cleanEmail,
            role: options?.data?.role || 'CUSTOMER',
            full_name: options?.data?.full_name || cleanEmail.split('@')[0],
            phone: options?.data?.phone || '',
            created_at: new Date().toISOString()
          };
          users.push(user);
          mockDb.save();
        }

        const session = {
          access_token: `mock-jwt-token-${user.id}`,
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              full_name: user.full_name,
              phone: user.phone
            }
          }
        };

        mockDb.currentUser = session.user;
        mockDb.currentSession = session;

        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('able_mock_user', JSON.stringify(session.user));
          window.localStorage.setItem('auth_token', session.access_token);
        }

        mockDb.authListeners.forEach(listener => listener('SIGNED_IN', session));

        return {
          data: {
            user: session.user,
            session
          },
          error: null
        };
      },

      async signOut() {
        mockDb.currentUser = null;
        mockDb.currentSession = null;

        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('able_mock_user');
          window.localStorage.removeItem('auth_token');
        }

        mockDb.authListeners.forEach(listener => listener('SIGNED_OUT', null));

        return { error: null };
      },

      onAuthStateChange(callback: (event: string, session: any) => void) {
        mockDb.authListeners.push(callback);
        // Fire initial status if already logged in
        if (mockDb.currentSession) {
          setTimeout(() => callback('SIGNED_IN', mockDb.currentSession), 0);
        }
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                mockDb.authListeners = mockDb.authListeners.filter(cb => cb !== callback);
              }
            }
          }
        };
      }
    },

    channel(_name: string) {
      return {
        on(_event: string, _filter: any, _callback: any) {
          return this;
        },
        subscribe() {
          return {
            unsubscribe: () => {}
          };
        }
      };
    },

    removeChannel(_channel: any) {},

    storage: {
      from(_bucket: string) {
        return {
          async upload(path: string, _file: any) {
            return {
              data: { path },
              error: null
            };
          },
          getPublicUrl(path: string) {
            return {
              data: {
                publicUrl: path.startsWith('http') ? path : `/uploads/${path}`
              }
            };
          }
        };
      }
    }
  };
}
