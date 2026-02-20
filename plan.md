# Pace - Money & Expense Tracking App

## Project Overview
A React Native Expo app for comprehensive money and expense tracking with a focus on user customization and detailed financial analysis.

### Default Currency
On first launch, users will select their default currency. This becomes:
- The default currency for all new accounts
- The default currency for all transactions
- Can be changed per account/transaction if needed
- Stored in app settings for easy access

---

## Core Entities

### 1. Accounts
An account represents any place where money is stored or managed.

**Properties:**
- Name (e.g., "Chase Checking", "Wallet", "Visa Credit Card")
- Balance (current amount)
- Initial Balance (starting amount when account was created)
- Account Type/Category (for grouping in reports)
  - Bank Account
  - Credit Card
  - Cash
  - Savings
  - Investment
  - Other
- Currency (for international support)
- Include in Total Balance (boolean - useful for loans, debts)
- Color/Icon (for visual identification)

**Features:**
- Create, edit, delete accounts
- View account transaction history
- Track balance changes over time

---

### 2. Categories
Categories help classify transactions for better organization and analysis.

**Properties:**
- Name (e.g., "Groceries", "Salary", "Rent")
- Icon (visual representation)
- Color (for quick identification)
- Type (Income or Expense)
- Parent Category (optional - for subcategories)

**Category Structure:**
- **Income Categories**: Salary, Freelance, Gifts, Refunds, etc.
- **Expense Categories**: Food, Transport, Entertainment, Bills, etc.
- **Subcategories Support**: 
  - Food → Groceries, Dining Out, Coffee
  - Transport → Gas, Public Transit, Parking

**Features:**
- Customizable categories (add, edit, delete)
- Default starter categories for new users
- Category grouping/hierarchy
- Icon library for selection

---

### 3. Transactions
The core of the app - recording money movements.

**Three Main Transaction Types:**

#### A. Income
Money coming into an account.
- **Properties**: Amount, Date, Category, Account (destination), Note, Attachments (photos, PDFs)

#### B. Expense
Money going out of an account.
- **Properties**: Amount, Date, Category, Account (source), Note, Attachments (photos, PDFs)

#### C. Transfer
Money moving between accounts (doesn't affect total balance).
- **Properties**: Amount, Date, From Account, To Account, Note, Transfer Fee (optional)

**Attachments & AI Features:**
- Camera integration for receipt photos
- Document attachment support (PDF, images)
- AI-powered OCR and receipt analysis
- Auto-populate transaction details from receipts (amount, date, category, type)
- Smart extraction reduces manual data entry

**Common Properties:**
- Timestamp
- Recurring (boolean - for subscriptions/regular transactions)
- Tags (optional - for additional filtering)
- Location (optional - GPS data)
- Payee/Payer (optional)

---

## Ergonomic Design Principles

**Priority: Optimize for one-handed use for common actions**

The most frequent operation (adding transactions) must be fully accessible with one hand, particularly for right-handed users holding their phone naturally.

### Add Transaction Flow - Ergonomic Layout:

**Floating Action Button (FAB)**
- Position: Bottom right corner of home screen
- Easily tappable with thumb while holding phone

**Transaction Entry Screen Layout (Bottom-Up Approach):**

1. **Bottom Section** (Most accessible - thumb-friendly zone):
   - **Number Pad**: Custom numeric keyboard for amount entry
   - **Amount Display**: Large, highlighted/focused by default
   - **Quick Actions**: Enter/Save button (integrated with number pad)
   - **Date & Time Selector**: Bottom-accessible date picker
   - **Category Selector**: bottom sheet
   - **Account Selector**: Quick account switcher

2. **Middle Section** (Moderate reach):
   - **Transaction Type Toggle**: Income / Expense / Transfer
   - **Quick Category Chips**: Recently used categories

3. **Top Section** (Less frequent actions):
   - **Note Field**: Large text area (~30% screen height)
     - Auto-focuses when tapped
     - Camera button (bottom-right of note field)
     - Attachment button (bottom-right of note field)
     - AI Analysis button (appears when attachment added)
   - **Additional Options**: Tags, location, etc.

### Smart Navigation:
- **Tab-like behavior**: Equal/Enter key on number pad moves to next field
- **Auto-focus chain**: Amount → Category → Account → Save
- **Quick save shortcuts**: Double-tap FAB to repeat last transaction
- **Gesture support**: Swipe patterns for transaction type selection

**Note**: Advanced features (analytics, filtering, search, reports) do NOT need to follow these ergonomic constraints. One-handed optimization is specifically for the add transaction workflow.

---

## App Structure & Pages

### 1. Records Page (Home) 🏠
The main landing page showing current transactions.

**Features:**
- List of transactions for current period (default: current month)
- Quick filters:
  - Today
  - This Week
  - This Month
  - Custom Date Range
- Group by:
  - Date (chronological)
  - Category
  - Account
- Search functionality
- Summary cards:
  - Total Income
  - Total Expenses
  - Net Balance
- Floating Action Button (+) for quick transaction entry
- Pull to refresh
- Swipe actions (edit, delete)

---

### 2. Analysis Page 📊
Comprehensive financial insights and visualizations.

**Features:**
- **Charts & Graphs:**
  - Spending by category (Pie Chart)
  - Income vs. Expenses over time (Line/Bar Chart)
  - Account balances over time (Line Chart)
  - Top spending categories (Horizontal Bar Chart)
  
- **Insights:**
  - Period comparison (This Month vs. Last Month)
  - Average daily/weekly/monthly spending
  - Spending trends (increasing/decreasing)
  - Unusual spending alerts
  
- **Filters:**
  - Date range selector
  - Account filter
  - Category filter
  - Transaction type filter

---

### 3. Budgets Page 💰
Set and track spending limits.

**Features:**
- Create budgets:
  - Per category (e.g., $500/month for Food)
  - Overall monthly budget
  - Custom period budgets (weekly, yearly)
- Progress bars showing budget usage
- Notifications when approaching/exceeding budget
- Budget vs. Actual comparison charts
- Budget rollover options

---

### 4. Subscriptions/Recurring Transactions 🔄
Manage regular payments and income.

**Features:**
- List of all recurring transactions
- Properties:
  - Frequency (daily, weekly, monthly, yearly, custom)
  - Next due date
  - Auto-record option
  - Reminder notifications
- Categories:
  - Subscriptions (Netflix, Spotify, etc.)
  - Bills (Rent, Utilities, Insurance)
  - Regular Income (Salary, Pension)
- Calendar view of upcoming recurring transactions
- Cost analysis (monthly/yearly totals)

---

### 5. Accounts Overview Page 💳
Manage all financial accounts.

**Features:**
- List of all accounts with current balances
- Total net worth calculation
- Add/Edit/Archive accounts
- Account transaction history
- Account balance trends

---

### 6. Settings & More ⚙️
Configuration and additional features.

**Features:**
- Profile settings
- Currency settings
- Default account selection
- Theme (Light/Dark mode)
- Notification preferences
- Backup & Restore
- Export data (CSV, PDF)
- Privacy & Security (PIN, Biometric)
- About & Help

---

## Technical Architecture

### Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Database**: SQLite (expo-sqlite) - offline-first
- **State Management**: Zustand / Redux Toolkit
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **UI Library**: Custom components (Vercel/Next.js inspired) or NativeWind (Tailwind for RN)
- **Charts**: react-native-chart-kit / Victory Native
- **Date Handling**: date-fns / Day.js
- **Storage**: AsyncStorage (for preferences), SQLite (for data)
- **AI/ML**: 
  - expo-camera (for receipt capture)
  - expo-document-picker (for file attachments)
  - Google Vision API (for OCR and receipt analysis)
- **Notifications**: expo-notifications (for SMS parsing - if available)

### Database Schema (Preliminary)

```sql
-- Accounts
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  initial_balance REAL NOT NULL,
  current_balance REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  include_in_total BOOLEAN DEFAULT 1,
  color TEXT,
  icon TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'income' or 'expense'
  icon TEXT,
  color TEXT,
  parent_id INTEGER,
  is_default BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Transactions
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL, -- 'income', 'expense', 'transfer'
  amount REAL NOT NULL,
  date DATETIME NOT NULL,
  account_id INTEGER NOT NULL,
  category_id INTEGER,
  to_account_id INTEGER, -- for transfers
  note TEXT,
  is_recurring BOOLEAN DEFAULT 0,
  recurring_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (to_account_id) REFERENCES accounts(id),
  FOREIGN KEY (recurring_id) REFERENCES recurring_transactions(id)
);

-- Recurring Transactions
CREATE TABLE recurring_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
  account_id INTEGER NOT NULL,
  category_id INTEGER,
  to_account_id INTEGER,
  note TEXT,
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  next_due_date DATETIME NOT NULL,
  auto_record BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Budgets
CREATE TABLE budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  period TEXT NOT NULL, -- 'weekly', 'monthly', 'yearly'
  category_id INTEGER,
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Attachments
CREATE TABLE attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'pdf', 'other'
  file_name TEXT,
  ai_processed BOOLEAN DEFAULT 0,
  ai_extracted_data TEXT, -- JSON string of extracted data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);

-- App Settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Store: default_currency, theme, onboarding_completed, etc.
```

---

## Key Features to Implement

### Phase 1: Core Functionality (MVP)
- [ ] Account management (CRUD)
- [ ] Category management (CRUD)
- [ ] Transaction recording (Income, Expense, Transfer)
- [ ] Records page with filtering
- [ ] Basic statistics/summary
- [ ] SQLite database setup
- [ ] Navigation structure

### Phase 2: Enhanced Features
- [ ] Ergonomic add transaction screen (one-handed optimized)
- [ ] Attachments (camera, PDF support)
- [ ] Large notes field with inline action buttons
- [ ] Analysis page with charts
- [ ] Budget tracking
- [ ] Search functionality
- [ ] Date range filtering
- [ ] Export data (CSV)
- [ ] Modern minimal UI theme (dark & light modes)

### Phase 3: Advanced Features
- [ ] AI-powered receipt analysis (OCR, auto-populate)
- [ ] Recurring transactions
- [ ] Notifications & reminders
- [ ] Multiple currencies with exchange rates
- [ ] Cloud backup & sync
- [ ] Biometric authentication

### Phase 4: Optional/Future Features
- [ ] SMS/Notification parsing with review queue
- [ ] Investment & portfolio tracking
- [ ] Bank account integration
- [ ] Advanced AI categorization
- [ ] Predictive insights

---

## Design Considerations

### UI/UX Principles
- **Modern & Minimal**: Clean design inspired by Next.js/Vercel aesthetics
- **Intuitive**: Quick transaction entry (≤3 taps for common actions)
- **Visual**: Color-coded categories and accounts
- **Informative**: Clear summaries and insights
- **Customizable**: User-defined categories, colors, icons
- **Fast**: Offline-first, instant feedback
- **Accessible**: Support for screen readers, proper contrast
- **Ergonomic**: One-handed optimization for frequent tasks

### Design Theme
**Modern Minimal Aesthetic** (Vercel/Next.js inspired)

**Dark Mode** (Primary focus):
- Background: Off-white gray (#FAFAFA, #F5F5F5)
- Surface: Slightly lighter shade
- Text: High contrast dark gray/black
- Accent: Subtle colors for actions
- Cards: Soft shadows, rounded corners

**Light Mode**:
- Background: Soft gray shades (#F8F8F8, #EEEEEE)
- Surface: White with subtle borders
- Text: Dark gray for readability
- Accent: Same as dark mode for consistency

**Color Semantics**:
- Income: Green tones (#10B981, #059669)
- Expense: Red tones (#EF4444, #DC2626)
- Transfer: Blue/Gray tones (#6366F1, #4F46E5)
- Primary Actions: Accent color (blue/purple)
- Borders: Very subtle, low contrast

---

## Additional Features for Future Consideration

1. **Multi-currency Support**
   - Exchange rate handling
   - Currency conversion for transfers
   - Display in preferred currency

2. **Shared Accounts/Family Mode**
   - Multiple users per account
   - Split expenses
   - Permission levels

3. **Smart Categorization**
   - AI-powered category suggestions based on note/payee
   - Learn from user's past categorizations

4. **Goal Tracking**
   - Savings goals
   - Debt payoff tracking
   - Progress visualization

5. **Financial Insights**
   - Spending patterns
   - Predictions for upcoming months
   - Money-saving suggestions

6. **Bill Reminders**
   - Notifications for upcoming bills
   - Payment tracking (paid/unpaid)

7. **AI-Powered Receipt Analysis** ⭐ PRIORITY
   - Camera integration for receipt photos
   - Attach PDF receipts/documents
   - AI button appears when attachment added
   - OCR and intelligent receipt parsing
   - Auto-extract and populate:
     - Transaction type (income/expense)
     - Amount
     - Date and time
     - Merchant/payee name
     - Suggested category
   - User reviews AI-extracted data before saving
   - Image captioning and summarization
   - Cloud storage integration

8. **Widgets**
   - Home screen widget showing balance/recent transactions
   - Quick add transaction widget

9. **Reports**
   - Monthly/yearly reports
   - Tax-ready exports
   - Custom report builder

10. **SMS/Notification Parsing** (Optional - Future)
    - Parse bank SMS notifications for transactions
    - Alternative: Parse push notifications
    - AI model extracts transaction details
    - Add to review queue (not auto-saved)
    - User reviews queue on app open
    - Review modal shows parsed transactions
    - User can adjust, modify, set categories
    - Approve and save to records

11. **Bank Integration**
    - Bank account sync (via Plaid or similar)
    - Calendar integration for recurring expenses
    - Export to accounting software

12. **Investment & Portfolio Tracking** 📊 (Future Discussion)
    - *To be designed later*
    - Portfolio management
    - Investment tracking
    - Returns calculation
    - *Details to be discussed in future planning sessions*

---

## Next Steps

1. ✅ Create initial project plan
2. ⏳ Finalize data model and relationships
3. ⏳ Design wireframes/mockups
4. ⏳ Set up Expo project with TypeScript
5. ⏳ Implement database layer
6. ⏳ Build navigation structure
7. ⏳ Develop core features (Phase 1)

---

## Questions to Discuss

1. ✅ **Default Currency**: User selects on first launch, used as default everywhere
2. ✅ **Category Type**: Separate lists for Income and Expense (no "shared" type)
3. Do we want subcategories for both income and expenses, or just expenses?
4. Should transfers have their own categories or remain category-free?
5. What should be the default time period on the home page? Current month or last 30 days?
6. Should we have a separate page for accounts or incorporate it into settings?
7. Do we want to support tags in addition to categories?
8. Should recurring transactions be auto-recorded or require user confirmation?
9. What level of customization should we allow for the home page layout?
10. **AI Features**: Which AI service for OCR? (OpenAI GPT-4 Vision, Google Cloud Vision, AWS Textract, or local ML models?)
11. **Notes Field**: Should AI button be always visible or only appear with attachments?
12. **Number Pad**: Custom component or system keyboard with toolbar?
13. **Investments Feature**: When to discuss detailed requirements for portfolio tracking?

---

*Last Updated: February 19, 2026*
