import { useEffect, useMemo, useState } from "react";
import LandingPage from "./pages/LandingPage.jsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function getPath() {
  return window.location.pathname || "/";
}

function formatScore(value) {
  return typeof value === "number" ? value.toFixed(value % 1 === 0 ? 0 : 1) : "-";
}

export default function App() {
  const [path, setPath] = useState(getPath);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath, replace = false) => {
    if (replace) {
      window.history.replaceState({}, "", nextPath);
    } else {
      window.history.pushState({}, "", nextPath);
    }
    setPath(nextPath);
  };

  const signOut = () => {
    setToken(null);
    navigate("/access");
  };

  const api = useMemo(() => {
    return async (endpoint, options = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        setToken(null);
        navigate("/access", true);
        throw new Error("Unauthorized");
      }

      return response;
    };
  }, [token]);

  if (path === "/access") {
    return <AccessPage navigate={navigate} setToken={setToken} />;
  }

  if (path === "/patient") {
    return <PatientPage api={api} navigate={navigate} signOut={signOut} token={token} />;
  }

  return <LandingPage navigate={navigate} />;
}

function Logo() {
  return (
    <div className="logo" aria-label="PainLens">
      <span className="logo-mark">P</span>
      <span>PainLens</span>
    </div>
  );
}



function AccessPage({ navigate, setToken }) {
  const [mode, setMode] = useState("signin");

  // Sign-in state
  const [patientId, setPatientId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // New patient state
  const [newPatientId, setNewPatientId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newCareType, setNewCareType] = useState("palliative care");
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId.trim(), password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Invalid ID or password");
        } else {
          setError(`Sign in failed (status ${response.status})`);
        }
        return;
      }

      const result = await response.json();
      setToken(result.token);
      navigate("/patient");
    } catch (err) {
      setError("Backend unreachable. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (event) => {
    event.preventDefault();
    setCreateError("");

    const pid = newPatientId.trim();
    const name = newName.trim();
    const ageNum = Number(newAge);
    const pwd = newPassword;

    if (!pid || !name || !Number.isInteger(ageNum) || ageNum < 0 || !pwd) {
      setCreateError("Enter a Patient ID, Name, valid Age, and Password.");
      return;
    }

    setCreateLoading(true);

    try {
      const createResponse = await fetch(`${API_BASE}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: pid,
          name,
          age: ageNum,
          care_type: newCareType.trim() || "palliative care",
          password: pwd,
        }),
      });

      const createResult = await createResponse.json();

      if (!createResponse.ok) {
        setCreateError(createResult.error || "Unable to add patient.");
        return;
      }

      // Automatically sign in as the newly created patient
      const loginResponse = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: pid, password: pwd }),
      });

      if (!loginResponse.ok) {
        setPatientId(pid);
        setPassword(pwd);
        setMode("signin");
        setError("Patient created! Please sign in with your credentials.");
        return;
      }

      const loginResult = await loginResponse.json();
      setToken(loginResult.token);
      navigate("/patient");
    } catch (err) {
      setCreateError("Backend unreachable. Please ensure the backend server is running.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <main className="access-page">
      <div className="access-panel">
        <Logo />
        <div className="access-tabs">
          <button
            className={`access-tab ${mode === "signin" ? "active" : ""}`}
            onClick={() => {
              setMode("signin");
              setError("");
            }}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`access-tab ${mode === "create" ? "active" : ""}`}
            onClick={() => {
              setMode("create");
              setCreateError("");
            }}
            type="button"
          >
            Add new patient
          </button>
        </div>

        {mode === "signin" ? (
          <form onSubmit={handleSignIn} style={{ display: "grid", gap: "18px" }}>
            <div>
              <p className="eyebrow">Patient access</p>
              <h1>Open demo record</h1>
            </div>
            <label>
              Patient ID
              <input
                autoComplete="username"
                placeholder="CR-001"
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
              />
            </label>
            <label>
              Password
              <input
                autoComplete="current-password"
                placeholder="demo123"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="primary-button" disabled={loading} type="submit" style={{ width: "100%" }}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className="hint">Try CR-001 / demo123</p>
          </form>
        ) : (
          <form onSubmit={handleCreatePatient} style={{ display: "grid", gap: "14px" }}>
            <div>
              <p className="eyebrow">New patient setup</p>
              <h1>Create patient</h1>
            </div>
            <div className="patient-form-grid">
              <label>
                Patient ID
                <input
                  placeholder="CR-002"
                  value={newPatientId}
                  onChange={(event) => setNewPatientId(event.target.value)}
                />
              </label>
              <label>
                Password
                <input
                  placeholder="demo456"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </label>
              <label>
                Name
                <input
                  placeholder="Patient name"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                />
              </label>
              <label>
                Age
                <input
                  inputMode="numeric"
                  placeholder="72"
                  value={newAge}
                  onChange={(event) => setNewAge(event.target.value)}
                />
              </label>
            </div>
            <label>
              Care type
              <input
                value={newCareType}
                onChange={(event) => setNewCareType(event.target.value)}
              />
            </label>
            {createError ? <p className="error">{createError}</p> : null}
            <button className="primary-button" disabled={createLoading} type="submit" style={{ width: "100%" }}>
              {createLoading ? "Creating patient..." : "Add & Sign in"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function PatientPage({ api, navigate, signOut, token }) {
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPatient = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api("/api/patient");
      const data = await response.json();
      setPatientData(data);
    } catch (err) {
      if (err.message !== "Unauthorized") {
        setError("Unable to load patient");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/access", true);
      return;
    }
    loadPatient();
  }, [token]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <Logo />
        <div className="topbar-actions">
          <button className="secondary-button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {error ? <p className="error page-message">{error}</p> : null}
      {loading ? <p className="loading page-message">Loading patient...</p> : null}
      {patientData ? <PatientSummary api={api} data={patientData} onUpdate={setPatientData} reload={loadPatient} /> : null}
    </main>
  );
}

function PatientSummary({ api, data, onUpdate, reload }) {
  const visits = data.visits;
  const latest = visits[visits.length - 1];
  const previous = visits[visits.length - 2];
  const delta =
    latest && previous && typeof latest.corrected === "number" && typeof previous.corrected === "number"
      ? latest.corrected - previous.corrected
      : null;

  const careTypeFormatted = data.patient.care_type
    ? data.patient.care_type.charAt(0).toUpperCase() + data.patient.care_type.slice(1)
    : "Palliative care";

  return (
    <section className="w-full px-6 md:px-10 py-8 space-y-8 flex flex-col items-start text-left box-border">
      {/* Patient Header Row */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200/80">
        {/* Left: Patient Details */}
        <div className="flex flex-col items-start text-left space-y-1">
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
            PATIENT RECORD
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B1F3A] tracking-tight whitespace-normal md:whitespace-nowrap">
            {data.patient.name}
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base pt-0.5">
            {data.patient.id} · Age {data.patient.age} · {careTypeFormatted}
          </p>
        </div>

        {/* Right: Fixed-width Status / Alert Card */}
        <div
          className={`w-full md:w-[320px] shrink-0 p-4 rounded-2xl border transition-all ${
            data.alert.active
              ? "bg-rose-50/90 border-rose-200 text-rose-900"
              : "bg-blue-50/80 border-blue-100 text-blue-900"
          }`}
        >
          <div className="flex flex-col gap-1">
            <span
              className={`text-xs font-extrabold uppercase tracking-wider ${
                data.alert.active ? "text-rose-700" : "text-blue-600"
              }`}
            >
              {data.alert.active ? "Alert active" : "Status"}
            </span>
            <strong className="text-sm md:text-base font-bold leading-snug whitespace-normal">
              {data.alert.active ? data.alert.message : "No active alert"}
            </strong>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Metric label="Latest corrected" value={formatScore(latest?.corrected)} detail={latest?.date || "-"} />
        <Metric label="Change from prior" value={delta === null ? "-" : `${delta >= 0 ? "+" : ""}${formatScore(delta)}`} detail="Last 2 visits" />
        <Metric label="Total visits" value={visits.length} detail="Recorded notes" />
      </div>

      {/* Two Line Charts Side-by-Side (Stacked on Mobile) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RawPainScoresChart visits={visits} />
        <CorrectedPainTrendChart visits={visits} />
      </div>

      {/* Observer Adjustment Cards (Under Charts) */}
      <div className="w-full">
        <AdjustmentPanel adjustments={data.adjustments} />
      </div>

      {/* Setup & Composer Panels */}
      <div className="w-full space-y-6">
        <PatientCreator api={api} />
        <VisitComposer api={api} onUpdate={onUpdate} reload={reload} />
      </div>

      {/* Visit List at Bottom */}
      <div className="w-full">
        <VisitList visits={visits} />
      </div>
    </section>
  );
}

function Metric({ label, value, detail }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function RawPainScoresChart({ visits }) {
  const chartData = visits.map((visit, index) => {
    const obs = (visit.observer || "").toUpperCase();
    const isA = obs.includes("A");
    const isB = obs.includes("B");
    const isC = obs.includes("C");
    return {
      visitNum: index + 1,
      visitId: visit.id,
      date: visit.date ? visit.date.slice(5) : `V${index + 1}`,
      "Visitor A": isA && typeof visit.raw === "number" ? visit.raw : null,
      "Visitor B": isB && typeof visit.raw === "number" ? visit.raw : null,
      "Visitor C": isC && typeof visit.raw === "number" ? visit.raw : null,
    };
  });

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between h-[360px] w-full">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-slate-900">Raw pain scores</h2>
      </div>
      <div className="w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="visitNum"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 12, fill: "#64748b", fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', sans-serif" }}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 12, fill: "#64748b", fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', sans-serif" }}
            />
            <Tooltip
              contentStyle={{
                fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', sans-serif",
                fontSize: "12px",
                borderRadius: "12px",
                borderColor: "#e2e8f0",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', sans-serif",
                paddingTop: "6px",
              }}
            />
            <Line
              type="linear"
              dataKey="Visitor A"
              stroke="#2563eb"
              strokeWidth={2.5}
              connectNulls={true}
              dot={{ r: 4, fill: "#2563eb" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="linear"
              dataKey="Visitor B"
              stroke="#16a34a"
              strokeWidth={2.5}
              connectNulls={true}
              dot={{ r: 4, fill: "#16a34a" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="linear"
              dataKey="Visitor C"
              stroke="#ea580c"
              strokeWidth={2.5}
              connectNulls={true}
              dot={{ r: 4, fill: "#ea580c" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CorrectedPainTrendChart({ visits }) {
  const chartData = visits.map((visit, index) => ({
    visitNum: index + 1,
    visitId: visit.id,
    date: visit.date ? visit.date.slice(5) : `V${index + 1}`,
    corrected: typeof visit.corrected === "number" ? visit.corrected : null,
  }));

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between h-[360px] w-full">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-slate-900">Corrected pain trend</h2>
      </div>
      <div className="w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="correctedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="visitNum"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 12, fill: "#64748b", fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', sans-serif" }}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 12, fill: "#64748b", fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', sans-serif" }}
            />
            <Tooltip
              contentStyle={{
                fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', sans-serif",
                fontSize: "12px",
                borderRadius: "12px",
                borderColor: "#e2e8f0",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              formatter={(value) => [typeof value === "number" ? value.toFixed(1) : "-", "Corrected Score"]}
            />
            <Area
              type="monotone"
              dataKey="corrected"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#correctedFill)"
              dot={{ r: 4, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#1d4ed8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AdjustmentPanel({ adjustments }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Observer bias</p>
          <h2>Score adjustments</h2>
        </div>
      </div>
      <div className="adjustments">
        {Object.entries(adjustments).map(([observer, value]) => (
          <div className="adjustment" key={observer}>
            <div>
              <strong>Visitor {observer}</strong>
              <span>{value > 0 ? "Tends higher" : value < 0 ? "Tends lower" : "Aligned"}</span>
            </div>
            <b>{value >= 0 ? "+" : ""}{formatScore(value)}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function PatientCreator({ api }) {
  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [careType, setCareType] = useState("palliative care");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const numericAge = Number(age);
    if (!patientId.trim() || !name.trim() || !Number.isInteger(numericAge) || numericAge < 0 || !password) {
      setMessage("Enter an ID, name, age, and password.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const response = await api("/api/patients", {
        method: "POST",
        body: JSON.stringify({
          patient_id: patientId.trim(),
          name: name.trim(),
          age: numericAge,
          care_type: careType.trim() || "palliative care",
          password,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to add patient.");
      }

      setMessage(`Added ${result.patient.name}. Sign out and use ${result.patient.id} / ${password}.`);
      setPatientId("");
      setName("");
      setAge("");
      setPassword("");
      setCareType("palliative care");
    } catch (err) {
      if (err.message !== "Unauthorized") {
        setMessage(err.message || "Unable to add patient.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel composer">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Patient setup</p>
          <h2>Add patient</h2>
        </div>
      </div>
      <form onSubmit={submit}>
        <div className="patient-form-grid">
          <label>
            Patient ID
            <input value={patientId} onChange={(event) => setPatientId(event.target.value)} placeholder="CR-002" />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="demo456" type="password" />
          </label>
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Patient name" />
          </label>
          <label>
            Age
            <input inputMode="numeric" value={age} onChange={(event) => setAge(event.target.value)} placeholder="72" />
          </label>
        </div>
        <label>
          Care type
          <input value={careType} onChange={(event) => setCareType(event.target.value)} />
        </label>
        <div className="composer-actions">
          <button className="primary-button" disabled={busy} type="submit">
            Add patient
          </button>
        </div>
        {message ? <p className="hint">{message}</p> : null}
      </form>
    </section>
  );
}

function VisitComposer({ api, onUpdate, reload }) {
  const [observer, setObserver] = useState("Visitor A");
  const [note, setNote] = useState("");
  const [score, setScore] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const scoreNote = async () => {
    if (!note.trim()) {
      setMessage("Add a note before scoring.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const response = await api("/api/score-note", {
        method: "POST",
        body: JSON.stringify({ observer, note }),
      });
      if (!response.ok) {
        throw new Error("Score failed");
      }
      const result = await response.json();
      setScore(String(result.score));
      setMessage(`Score ${result.score} from ${result.provider || "scorer"}: ${result.reason}`);
    } catch (err) {
      if (err.message !== "Unauthorized") {
        setMessage("Unable to score note.");
      }
    } finally {
      setBusy(false);
    }
  };

  const submitVisit = async (event) => {
    event.preventDefault();
    const numericScore = Number(score);
    if (!note.trim() || !Number.isInteger(numericScore) || numericScore < 0 || numericScore > 10) {
      setMessage("Enter a note and a 0-10 score.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const response = await api("/api/visits", {
        method: "POST",
        body: JSON.stringify({ observer, note, score: numericScore }),
      });
      if (!response.ok) {
        throw new Error("Save failed");
      }
      const data = await response.json();
      onUpdate(data);
      setNote("");
      setScore("");
      setMessage("Visit saved.");
      reload();
    } catch (err) {
      if (err.message !== "Unauthorized") {
        setMessage("Unable to save visit.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel composer">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">New visit</p>
          <h2>Add observer note</h2>
        </div>
      </div>
      <form onSubmit={submitVisit}>
        <div className="composer-row">
          <label>
            Observer
            <select value={observer} onChange={(event) => setObserver(event.target.value)}>
              <option>Visitor A</option>
              <option>Visitor B</option>
              <option>Visitor C</option>
            </select>
          </label>
          <label>
            Raw score
            <input
              inputMode="numeric"
              max="10"
              min="0"
              value={score}
              onChange={(event) => setScore(event.target.value)}
              placeholder="0-10"
            />
          </label>
        </div>
        <label>
          Note
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Describe pain and mobility observed during the visit."
          />
        </label>
        <div className="composer-actions">
          <button className="secondary-button" disabled={busy} onClick={scoreNote} type="button">
            Score note
          </button>
          <button className="primary-button" disabled={busy} type="submit">
            Save visit
          </button>
        </div>
        {message ? <p className="hint">{message}</p> : null}
      </form>
    </section>
  );
}

function VisitList({ visits }) {
  return (
    <section className="visits panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">History</p>
          <h2>Visit notes</h2>
        </div>
      </div>
      <div className="visit-list">
        {[...visits].reverse().map((visit) => (
          <article className="visit" key={visit.id}>
            <div className="visit-header">
              <div>
                <strong>{visit.date}</strong>
                <span>{visit.observer}</span>
              </div>
              <div className="scores">
                <span>Raw {formatScore(visit.raw)}</span>
                <span>Corrected {formatScore(visit.corrected)}</span>
              </div>
            </div>
            <p>{visit.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
