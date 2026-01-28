<!--
Sync Impact Report:
Version: 1.0.0 → 2.0.0
Rationale: Phase III Amendment - AI-Powered Todo Chatbot with MCP Tools and Stateless Architecture

Modified Principles:
- EXTENDED: User Isolation and Data Integrity (now includes conversations and messages)
- EXTENDED: Technology Stack (added ChatKit, OpenAI Agents SDK, MCP SDK)
- EXTENDED: Database Schema (added conversations and messages tables)

Added Sections:
- Phase III: AI-Powered Todo Chatbot
  - Purpose and Core Architecture Rules
  - Statelessness Requirement
  - Tool-Based Agent Interaction
  - Clear Layer Separation
  - Technology Stack (Phase III Additions)
  - Database Schema (Phase III Extensions)
  - Conversation Handling
  - AI Agent Behavior Requirements
  - API Endpoints (Phase III Additions)
  - MCP Tool Standards
  - Compliance Checklist (Phase III)

Templates Status:
✅ plan-template.md - Constitution Check section covers Phase III requirements
✅ spec-template.md - Supports agent behavior and MCP tool specifications
✅ tasks-template.md - Task structure supports Phase III implementation

Follow-up TODOs:
- Create feature spec for AI chatbot interface (ChatKit integration)
- Define MCP tool schemas and implementations
- Design conversation and message database models
- Plan agent orchestration layer in FastAPI backend

Previous Amendment (v1.0.0):
- Initial constitution creation for Todo Full-Stack Web Application (Spec-Driven Hackathon Phase-2)
- Established 5 core principles
- Defined technology stack and constraints
- Established API and authentication standards
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Security-First Development

Authentication and authorization MUST be enforced at every layer of the application. All
protected API endpoints MUST require valid JWT authentication. User identity MUST be
derived exclusively from verified JWT tokens, never from client-provided data. Security
vulnerabilities (SQL injection, XSS, CSRF, authentication bypass, token leakage) MUST be
actively prevented through proper validation, sanitization, and secure coding practices.

**Rationale**: Multi-user applications require robust security to prevent unauthorized
access and data breaches. Security cannot be retrofitted; it must be designed into every
component from the start.

### II. Spec-Driven Implementation

All API behavior, endpoints, request/response schemas, and feature functionality MUST be
explicitly defined in feature specifications before implementation begins. Implementation
MUST follow approved specs without deviation. Changes to behavior require spec amendments,
not ad-hoc code modifications.

**Rationale**: Spec-driven development ensures all stakeholders agree on requirements
before costly implementation work begins, reduces rework, and creates living documentation
that stays synchronized with the codebase.

### III. User Isolation and Data Integrity

Every todo item MUST be associated with exactly one user. Task ownership MUST be enforced
on every read, write, update, and delete operation at the database and API layer. Users
MUST only access their own data. Cross-user data leakage is a critical defect that
violates user trust and privacy.

**Rationale**: Multi-user applications must guarantee data isolation. A user seeing
another user's todos or being able to modify them is an unacceptable security and privacy
violation.

### IV. Production Realism

All code patterns, architecture decisions, and security implementations MUST be suitable
for real-world production deployment. Avoid shortcuts, mock authentication, hardcoded
secrets, or development-only patterns that would need to be rewritten for production use.
Use environment variables for configuration, proper error handling, logging, and
connection pooling appropriate for serverless environments.

**Rationale**: Hackathon code often becomes production code. Building with production
patterns from the start prevents technical debt and teaches industry-standard practices.

### V. Full-Stack Clarity

Code MUST be clear and understandable to developers working across frontend, backend, and
database layers. Avoid unnecessary abstractions, over-engineering, or framework magic.
Prefer explicit over implicit. Each layer (Next.js frontend, FastAPI backend, PostgreSQL
database) MUST have clear boundaries and responsibilities. API contracts MUST be
documented and predictable.

**Rationale**: Full-stack development requires understanding multiple technologies.
Clear, simple code allows developers to move between layers confidently and reduces
cognitive load.

## Technology Stack and Constraints

**Non-Negotiable Stack**:
- **Frontend**: Next.js 16+ using App Router (Server Components, Client Components, Route
  Handlers)
- **Backend**: Python FastAPI (async endpoints, Pydantic validation, automatic OpenAPI
  docs)
- **ORM**: SQLModel (combines SQLAlchemy and Pydantic for type-safe database models)
- **Database**: Neon Serverless PostgreSQL (requires connection pooling awareness)
- **Authentication**: Better Auth with JWT tokens (shared secret between frontend and
  backend)

**Architectural Constraints**:
- **API Style**: RESTful JSON over HTTPS
- **Authentication Secret**: `BETTER_AUTH_SECRET` environment variable MUST be identical
  in frontend and backend for JWT validation
- **Protected Endpoints**: All API endpoints except `/api/auth/signup` and
  `/api/auth/signin` MUST require valid JWT authentication
- **Frontend-Backend Communication**: Frontend calls backend APIs with JWT token in
  Authorization header (`Bearer <token>`)
- **Database Access**: Backend only - frontend NEVER connects directly to database

## API and Authentication Standards

### JWT Token Flow

1. User signs up or signs in via Better Auth on the frontend
2. Better Auth creates a session and issues a JWT token
3. Frontend stores token securely (httpOnly cookie or secure storage)
4. Frontend includes token in Authorization header for all API requests:
   `Authorization: Bearer <jwt_token>`
5. Backend validates JWT token signature using `BETTER_AUTH_SECRET`
6. Backend extracts user ID from validated token
7. Backend enforces user isolation using extracted user ID

### API Endpoint Requirements

**Authentication Endpoints** (public, no JWT required):
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Authenticate user and return JWT

**Protected Todo Endpoints** (JWT required):
- `GET /api/todos` - List current user's todos (filtered by JWT user ID)
- `POST /api/todos` - Create todo for current user (user ID from JWT)
- `GET /api/todos/{id}` - Get single todo (verify ownership via JWT user ID)
- `PUT /api/todos/{id}` - Update todo (verify ownership via JWT user ID)
- `DELETE /api/todos/{id}` - Delete todo (verify ownership via JWT user ID)

### Error Response Standards

All API errors MUST return appropriate HTTP status codes and consistent JSON error format:

- `400 Bad Request` - Invalid input, validation errors
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Valid token but insufficient permissions (e.g., accessing another
  user's todo)
- `404 Not Found` - Resource does not exist or user does not have access
- `500 Internal Server Error` - Unexpected server errors

Error response format:
```json
{
  "error": "error_code",
  "message": "Human-readable error description",
  "details": {} // Optional additional context
}
```

### Database Schema Standards

Database tables MUST be normalized and use proper foreign key constraints:

**Users Table**:
- Primary key: `id` (UUID or auto-increment integer)
- Required fields: `email` (unique), `password_hash`, `created_at`
- Indexes: Unique index on `email`

**Todos Table**:
- Primary key: `id` (UUID or auto-increment integer)
- Foreign key: `user_id` references `users.id` (ON DELETE CASCADE)
- Required fields: `title`, `user_id`, `created_at`, `updated_at`
- Optional fields: `description`, `status`, `priority`, `due_date`
- Indexes: Index on `user_id` for efficient filtering

## Governance

This constitution supersedes all other development practices. When in doubt, refer to
these principles.

### Amendment Process

1. Proposed changes MUST include rationale and impact assessment
2. Constitution amendments require explicit approval before implementation
3. Version number MUST be incremented following semantic versioning:
   - **MAJOR**: Principle removals or backward-incompatible governance changes
   - **MINOR**: New principles added or existing principles materially expanded
   - **PATCH**: Clarifications, typo fixes, non-semantic wording improvements

### Compliance and Reviews

- All feature specifications MUST be checked against these principles before approval
- Implementation plans MUST document how each principle is satisfied
- Code reviews MUST verify adherence to security-first, user isolation, and production
  realism requirements
- Any complexity not justified by these principles MUST be simplified or removed

### Development Guidance

For runtime development workflow, refer to `Claude.md` for agent-specific guidance on
when to use Auth Agent, Frontend Agent, DB Agent, and Backend Agent for their respective
technology layers.

## Phase III: AI-Powered Todo Chatbot

### Purpose

Enable natural-language todo management using AI agents, MCP tools, and a fully stateless
backend while persisting all state in the database.

### Core Architecture Rules

#### Statelessness Requirement

Backend, AI agents, and MCP tools MUST be completely stateless. All application state MUST
be persisted in the database. No in-memory session state is permitted. Context MUST be
rebuilt from the database on every request.

**Rationale**: Stateless design enables horizontal scaling, simplifies deployment, prevents
state inconsistencies, and aligns with serverless best practices.

#### Tool-Based Agent Interaction

AI agents MUST use MCP (Model Context Protocol) tools for all task operations. Agents MUST
NOT access the database directly. All data operations MUST flow through the MCP tool layer.

**Rationale**: Clear separation of concerns ensures agents remain portable, testable, and
independent of database implementation details. MCP tools provide a standardized interface
for AI interactions.

#### Clear Layer Separation

Application layers MUST maintain strict boundaries:
- **UI Layer**: ChatKit-based chat interface for natural language input
- **Backend Layer**: FastAPI + OpenAI Agents SDK for request handling and agent orchestration
- **MCP Layer**: Official MCP SDK exposing task tools as callable functions
- **Database Layer**: Neon PostgreSQL for persistent storage

Data flow MUST follow: UI → Backend → Agent → MCP → Database

**Rationale**: Layer separation prevents coupling, enables independent testing, and makes
the system easier to understand and maintain.

### Technology Stack (Phase III Additions)

**New Components**:
- **Chat UI**: ChatKit or equivalent chat interface framework
- **Agent Framework**: OpenAI Agents SDK for natural language processing
- **Tool Protocol**: Official MCP SDK for tool definitions and execution
- **Extended Database**: Neon PostgreSQL with additional tables for conversations and messages

**Retained from Phase II**:
- Next.js 16+ frontend (now with chat interface)
- FastAPI backend (now with agent orchestration)
- SQLModel ORM
- Better Auth with JWT authentication

### Database Schema (Phase III Extensions)

In addition to the Phase II `users` and `todos` tables, Phase III adds:

**Conversations Table**:
- Primary key: `id` (UUID or auto-increment integer)
- Foreign key: `user_id` references `users.id` (ON DELETE CASCADE)
- Required fields: `created_at`, `updated_at`
- Optional fields: `title` (auto-generated from first message)
- Indexes: Index on `user_id` for efficient user conversation lookup

**Messages Table**:
- Primary key: `id` (UUID or auto-increment integer)
- Foreign key: `conversation_id` references `conversations.id` (ON DELETE CASCADE)
- Required fields: `role` (enum: 'user' | 'assistant'), `content`, `created_at`
- Optional fields: `tool_calls` (JSON), `tool_results` (JSON)
- Indexes: Index on `conversation_id` for efficient message history retrieval

### Authentication and User Scoping

Better Auth from Phase II MUST continue to enforce authentication. All Phase III features:
- MUST require valid JWT authentication
- MUST scope conversations and messages to authenticated user
- MUST validate `user_id` in all MCP tool operations
- MUST prevent cross-user data access for conversations and messages

### Conversation Handling

**Message Persistence**: User messages and assistant responses MUST be persisted to the
`messages` table immediately upon creation. Each message MUST be linked to a `conversation_id`.

**Context Rebuilding**: On every request, the backend MUST:
1. Retrieve the conversation from the database
2. Load all messages in chronological order
3. Reconstruct the conversation context
4. Pass full context to the AI agent
5. Persist new messages after agent response

**No Session State**: The backend MUST NOT maintain conversation state in memory between
requests. Each API call MUST be handled independently using only database-persisted state.

**Rationale**: Stateless conversation handling enables request routing to any backend
instance, simplifies error recovery, and ensures conversation history is never lost.

### AI Agent Behavior Requirements

**Intent Inference**: The AI agent MUST interpret natural language input to determine user
intent (create todo, list todos, update todo, delete todo, search todos, etc.).

**Tool Selection**: The agent MUST call the appropriate MCP tool based on inferred intent.
Available MCP tools include:
- `create_todo` - Create a new todo item
- `list_todos` - List user's todos with optional filters
- `get_todo` - Retrieve a specific todo by ID
- `update_todo` - Modify an existing todo
- `delete_todo` - Remove a todo
- `search_todos` - Search todos by keywords

**Response Confirmation**: After tool execution, the agent MUST provide a friendly,
conversational response confirming the action taken and presenting any results in a
human-readable format.

**Error Handling**: The agent MUST gracefully handle:
- Ambiguous user requests (ask for clarification)
- Invalid todo IDs (inform user the todo was not found)
- Permission errors (prevent access to other users' todos)
- Tool execution failures (apologize and suggest retry)

**User Context**: All agent operations MUST be scoped to the authenticated user via the
`user_id` extracted from the JWT token.

### API Endpoints (Phase III Additions)

**Conversation Endpoints** (JWT required):
- `POST /api/conversations` - Create a new conversation for current user
- `GET /api/conversations` - List current user's conversations
- `GET /api/conversations/{id}` - Get conversation with full message history
- `DELETE /api/conversations/{id}` - Delete conversation and all messages

**Chat Endpoints** (JWT required):
- `POST /api/chat` - Send a message and receive agent response
  - Request: `{ "conversation_id": "uuid", "message": "user message" }`
  - Response: `{ "message": "assistant response", "tool_calls": [...] }`

### MCP Tool Standards

All MCP tools MUST:
- Accept `user_id` as a required parameter for user isolation
- Validate user ownership before performing operations
- Return structured data (not natural language strings)
- Handle errors gracefully with appropriate error types
- Be independently testable without requiring the AI agent

MCP tools MUST NOT:
- Maintain state between calls
- Access global variables or shared memory
- Perform authentication (receive pre-authenticated `user_id`)
- Generate conversational responses (agent's responsibility)

### Governance (Phase III Amendment)

Phase III extends the Phase II constitution with AI-powered capabilities while maintaining
all Phase II principles:
- **Security-First Development**: Now includes conversation and message isolation
- **Spec-Driven Implementation**: Applies to MCP tool definitions and agent behavior
- **User Isolation and Data Integrity**: Extends to conversations, messages, and tool operations
- **Production Realism**: Stateless design is production-ready and scalable
- **Full-Stack Clarity**: MCP layer adds a new boundary with clear responsibilities

### Compliance Checklist (Phase III)

Implementation plans MUST verify:
- [ ] All backend components are stateless
- [ ] AI agent uses MCP tools exclusively (no direct DB access)
- [ ] Conversations and messages are persisted to database
- [ ] Context is rebuilt from database on every request
- [ ] MCP tools validate `user_id` for all operations
- [ ] Agent provides conversational, user-friendly responses
- [ ] Layer boundaries are respected (UI → Backend → Agent → MCP → DB)
- [ ] All Phase II security and isolation requirements still apply

**Version**: 2.0.0 | **Ratified**: 2026-01-12 | **Last Amended**: 2026-01-22
