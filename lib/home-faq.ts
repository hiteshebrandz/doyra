/** Visible FAQ on the homepage. Structured data reads this same list. */
export const HOME_FAQ = [
  {
    q: "Is it free?",
    a: "Yes. There is no paid plan and nothing is locked behind one.",
  },
  {
    q: "Where is my data stored?",
    a: "In a Firebase project under your own sign-in (Google or email and password). Only you can read it. You can export everything as a JSON file from Settings, and delete all of it from the same page.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Once the app has loaded, tasks, habits and gym logs are cached on the device. Changes you make offline sync the next time you are online.",
  },
  {
    q: "Do reminders work in the browser?",
    a: "No. Reminders use Android notifications, so they only fire from the Android app. The browser version shows the reminder time on the task but stays quiet.",
  },
  {
    q: "Can I use it on a laptop?",
    a: "Yes. The browser version has a sidebar layout, keyboard shortcuts and the same cards as the phone. Sign in with the same account and you see the same data.",
  },
  {
    q: "What does the gym trainer do with my answers?",
    a: "Your level, goal and any notes are used to build the 7-day plan. You can also create a plan from a built-in template without the trainer. The plan is saved to your account and you can edit every exercise.",
  },
] as const;
