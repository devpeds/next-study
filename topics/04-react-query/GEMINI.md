# Gemini Project Context: @topic/04-react-query

This document provides the context for the Gemini AI assistant to understand and effectively assist with this project.

## Project Overview

This is a Next.js app intended to evaluate the appropriate use cases for TanStack Query within App Router.

## Project Structure

- `src/`
  - `app/`
    - `api/posts/route.ts`: Contains the collection of REST api.
      - `GET`: Get a list of posts with the given `size` (default = 20). Can sort the list with the given `sort` (`asc`/`desc`. default = `asc`)
      - `POST`: Create post entry with the mock data.
      - `DELETE`: Delete post with the given `id`.
    - `lab-1/`: Contains the pages related to Lab 1.
      - `page.tsx`: The entry page of lab 1. Contains explanation of the lab and links of sub-pages. All sub-pages provides same features & UI: 1) fetch a list of 20 posts. 2) render the list of posts. 3) button to sort the post list (asc/desc). 4) a button to create a post 4) delete button on each post card
      - `server/page.tsx`: A page built with RSC & Server Actions
      - `react-query/page.tsx`: A page built with React Query API
    - `lab-2/`: Contains the page related to Lab 2
      - `page.tsx`: The entry page of lab 2. Contains explanation of the lab and links of sub-pages. All sub-pages provides same features & UI: 1) fetch a long post list (> 10000) for a long response time. 2) render the list of posts
      - `server/page.tsx`: A page built with RSC (No Suspense)
      - `server-suspense/page.tsx`: A page built with RSC (Suspense)
      - `server-edge/page.tsx`: A page built with RSC on Edge runtime (Suspense)
      - `react-query/page.tsx`: A page built with React Query API (No hydration strategy)
      - `react-query-hydration/page.tsx`: A page built with React Query API (Hydration)
  - `components/`: Contains the shared components.
  - `api.ts`: Contains functions to call REST API on `app/api/posts/route.ts`.
