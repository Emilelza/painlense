# PainLens

### Understand pain trends across different observers.

PainLens is a pain-observation platform designed to help care teams understand how a patient's pain changes over time, even when different observers describe the same pain differently.

A patient's pain may be documented by nurses, doctors, caregivers, or other visitors using different words and scoring styles. PainLens turns these observations into structured pain scores and helps reveal the underlying trend.

---

## ✨ What PainLens Does

PainLens provides a simple workflow for care teams:

* **Add patients** and maintain their basic information.
* **Record patient visits** and pain observations.
* **Convert visit notes into structured pain scores.**
* **Account for differences between observers.**
* **Visualize the corrected pain trend** over multiple visits.
* Help care teams identify when pain is genuinely increasing or decreasing.

---

## 🏥 Main Workflow

```text
Add Patient
    ↓
Record Visit
    ↓
Enter Observer's Pain Note
    ↓
Generate Pain Score
    ↓
Correct Observer Differences
    ↓
View Pain Trend
```

### 1. Add a Patient

Care teams can create a patient profile and store the information needed to track their visits.

### 2. Record Observations

During a visit, an observer can record a patient's pain using a note or observation.

### 3. Convert the Note

PainLens processes the observation and represents the reported pain on a **0–10 scale**.

### 4. Correct Observer Differences

Different observers may naturally use different wording or scoring patterns.

PainLens accounts for these differences so that observations from multiple visitors can be compared more meaningfully.

### 5. View the Trend

The dashboard presents the patient's pain observations over time and provides a corrected trend that focuses on the underlying change rather than differences in observer style.

---

## 🎯 Problem

Pain is difficult to track consistently because different people can describe the same patient's condition differently.

For example:

```text
Nurse A → "Patient seems uncomfortable"       → 4/10

Nurse B → "Patient reports significant pain" → 7/10

Nurse C → "Mild discomfort observed"         → 3/10
```

These observations may not necessarily mean that the patient's actual pain changed dramatically.

The observer's reporting style can influence the recorded value.

PainLens aims to separate:

**Observer wording → Actual pain trend**

---

## 💡 Key Features

### Patient Management

* Add patients
* Store patient information
* Access individual patient records

### Visit & Observation Tracking

* Record patient visits
* Store pain-related observations
* Track observations across multiple visits

### Pain Scoring

* Convert observations into a 0–10 pain score
* Organize observations chronologically

### Observer Correction

* Account for differences in observer reporting style
* Produce a corrected pain trend

### Dashboard

* View patient information
* View pain observations
* Compare raw observations with the corrected trend
* Track changes over time

---

## 🖥️ Application Structure

```text
PainLens
│
├── Home
│   ├── Introduction
│   ├── About
│   └── View Patient
│
├── Access
│   └── Sign in
│
├── Patient Management
│   ├── Add Patient
│   └── Patient Details
│
└── Dashboard
    ├── Patient Information
    ├── Visit History
    ├── Pain Observations
    └── Corrected Pain Trend
```

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Lucide React
* Plus Jakarta Sans

### Backend

* Existing project backend
* API-based communication with the frontend

### Data

* Existing project data layer

> The frontend communicates with the existing backend APIs for patient and observation-related operations.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The frontend will then be available at the local development URL shown by Vite.

---

## 👤 Example Workflow

A typical care-team workflow looks like:

```text
Care Team
   │
   ▼
Add Patient
   │
   ▼
Select Patient
   │
   ▼
Record Visit
   │
   ▼
Enter Pain Observation
   │
   ▼
PainLens Processing
   │
   ▼
0–10 Pain Score
   │
   ▼
Observer Correction
   │
   ▼
Pain Trend
```

---

## 📌 Why PainLens?

Traditional visit records preserve what each observer wrote, but comparing observations across different people can be difficult.

PainLens focuses on the **trend across observations**, helping care teams see whether the patient's pain is actually changing over time.

---

## 📁 Project Structure

```text
project/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   └── ...
│
├── data/
│   └── ...
│
└── README.md
```

---

## 🔮 Future Scope

Possible future improvements include:

* More advanced pain trend analysis
* Additional observer calibration
* Improved natural-language pain extraction
* Long-term patient trend analysis
* Notifications for significant changes
* More detailed visit history
* Role-based care-team access

---

## Team

**PainLens** — A project focused on making pain observations easier to understand across different observers.
