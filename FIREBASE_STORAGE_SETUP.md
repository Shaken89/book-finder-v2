# ⚠️ IMPORTANT: Firebase Storage NOT Used

## Instructor Clarification

**Firebase Storage is a PAID feature and is NOT required for the end-term assignment.**

## What We Use Instead

This project uses **Firestore Database** only (free tier):
- User authentication data (Firebase Auth)
- User favorites stored in Firestore
- Book data from Google Books API

## What Was Removed

The following features were removed because they required Firebase Storage:
- ❌ Profile picture upload
- ❌ Image compression with Web Worker
- ❌ Firebase Storage integration

## Current Implementation

- ✅ **Firestore Database**: Stores user favorites and authentication data
- ✅ **Firebase Auth**: User registration and login
- ✅ **Profile Page**: Shows user email, UID, and metadata (no photos)
- ✅ **100% Free Tier**: No paid features used

## Firebase Console Setup

You only need:
1. Firebase Authentication (Email/Password enabled)
2. Firestore Database (in test mode or with proper rules)

**You do NOT need Firebase Storage.**
