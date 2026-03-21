# Frontend Context & UI Architecture Blueprint

## 1. FRONTEND PROJECT OVERVIEW
The frontend is the visible "face" of our Medicine Image Extraction System. While the Node.js and Python microservices do the heavy lifting in the background, the frontend is the web interface where the user actually interacts with the project. 

Its role in the full system is to be the user-friendly bridge: it collects the medicine image from the user, cleanly passes it to the backend, and transforms the raw JSON data returned by the backend into a beautiful, readable format.

From the frontend, a user should be able to:
- Select a local photo of a medicine box.
- See a preview of the photo before uploading.
- Click a button to process the image.
- Instantly see the extracted medicine name, expiry date, batch number, and price.
- Scroll down to see a history table of all previously uploaded and extracted medicines.

## 2. WHAT THE FRONTEND ACTUALLY NEEDS TO DO
The core tasks of the frontend are state management and API communication.

- **Upload Flow**: Handle file selection, validate the file on the client browser (e.g., check if it's an image and not too large), show a visual preview, and package the file into a `FormData` object to send to the server.
- **Result Display Flow**: Take the JSON response from the successful upload API call and map those fields to user interface (UI) elements like a "Result Card". 
- **Saved Records/History Flow**: Fetch the list of all past extractions from the backend database when the page loads, and render them in a list or table.
- **Backend Dependency**: The frontend relies entirely on the Node.js API to do the actual data saving and AI processing. The frontend is "dumb"—it only shows what the backend tells it to show.

## 3. CORE FEATURES TO BUILD

- **Image Upload Area**: A drag-and-drop zone or a simple file input box.
- **Image Preview**: A thumbnail that appears once a user selects an image, confirming their selection.
- **Upload Button**: A distinct button to trigger the API request. 
- **Loading State**: A spinner or progress bar that appears during the AI processing (which can take a few seconds).
- **Extraction Result Display**: A prominent card that shows the 4 key extracted fields immediately after a successful upload.
- **Saved Medicines List/History**: A data table showing historical records fetched from MongoDB.
- **Error Handling UI**: Toast notifications or red text alerts that show up if the backend is down, the file is too large, or the AI fails.

## 4. FULL FRONTEND WORKFLOW MAP

```text
[User selects image file]
         │
         ▼
[Frontend shows local image preview] 
         │
         ▼
[User clicks "Extract Data"] -> Frontend sets loading state = true
         │
         ▼
[Frontend sends FormData to Node.js `POST /api/medicine/upload`]
         │
         ▼
(Backend does Python/AI extraction and saves to MongoDB)
         │
         ▼
[Frontend receives JSON response] -> Frontend sets loading state = false
         │
         ▼
[Frontend displays extracted data in Result Card]
         │
         ▼
[Frontend refreshes Saved Medicines List to show the new entry]
```

**Failure Flow**: If the API returns a 400/500 code -> Frontend catches the error -> loading state = false -> Frontend displays a red error box with the error message.

## 5. FULL FRONTEND WORKING EXPLANATION
- **When the page opens**: The React app mounts. The `useEffect` hook immediately triggers a fetch call to `GET /api/medicine`. The response populates the "Saved Medicines List" at the bottom of the page.
- **When user selects an image**: The frontend captures the file object using the `<input type="file">` `onChange` event. It uses `URL.createObjectURL()` to instantly display a preview of the local image.
- **When upload button is clicked**: The frontend puts the file into a `FormData` object. It changes the `isLoading` state to `true` (which disables the button and shows a spinner). It makes a `POST` request to the backend using Axios or fetch.
- **After backend response comes**: The `isLoading` state is set to `false`. The frontend saves the server's response into a `currentResult` state variable. The UI reacts to this state change and renders the "Result Card" showing the extracted fields. It then re-fetches the `GET /api/medicine` API to refresh the history table.
- **When saved list loads**: The frontend maps over the array of historical objects and renders a table row for each one, extracting the image URL and the text fields.

## 6. RECOMMENDED FRONTEND ARCHITECTURE
- **Framework**: React (using Vite for fast building). React's component-based nature perfectly fits our UI needs (a dedicated component for the uploader, another for the result card, etc.).
- **Component Architecture**: Keep it modular. Smart parent component (`Home.jsx`) handles the API connections and state. Dumb child components (`ResultCard.jsx`, `MedicineTable.jsx`) just receive data via props and render it.
- **State Management**: Simple local state (`useState`) is more than enough. We don't need Redux. Redux is for massive applications with deep state sharing. Here, a single page app can easily pass state down as props.

## 7. BEST DEVELOPMENT APPROACH
To build this smoothly without getting overwhelmed:

- **Phase 1: Basic Layout & Setup**: Initialize React. Set up the basic grid (header, left column, right column). Add hardcoded placeholder text.
- **Phase 2: Upload UI & Preview**: Build the file input, get the image preview working in the browser. No API yet.
- **Phase 3: Backend API Integration (Upload)**: Connect the upload button to the Node.js backend. `console.log` the response.
- **Phase 4: Result Card**: Take the real backend response and render the extracted fields to the screen. 
- **Phase 5: Saved Records Table**: Add the `GET` request on page load and build the history table.
- **Phase 6: Polishing and Error States**: Add loading spinners, error alerts, and make the design look premium.

*Why this order?* It builds incrementally. You see visual progress early (preview working), connect the hardest part (API) in the middle, and polish at the end.

## 8. FRONTEND FOLDER STRUCTURE

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                 // React entry point
    ├── App.jsx                  // Main application wrapper
    ├── index.css                // Global styles / Tailwind setup
    ├── components/
    │   ├── Header.jsx           // Top navigation/title bar
    │   ├── UploadForm.jsx       // Contains file input and submit button
    │   ├── ImagePreview.jsx     // Renders the selected image thumbnail
    │   ├── ResultCard.jsx       // Displays the 4 extracted fields
    │   ├── MedicineTable.jsx    // Data table for historical records
    │   ├── Loader.jsx           // Reusable loading spinner
    │   └── ErrorMessage.jsx     // Reusable error alert box
    ├── pages/
    │   └── Home.jsx             // The main container combining all components
    └── services/
        └── api.js               // Centralized Axios calls to backend
```

## 9. COMPONENT STRUCTURE
- **`Header.jsx`**: Simple stateless component displaying the company logo/project title.
- **`UploadForm.jsx`**: Handles the drag-and-drop or click-to-upload logic. Passes the selected file to the parent.
- **`ImagePreview.jsx`**: Takes a file URL prop and renders an `<img>` tag cleanly.
- **`ResultCard.jsx`**: Accepts a `medicineData` object prop and renders the Medicine Name, Expiry, Batch, and Price in a stylized card. 
- **`MedicineTable.jsx`**: Accepts an array of `medicines` prop and renders a table. Handles the layout of historical data.
- **`Loader.jsx`**: A visual indicator (spinner or pulse) during API calls.
- **`ErrorMessage.jsx`**: A red box to show API failures cleanly.

## 10. PAGE STRUCTURE
For this project demo, a **One-Page Layout** (`Home.jsx`) is perfectly sufficient and highly recommended. 
- You don't need a complex router (React Router) for a single extraction utility. 
- Everything related to the extraction can live on one dashboard view. 

*If* expanding in the future:
- `/` (Home - Upload)
- `/history` (All records)
- `/medicine/:id` (Detailed view of a single extraction)

## 11. UI LAYOUT PLAN
A clean, dashboard-style layout (using a 2-column grid on desktop):

1. **Top Header**: Project Title + simple subtitle.
2. **Main Workspace (Grid)**:
   - **Left Column**: The Upload Card. Clean box containing the `UploadForm` and `ImagePreview`. The Upload button sits below the preview.
   - **Right Column**: The `ResultCard`. Hidden until an upload is complete. Once data arrives, it displays the extracted fields with large, clear typography.
3. **Bottom Workspace**: Full-width section below the main workspace containing the `MedicineTable` showing "Recent Extractions".

## 12. API INTEGRATION DESIGN
The frontend will have a `services/api.js` file organizing our backend requests using Axios.

1. **`POST /api/medicine/upload`**
   - **Why**: To send the image to the AI for processing.
   - **When**: Triggered when the user clicks the "Extract Data" button.
   - **Response**: The structured JSON object containing `.data` (the 4 fields).
   
2. **`GET /api/medicine`**
   - **Why**: To fetch the history.
   - **When**: Triggered on initial page mount (`useEffect`), and re-triggered instantly after a successful `POST` upload.
   - **Response**: An array of previously saved medicine records.

## 13. FRONTEND STATE DESIGN
The `Home.jsx` page will manage these state variables:

- `selectedFile` (File | null): The image file chosen by the user.
- `previewUrl` (String | null): The local browser URL for the `<img src>` preview.
- `isLoading` (Boolean): True when waiting for the AI backend. Disables buttons.
- `uploadError` (String | null): Holds error messages if the upload fails.
- `currentResult` (Object | null): The data object returned from the successful upload. Powers the Result Card.
- `medicinesHistory` (Array): The list of past records fetched from the database. Powers the Table.

## 14. DATA FLOW DESIGN
1. **User Action**: User selects an image.
2. **Component State**: `selectedFile` and `previewUrl` are updated. The UI shows the preview.
3. **User Action**: User clicks Upload.
4. **API Call**: `isLoading` becomes true. Request goes to Node.js.
5. **Response**: Backend replies success.
6. **State Update**: `isLoading` becomes false. `currentResult` is filled with response data. `medicinesHistory` is re-fetched.
7. **UI Update**: Result Card appears showing `currentResult`. The Table adds a new row at the top.

## 15. IMAGE UPLOAD HANDLING
- **Selection**: Ensure `<input type="file" accept="image/jpeg, image/png" />`.
- **Preview**: Generate using `const objectUrl = URL.createObjectURL(file)`. Must revoke the URL later to prevent memory leaks if the file is replaced.
- **FormData**: Because you are sending a binary file, you cannot use standard JSON. You must do:
  ```javascript
  const formData = new FormData();
  formData.append('image', selectedFile);
  axios.post('/api/medicine/upload', formData)
  ```
- **Validation**: Check `file.size` before uploading. If `> 5MB`, show an alert instantly without hitting the backend.

## 16. RESULT DISPLAY DESIGN
The `ResultCard.jsx` should be visually satisfying. 
- Use large text for Medicine Name.
- Use distinct pill-shaped badges for Expiry Date and Batch Number.
- **Handling missing fields**: If the AI returns `null` for the price, gracefully show "Not Detected" in a faded gray text, rather than leaving a weird empty space. 

## 17. SAVED MEDICINES LIST DESIGN
A Table design is best for the history.
- **Columns**: Thumbnail Image, Medicine Name, Expiry, Batch, Price, Uploaded Date.
- **Image**: Since the backend returns a relative URL (`/uploads/filename.jpg`), the frontend must prefix it with the backend server URL (e.g., `http://localhost:3000/uploads/...`) to render `<img src>`.
- **Sorting**: The backend already returns newest first (`createdAt: -1`). The frontend just renders the array top-down.

## 18. LOADING, EMPTY, AND ERROR STATES
- **No File Selected**: The upload button should be disabled (`disabled={!selectedFile}`).
- **Uploading (Loading)**: The upload button text changes to "Processing AI..." and a spinner icon spins. The file input is disabled so the user doesn't interrupt it.
- **Success**: Confetti or a smooth green checkmark animation. Loading spinner hides. Result card fades in.
- **Failure**: A red alert box under the upload button describing what went wrong.
- **Empty List State**: If there are no saved medicines in MongoDB, show a friendly illustration or text "No medicine records found. Upload an image to begin."

## 19. VALIDATION RULES
Frontend validation creates a snappy user experience without waiting for a server error.
- **Only Images**: Check `file.type.startsWith('image/')`. 
- **Max File Size**: Check `if (file.size > 5 * 1024 * 1024) throw Error`.
- **Empty Upload**: Ensure button is unclickable if `selectedFile` is null.

## 20. STYLING APPROACH
**RECOMMENDATION: Tailwind CSS.**
- **Why**: It allows for incredibly fast execution, requires zero custom CSS files, and produces highly professional, modern UI designs directly within React components. It is the perfect choice for an impressive company/project demo. It gives you flexbox, grids, rounded corners, and shadows with simple class names like `flex justify-center rounded-lg shadow-md`.

## 21. RESPONSIVE DESIGN PLAN
- **Mobile (< 768px)**: Everything stacks vertically (Header top, Upload underneath, Result under that, History list at the very bottom). History table scrolls horizontally.
- **Desktop (> 768px)**: Use a 2-column grid. Left side upload, right side results. History table takes full width below.

## 22. TESTING PLAN FOR FRONTEND
Before showing the final demo, test these manual flows:
1. Try to upload without selecting a file (should be blocked).
2. Select a valid image, verify the preview appears correctly.
3. Upload the image, verify the loading spinner clearly appears.
4. Wait for response, verify the result card shows the exact 4 fields.
5. Verify the new record instantly appears at the top of the history list.
6. Turn off the backend terminal, try an upload, and ensure a clean red error message appears, not a broken page crash.

## 23. REAL-WORLD FRONTEND CHALLENGES
- **Slow AI**: Gemini might take 5-10 seconds. The frontend must clearly indicate that it is working so the user doesn't click upload twice.
- **Missing Images in History**: Ensure the Express backend serves static files correctly so the `image_url` actually loads an image on the frontend browser.
- **Date Formatting**: The `createdAt` field from MongoDB is a raw ISO string. The frontend must use `new Date(date).toLocaleDateString()` to make it human-readable.

## 24. WHAT IS MANDATORY VS OPTIONAL
- **Mandatory MVP**: Upload form, call API, Result Card, error messages.
- **Good Improvements**: History table with API fetch.
- **Advanced Enhancements**: Skeleton loaders instead of spinners, click-to-enlarge image modal, deleting records.

## 25. WHAT MAY BE MISSING FROM BACKEND FOR FRONTEND TO WORK WELL
*(Good news: Our backend already handles most of these, but this is what the frontend relies on!)*
- **CORS enabled**: If the Node backend doesn't have `app.use(cors())`, the frontend browser will block all API calls. (We enabled this in `app.js`).
- **Static file serving**: The frontend needs to load the saved images to show in the history table. The backend must expose the uploads folder (e.g., `app.use('/uploads', express.static(...))`). (We enabled this in `app.js`).

## 26. PROFESSIONAL FRONTEND SUMMARY
"The frontend architecture is designed as a modular, responsive React Application using Tailwind CSS for rapid, premium styling. It follows a centralized state model to manage the image extraction flow. By decoupling the presentation logic from HTTP operations using a dedicated API service layer, the application maintains a clean separation of concerns. The interface is optimized for user experience with real-time file previews, distinct loading states during AI processing, and a synchronized data table that reflects MongoDB state in real-time."

## 27. FINAL ACTION PLAN (Frontend Checklist)
1. [ ] Run `npm create vite@latest frontend -- --template react`
2. [ ] Install Tailwind CSS, Axios, and React Icons.
3. [ ] Build the basic page layout (Grid) in `App.jsx`.
4. [ ] Build the `UploadForm` and `ImagePreview` components.
5. [ ] Write `services/api.js` to connect `axios` to `http://localhost:3000`.
6. [ ] Connect the Upload button to the endpoint and build the `ResultCard`.
7. [ ] Build the `MedicineTable` component and connect it to `GET /api/medicine`.
8. [ ] Polish the UI: Add loading states, empty states, and handle errors.
