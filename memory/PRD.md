# PRD — AI Virtual Try-On (V1)

## Original Problem Statement
# Role: Expert Computer Vision Mobile Engineer
# Goal: Build V1 of a AI Virtual Try-On (VTON) and Wardrobe Recommendation App.

## 1. Project Overview & Tech Stack
- FRONTEND: React Native + Expo (Mobile-First approach).
- BACKEND/API: Python FastAPI (Placeholder endpoints for now).
- DATABASES: Supabase (Auth + Relational Data + Image Storage), ChromaDB (Vector embeddings for recommendations).
- CORE ML FEATURES (To be wired later): Image Segmentation, IDM-VTON (Virtual Try-On), Vision-LLM Tagging.

## 2. Directory Structure & App Scaffold
Initialize the Expo app inside an `/app/mobile_wardrobe` directory.
Create the following essential UI screens:
1. **Digital Wardrobe:** A grid view of all uploaded clothing items.
2. **Add Item (Camera/Gallery):** A screen utilizing `expo-camera` and `expo-image-picker` to capture photos of clothes or the user's body.
3. **Virtual Try-On Studio:** A split-screen interface. Top half shows the user's base photo. Bottom half is a horizontal scroll of their wardrobe. Selecting an item triggers a loading state while we "generate" the try-on image.
4. **Outfit Recommender:** A screen that suggests combinations based on a mock "weather" or "occasion" input.

## 3. Core Local State & Hooks
- Create a Zustand or Context store to manage:
  - `userWardrobe` (Array of objects: id, image_url, category, tags).
  - `userBodyProfile` (The base image of the user for try-on).
  - `currentOutfit` (The generated VTON image).

## 4. API Service Placeholders
Create an `api/ml_services.ts` file with the following mock asynchronous functions that we will later connect to our FastAPI backend:
- `segmentClothingItem(imageUri)`: Mocks removing the background of a clothing photo.
- `generateVirtualTryOn(bodyImageUri, clothingItemUri)`: Mocks sending the two images to a diffusion model and returning a combined image.
- `getRecommendations(context)`: Mocks querying ChromaDB for matching outfits.

## First Step Instruction
Do not write all the code at once.
1. First, initialize the Expo project with the navigation structure (Wardrobe, Camera, Try-On, Recommendations).
2. Set up the camera and image picker permissions and functionality.
3. Stop and await my approval before building the API connection layer.

## Architecture Decisions
- Used Expo Router tabs for the four primary mobile flows: Wardrobe, Add Item, Try-On, Recommendations.
- Added a lightweight React Context store to manage `userWardrobe`, `userBodyProfile`, and `currentOutfit` locally.
- Added Expo Camera and Expo Image Picker with mobile permission configuration in `app.json`.
- Kept recommendation and try-on behavior local/mock in the UI only; no API service layer created yet.

## Implemented So Far
- Initialized `/app/mobile_wardrobe` as an Expo app using Expo Router.
- Added tab navigation for Wardrobe, Add Item, Try-On Studio, and Recommendations.
- Built the Digital Wardrobe screen with empty state, item grid, and body-profile status.
- Built the Add Item screen with camera permission flow, gallery picker flow, capture mode toggle (clothing/body), category chips, and local save behavior.
- Built the Try-On Studio starter UI with body-photo panel, horizontal wardrobe strip, item selection, and local loading/generation placeholder.
- Built the Recommendations screen with mock weather/occasion selectors and local suggestion logic.
- Verified with `npx tsc --noEmit` and `npx expo export --platform web`.

## Prioritized Backlog
### P0
- Add `api/ml_services.ts` mock service layer.
- Wire Try-On screen to async placeholder service calls instead of local timeout logic.
- Wire Recommendations screen to async placeholder recommendation service.

### P1
- Add Supabase auth and image storage integration.
- Add persistent local/session storage for wardrobe state.
- Improve garment metadata entry (manual tags, category editing, deletion).

### P2
- Add segmentation preview UX and upload progress indicators.
- Add onboarding guidance for better body-photo capture.
- Add favorites, outfit history, and recommendation explanations.

## Next Tasks
1. After approval, create the API placeholder layer in `api/ml_services.ts`.
2. Connect the Try-On and Recommendations screens to those async mocks.
3. Then scaffold the FastAPI placeholder endpoints and Supabase-ready data contracts.


## Update — Preview + Persistence Fixes
- Fixed the non-responsive preview by creating `/app/frontend` and `/app/backend` service wrappers expected by the preview environment and restarting supervisor-managed services.
- Frontend preview now launches the Expo Router app from `/app/mobile_wardrobe` on port 3000 with cache clearing for route changes.
- Added local persistence with AsyncStorage so `userWardrobe`, `userBodyProfile`, and `currentOutfit` survive app restarts.
- Removed the legacy starter tab route from the visible tab bar.
- Verified with `npx tsc --noEmit`, local preview HTTP checks, FastAPI health check, and Playwright screenshot tests including saved-state reload.
