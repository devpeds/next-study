# Gemini Project Context: @topic/isr

This document provides the context for the Gemini AI assistant to understand and effectively assist with this project.

## Project Overview

This is a Next.js app intended for comparison among SSR, SSG and ISR.

## About Experiments

### Experiment 1

This experiment is about how the page type(SSR, SSG, ISR) affects web vitals. All pages include same features:

- Renders 10000 posts to generate a large content page
- Applies streaming SSR (for a long list)

### Experiment 2

This experiment is about how the page type affects server workload. All pages include same features:

- Renders 50 posts to generate a normal content page

## Pages

The application includes home(`/`), all experiment pages(e.g `/experiment-1`) and all necessary pages for the experiment.
