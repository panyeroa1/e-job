<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1cRol24IV1k-vHfBB-q0uFLzG6ZHu4bJ5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## URL Endpoints

Once running, access these routes:

### Main Application Routes

- **Home/Landing**: `http://localhost:5173/`
- **Admin Login**: `http://localhost:5173/admin-login`
- **Admin Portal**: `http://localhost:5173/admin` (requires authentication)

### Interview & Resume Routes

- **Applicant Resume**: `http://localhost:5173/applicant-resume?id=<applicant_id>`
- **AI Interview (D-ID)**: `http://localhost:5173/interview-embed/`
- **Vision Capture**: `http://localhost:5173/interview-embed/vision.html`
- **Vision Display**: `http://localhost:5173/interview-embed/image.html`

### Standalone Pages

- **Resume Display (Standalone)**: `http://localhost:5173/applicant-resume.html?id=<applicant_id>`

### Admin Credentials

- **Email**: `admin@eburon.ai`
- **Password**: `Password25`

