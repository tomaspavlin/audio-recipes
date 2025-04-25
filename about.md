We want to create an app for smart step-by-step recipe reading. Instead of having to grope with dirty hands on the phone while cooking, the app will voice simple commands. The commands examples: “Next”, “What was the previous step?”

Make a responsive web app.

It should work in the following steps:

It gets a text with a recipe on the input. First, it breaks that recipe down into actionable steps. Then it will read those steps and wait for voice instructions like "Next" before it reads the next step each time.

# UX:

## Landing page

Here's how the landing page might be visually structured:
Header Section:

-   App logo (centered or top-left)
-   App motto/tagline — “Recipes you can hear — no more greasy screens.”

Main Interaction Area:

-   Large, inviting text box for recipe input
-   Submit button: “Start Cooking” or something more thematic (“Read My Recipe”, “Let’s Cook”)
-   Optional: Paste example button (“Try with sample recipe”)

Footer or subtle lower section:

-   Brief explanation of how it works (1-2-3 steps)

Maybe link to “How it works” modal or small walkthrough

-   UX Tips

Make the text area big and inviting — don’t make users think

Let users paste in anything (it’s okay if it’s messy — you’ll clean it on backend)

The submit button could have an icon (e.g. a chef’s hat or microphone)

## Tech Stack

-   Both frontend and backend: Next.js
    -   Frontend will use the app directory structure
    -   Backend will us the API routes in app/api/ROUTE-NAME/route.ts
-   Use typescript very well
-   Use Material UI for the frontend
