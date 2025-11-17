# 📚 Documentation Index

Welcome to Nodebase! This is your complete guide to understanding and working with this codebase.

---

## 🗺️ Documentation Map

```
📚 Documentation
├── 🏠 README.md ........................... Start here! Project overview
├── 🏛️ ARCHITECTURE.md ..................... System architecture & diagrams
├── 👨‍💻 DEVELOPER_GUIDE.md .................. Complete developer onboarding
├── 🧰 SCRIPTS_AND_UTILS.md ................ All scripts & utilities reference
└── 📂 FOLDER_STRUCTURE.md ................. Complete folder structure guide
```

---

## 🎯 Choose Your Path

### 🆕 **I'm New Here** (Start Here!)

**Day 1: Get Set Up**

1. Read [README.md](./README.md) for project overview
2. Follow the **Quick Start** guide to set up your environment
3. Run the project successfully

**Day 2: Understand the Architecture** 4. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand Clean Architecture 5. Study the **Architecture Diagrams** 6. Explore the **workflows** feature as an example

**Day 3: Learn the Structure** 7. Read [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) 8. Understand where to find things 9. Navigate the codebase confidently

**Day 4: Make Your First Change** 10. Follow [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) 11. Make a small change (add a field) 12. Write tests and submit PR

---

### 🔨 **I'm Ready to Build** (Developer Path)

**Quick References:**

| Task                | Document                                                             | Section                  |
| ------------------- | -------------------------------------------------------------------- | ------------------------ |
| Add a new feature   | [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#making-your-first-change)  | Making Your First Change |
| Add API endpoint    | [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#adding-a-new-api-endpoint) | Common Tasks             |
| Run tests           | [SCRIPTS_AND_UTILS.md](./SCRIPTS_AND_UTILS.md#testing-scripts)       | Testing Scripts          |
| Database migrations | [SCRIPTS_AND_UTILS.md](./SCRIPTS_AND_UTILS.md#database-scripts)      | Database Scripts         |
| Debug issues        | [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#-debugging-tips)           | Debugging Tips           |
| Use utilities       | [SCRIPTS_AND_UTILS.md](./SCRIPTS_AND_UTILS.md#-utility-functions)    | Utility Functions        |

---

### 🏗️ **I Want to Understand the System** (Architecture Path)

**Study These In Order:**

1. **Clean Architecture Basics**
   - Read [ARCHITECTURE.md § Architecture Overview](./ARCHITECTURE.md#architecture-overview)
   - Understand the layer diagram
   - Learn dependency rules

2. **Domain Layer (Business Logic)**
   - Read [ARCHITECTURE.md § Domain Layer](./ARCHITECTURE.md#1-domain-layer-the-heart-️)
   - Study `Workflow.entity.ts` example
   - Understand `Result` pattern

3. **Application Layer (Use Cases)**
   - Read [ARCHITECTURE.md § Application Layer](./ARCHITECTURE.md#application-layer-use-cases)
   - Study `CreateWorkflowUseCase` example
   - Understand orchestration

4. **Infrastructure Layer**
   - Read [ARCHITECTURE.md § Infrastructure Layer](./ARCHITECTURE.md#infrastructure-layer-implementations)
   - Study `PrismaWorkflowRepository` example
   - Understand repository pattern

5. **Complete Data Flow**
   - Read [ARCHITECTURE.md § Data Flow Diagram](./ARCHITECTURE.md#data-flow-diagram)
   - Follow request from UI to database
   - Understand each layer's responsibility

---

### 📖 **I Need a Reference** (Quick Lookup)

**Scripts & Commands:**

- [All Available Scripts](./SCRIPTS_AND_UTILS.md#-package-scripts)
- [Database Commands](./SCRIPTS_AND_UTILS.md#database-scripts)
- [Testing Commands](./SCRIPTS_AND_UTILS.md#testing-scripts)

**File Locations:**

- [Complete Folder Structure](./FOLDER_STRUCTURE.md)
- [Feature Module Structure](./FOLDER_STRUCTURE.md#-srcfeatures---feature-modules)
- [Shared Code Location](./FOLDER_STRUCTURE.md#-srcshared---shared-across-features)

**Utilities:**

- [Result Pattern](./SCRIPTS_AND_UTILS.md#resultt-e-pattern)
- [Logger Usage](./SCRIPTS_AND_UTILS.md#logger-pino)
- [ID Generation](./SCRIPTS_AND_UTILS.md#id-value-object)
- [Class Names (cn)](./SCRIPTS_AND_UTILS.md#cn---class-names)

**Examples:**

- [Add New Entity](./DEVELOPER_GUIDE.md#adding-a-new-entity)
- [Add API Endpoint](./DEVELOPER_GUIDE.md#adding-a-new-api-endpoint)
- [Database Migration](./DEVELOPER_GUIDE.md#running-database-migrations)
- [Write Tests](./DEVELOPER_GUIDE.md#step-7-write-tests)

---

## 📖 Document Summaries

### [README.md](./README.md)

**Purpose:** Project overview and quick start guide

**Contents:**

- ✨ Key features
- 🚀 Quick start (5 steps)
- 📁 Project structure overview
- 🛠️ Development commands
- 🏛️ Architecture summary
- 🧪 Testing guide
- 🛠️ Tech stack
- 🔐 Environment variables
- 🐛 Troubleshooting

**Best For:** Getting started, first-time setup

---

### [ARCHITECTURE.md](./ARCHITECTURE.md)

**Purpose:** Deep dive into system architecture

**Contents:**

- 🏛️ Clean Architecture overview
- 📊 Architecture diagrams
- 🔄 Data flow visualization
- 💎 Domain layer explained
- 🎯 Application layer explained
- 🔧 Infrastructure layer explained
- 📝 Key concepts (Result, Value Objects, Entities)
- 🧪 Testing strategy

**Best For:** Understanding design patterns, architecture decisions

---

### [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

**Purpose:** Complete developer onboarding and workflow

**Contents:**

- 🚀 First day setup (detailed)
- 🧭 Understanding the codebase
- 🔨 Making your first change (step-by-step)
- 🛠️ Common tasks with examples
- 🧰 Useful scripts & utils
- 🐛 Debugging tips
- ✅ Best practices
- 🎓 Learning resources
- 📅 4-week learning path

**Best For:** New developers, learning workflow, task references

---

### [SCRIPTS_AND_UTILS.md](./SCRIPTS_AND_UTILS.md)

**Purpose:** Complete reference for all scripts and utilities

**Contents:**

- 📜 All npm scripts explained
- 🗃️ Database commands
- 🧪 Testing commands
- 🧰 Utility functions
- 📝 Code examples
- ⚙️ Configuration files
- 💡 Tips & tricks

**Best For:** Quick reference, command lookup, utility usage

---

### [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)

**Purpose:** Visual guide to the entire codebase structure

**Contents:**

- 🌳 Complete directory tree
- 📂 Every folder explained
- 🔑 Important files listed
- 🎯 Key directories deep-dive
- 📚 Reading order for new devs
- 🚀 Quick navigation guide

**Best For:** Finding files, understanding organization, navigating codebase

---

## 🎓 Learning Paths

### Path 1: Quick Start (30 minutes)

For developers who need to get running ASAP.

```
1. README.md (Quick Start section)
2. Set up environment
3. Run pnpm dev:all
4. Explore http://localhost:3000
```

---

### Path 2: Beginner Developer (1 week)

For developers new to the codebase or Clean Architecture.

**Day 1-2: Setup & Overview**

```
1. README.md (complete)
2. Set up development environment
3. Run all tests successfully
4. FOLDER_STRUCTURE.md (skim)
```

**Day 3-4: Architecture**

```
5. ARCHITECTURE.md (complete)
6. Study workflows feature code
7. Understand data flow
8. Read existing tests
```

**Day 5-7: First Contribution**

```
9. DEVELOPER_GUIDE.md (Making Your First Change)
10. Add a simple field to an entity
11. Write tests
12. Create PR
```

---

### Path 3: Experienced Developer (2 days)

For experienced developers familiar with Clean Architecture.

**Day 1: Architecture & Patterns**

```
1. README.md (Architecture section)
2. ARCHITECTURE.md (focus on diagrams)
3. Review workflows feature implementation
4. FOLDER_STRUCTURE.md (quick scan)
```

**Day 2: Hands-On**

```
5. DEVELOPER_GUIDE.md (Common Tasks)
6. SCRIPTS_AND_UTILS.md (skim for reference)
7. Create a simple feature end-to-end
8. Write tests and submit PR
```

---

### Path 4: Reference User (Ongoing)

For developers who need quick lookups.

**Bookmark These:**

- [All Commands](./SCRIPTS_AND_UTILS.md#-package-scripts)
- [Folder Locations](./FOLDER_STRUCTURE.md)
- [Common Tasks](./DEVELOPER_GUIDE.md#-common-tasks)
- [Debugging](./DEVELOPER_GUIDE.md#-debugging-tips)
- [Best Practices](./DEVELOPER_GUIDE.md#-best-practices)

---

## 🔍 Find What You Need

### By Task

| I want to...            | Go to...                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Set up my environment   | [README.md § Quick Start](./README.md#-quick-start)                                  |
| Understand architecture | [ARCHITECTURE.md](./ARCHITECTURE.md)                                                 |
| Add a new feature       | [DEVELOPER_GUIDE.md § Adding New Feature](./DEVELOPER_GUIDE.md#adding-a-new-feature) |
| Find a file             | [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)                                         |
| Run tests               | [SCRIPTS_AND_UTILS.md § Testing](./SCRIPTS_AND_UTILS.md#testing-scripts)             |
| Use a utility function  | [SCRIPTS_AND_UTILS.md § Utilities](./SCRIPTS_AND_UTILS.md#-utility-functions)        |
| Debug an issue          | [DEVELOPER_GUIDE.md § Debugging](./DEVELOPER_GUIDE.md#-debugging-tips)               |
| Learn best practices    | [DEVELOPER_GUIDE.md § Best Practices](./DEVELOPER_GUIDE.md#-best-practices)          |

---

### By Role

**New Developer:**

1. [README.md](./README.md) - Overview
2. [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Complete guide
3. [ARCHITECTURE.md](./ARCHITECTURE.md) - Understanding system

**Experienced Developer:**

1. [ARCHITECTURE.md](./ARCHITECTURE.md) - Design patterns
2. [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Code organization
3. [SCRIPTS_AND_UTILS.md](./SCRIPTS_AND_UTILS.md) - Quick reference

**Team Lead / Architect:**

1. [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
2. [README.md § Tech Stack](./README.md#-tech-stack) - Technologies
3. [DEVELOPER_GUIDE.md § Best Practices](./DEVELOPER_GUIDE.md#-best-practices) - Standards

---

## 🆘 Common Questions

### Where do I start?

→ [README.md](./README.md) for overview, then [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for step-by-step

### How does the architecture work?

→ [ARCHITECTURE.md](./ARCHITECTURE.md) has complete diagrams and explanations

### Where is X file located?

→ [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) has the complete directory tree

### How do I run X command?

→ [SCRIPTS_AND_UTILS.md](./SCRIPTS_AND_UTILS.md) has all commands explained

### How do I add a new feature?

→ [DEVELOPER_GUIDE.md § Making Your First Change](./DEVELOPER_GUIDE.md#making-your-first-change)

### What are the best practices?

→ [DEVELOPER_GUIDE.md § Best Practices](./DEVELOPER_GUIDE.md#-best-practices)

### How do I debug?

→ [DEVELOPER_GUIDE.md § Debugging Tips](./DEVELOPER_GUIDE.md#-debugging-tips)

---

## 📊 Documentation Stats

- **Total Documents:** 5
- **Total Pages:** ~100 pages (if printed)
- **Code Examples:** 50+
- **Diagrams:** 10+
- **Commands Documented:** 30+
- **Utilities Documented:** 20+
- **Learning Paths:** 4

---

## 🎯 Quick Actions

```bash
# Set up project
git clone <repo> && cd n8n && pnpm install && pnpm dev:all

# Run tests
pnpm test

# View database
pnpm db:studio

# Read architecture
cat ARCHITECTURE.md | less

# Search docs
grep -r "keyword" *.md
```

---

## 🙏 Feedback

Found something unclear? Have suggestions?

- Open an issue
- Submit a PR to improve docs
- Ask in #nodebase-dev Slack

---

**Happy Coding! 🚀**

_Last updated: November 17, 2025_
