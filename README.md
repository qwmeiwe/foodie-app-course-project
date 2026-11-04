# Foodie App

A recipe discovery and personal recipe-book app built with Expo and React Native. This project is structured for import into [Expo Snack](https://snack.expo.dev/) from a public GitHub repository.

## Features

- Browse recipes across 12 horizontally scrolling categories and search by name.
- Open recipe details for ingredients, step-by-step instructions, cooking time, servings, calories, and difficulty.
- Save and remove favorites; one recipe is favorited on first launch as a working example.
- Add recipes with an image from the photo library, ingredients, instructions, category, and optional recipe details.
- View, edit, and delete personal recipes.
- Persist personal recipes and favorites on the device with AsyncStorage.
- Navigate back from recipe details, favorites, My Recipes, and the recipe form.

## Run in Expo Snack

1. Open [snack.expo.dev](https://snack.expo.dev/) and choose **Import Git Repository**.
2. Import the public [`foodie-app` branch](https://github.com/qwmeiwe/foodie-app-course-project/tree/foodie-app).
3. Allow the listed dependencies to install, then open the project in Expo Go or the Snack web preview.

The photo-library picker requires a supported Expo Go/device runtime. The app uses sample remote recipe photos for the built-in collection.

## Run locally

```sh
npm install
npm start
```
