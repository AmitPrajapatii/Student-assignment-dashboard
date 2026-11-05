# 📚 Student Assignment Dashboard

A responsive, frontend-only dashboard for managing student assignments, with two roles: **Student** and **Admin (Professor)**. Built with plain HTML, CSS and JavaScript, with no build step and no dependencies. Data is saved in the browser's `localStorage`.

## Features

**Login and roles**
- Mock login with seeded users: 2 admins and 5 students (no real authentication).
- "Switch user" button in the header. Each user sees only their own data.

**Student view**
- Assignment list with title, description, due date, status (Submitted, Not submitted or Overdue) and a Drive link.
- Two-step submission: **Mark as submitted**, then **Yes, I have submitted**, then **Confirm submission**.
- Overall progress indicator, for example "3 of 5 submitted".

**Admin view**
- Create, edit and delete assignments, including a Drive link.
- Assign to all students or to selected students.
- Per-assignment student statuses (✓ / ✗) and a class completion progress bar.
- Admins see only the assignments they created.

**General**
- Responsive on mobile and desktop, with light and dark mode.
- Data survives a page refresh (`localStorage`).
- Loading, empty and error states (Retry and Reset data).

## Project structure

```
assignment-dashboard/
├── index.html        # page shell
├── css/
│   └── styles.css    # theme variables, layout, components
├── js/
│   ├── data.js       # seed users, assignments and submissions
│   ├── store.js      # state, localStorage, helpers
│   ├── views.js      # login, student, admin views, dialogs, form
│   └── app.js        # boot and event handlers
└── README.md
```

Scripts are plain `<script>` tags loaded in order (`data`, `store`, `views`, `app`), so the app also works when you open `index.html` directly.

## Run locally

Open `index.html` in your browser, or serve the folder:

```bash
python -m http.server 3000   # then open http://localhost:3000
# or
npx serve .
```

## Demo users

| Role    | Name                                                         |
|---------|--------------------------------------------------------------|
| Admin   | Prof. Rao, Prof. Mehta                                       |
| Student | Aarav Sharma, Diya Verma, Kabir Singh, Meera Iyer, Rohan Gupta |

## Deploy to GitHub Pages

1. Push this folder's contents to a GitHub repository.
2. Go to **Settings, then Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Data and storage

| Key           | Purpose                              |
|---------------|--------------------------------------|
| `sad_v1`      | Users, assignments and submissions   |
| `sad_session` | Currently signed-in user             |

Reset the demo by clearing these keys in DevTools (Application, then Local Storage), or use **Reset data** on the error screen.

```js
{
  users:       [{ id, name, role: "admin" | "student" }],
  assignments: [{ id, adminId, title, desc, due, link, assignees: "all" | [studentId] }],
  subs:        { [assignmentId]: { [studentId]: 1 } }
}
```

## Limitations

- Frontend-only demo: login is mocked, so don't use it for real student data.
- `localStorage` is per browser, so data is not shared between users or devices. To go multi-user, replace `load()` and `save()` in `js/store.js` with API calls.
- Submission is self-reported; the app doesn't verify Drive uploads.
