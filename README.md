# ProjectHub

Hey, this is ProjectHub. It's a full-stack, team-based project and task management app. 

I built this to really get my hands dirty with complex relational data modeling, role-based access control, and nested resources. It’s a fully functional MVP, but with a catch (read below).

## The Elephant in the Room: The Tech Stack & Why I'm Retiring This

**The Stack:** Node.js, Express, MongoDB, Mongoose, EJS, Tailwind CSS.

**The Catch:** I am intentionally stopping development here and retiring this codebase. 

Why? Because building this app taught me exactly why MongoDB isn't the right tool for highly relational data. Since MongoDB lacks native `FOREIGN KEY` constraints and `ON DELETE CASCADE` behaviors, I had to handle all relational integrity manually in the application layer. 

For example, when a user deletes a Project, the app has to manually query all associated Tasks, delete all Comments attached to those Tasks, delete the Tasks, and *then* delete the Project. Doing this manually was a massive pain, but it gave me a deep, practical appreciation for relational databases. 

Because of this, **my next project will be built with TypeScript, React, PostgreSQL, and Drizzle ORM.** This repo is a completed milestone and a portfolio piece, not a living product.

## What it actually does

- **Team Workspaces:** Create projects and invite existing users by username or email. 
- **Task Management:** Create tasks, assign them to team members, set priorities/due dates, and track status (Todo, In Progress, Done).
- **Nested Discussions:** Leave comments on tasks. Permissions are strictly enforced so only the comment author or the project owner can delete them.
- **Actionable Dashboard:** Aggregates your owned projects, shared projects, assigned tasks, and explicitly highlights overdue items.
- **Custom Avatars:** Secure image uploads using Multer (memory storage) and ImageKit, with automatic orphan file cleanup when you replace your avatar.
- **Neobrutalism UI:** I got tired of standard Tailwind templates, so I built a custom Neobrutalism design system from scratch (hard borders, solid shadows, no rounded corners).

## The Hard Part: Data Integrity

The hardest part of this project wasn't the frontend; it was preventing orphaned data. 

Because I was using Mongoose, I had to write explicit cascading logic everywhere:
- Deleting a project cascades to tasks, which cascades to comments.
- Removing a member from a project runs an `updateMany` to nullify the `assignedTo` field on all their tasks.
- Changing a task status to "done" automatically timestamps the `completedAt` field.

If you're looking at this repo to learn how to handle complex state synchronization in a document database, check out `controllers/projects.js` and `middleware.js`.

## Known Limitations

- **No User Account Deletion:** Users can't delete their own accounts. Doing so would require complex logic to decide what happens to their owned projects, shared projects, and orphaned comments. 
- **No Real-time Updates:** Task status changes and comments require a page refresh.
- **No Password Reset:** "Forgot password" flow isn't implemented.

## Running it locally

If you want to poke around:

1. Clone and install (requires `pnpm`):
   ```bash
   git clone <repo-url>
   cd projecthub
   pnpm install
   ```

2. Set up your `.env` file based on `.env.example`. You'll need a MongoDB connection string, a session secret, and ImageKit API keys if you want the avatar uploads to work.
   ```env
   DB_URL=mongodb://127.0.0.1:27017/projecthub
   SESSION_SECRET=your_secret_here
   NODE_ENV=development
   PORT=3000
   IMAGEKIT_PUBLIC_KEY=...
   IMAGEKIT_PRIVATE_KEY=...
   IMAGEKIT_URL_ENDPOINT=...
   ```

3. Start the server and the CSS watcher in separate terminals:
   ```bash
   pnpm run dev
   # in another terminal
   pnpm run watch:css
   ```
