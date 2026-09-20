import { useEffect, useMemo, useState } from "react";

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

function LandingPage({ navigate }) {
  return (
    <main className="landing">
      <section className="hero">
        <Logo />
        <div className="hero-copy">
          <p className="eyebrow">Synthetic demo - not for clinical use</p>
          <h1>PainLens</h1>
          <p>Track reported pain, observer bias, and short-term trend alerts for a demo palliative care patient.</p>
        </div>
        <button className="primary-button" onClick={() => navigate("/access")}>
          View Patient
        </button>
      </section>
      <section className="hero-panel" aria-label="PainLens preview">
        <div>
          <span>Corrected trend</span>
          <strong>5.4</strong>
        </div>
        <div className="mini-bars">
          {[32, 54, 52, 62, 72].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </section>
    </main>
  );
}

function AccessPage({ navigate, setToken }) {
  const [patientId, setPatientId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
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
        setError("Invalid ID or password");
        return;
      }

      const result = await response.json();
      setToken(result.token);
      navigate("/patient");
    } catch {
      setError("Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="access-page">
      <form className="access-panel" onSubmit={submit}>
        <Logo />
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
        <button className="primary-button" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="hint">Demo: CR-001 / demo123</p>
      </form>
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
          <span className="status-pill">Demo access</span>
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

  return (
    <section className="patient-layout">
      <div className="summary-band">
        <div>
          <p className="eyebrow">Patient record</p>
          <h1>{data.patient.name}</h1>
          <p>
            {data.patient.id} - Age {data.patient.age} - {data.patient.care_type}
          </p>
        </div>
        <div className={data.alert.active ? "alert active" : "alert"}>
          <span>{data.alert.active ? "Alert active" : "Status"}</span>
          <strong>{data.alert.active ? data.alert.message : "No active alert"}</strong>
        </div>
      </div>

      <div className="metrics">
        <Metric label="Latest corrected" value={formatScore(latest?.corrected)} detail={latest?.date || "-"} />
        <Metric label="Change from prior" value={delta === null ? "-" : `${delta >= 0 ? "+" : ""}${formatScore(delta)}`} detail="Last 2 visits" />
        <Metric label="Total visits" value={visits.length} detail="Recorded notes" />
      </div>

      <div className="workspace-grid">
        <TrendPanel visits={visits} />
        <AdjustmentPanel adjustments={data.adjustments} />
      </div>

      <PatientCreator api={api} />
      <VisitComposer api={api} onUpdate={onUpdate} reload={reload} />
      <VisitList visits={visits} />
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

function TrendPanel({ visits }) {
  const recent = visits.slice(-8);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Trend</p>
          <h2>Corrected pain scores</h2>
        </div>
      </div>
      <div className="chart" aria-label="Corrected pain score chart">
        {recent.map((visit) => {
          const score = typeof visit.corrected === "number" ? visit.corrected : 0;
          return (
            <div className="chart-column" key={visit.id}>
              <span className="chart-value">{formatScore(visit.corrected)}</span>
              <div className="chart-track">
                <span className="chart-bar" style={{ height: `${Math.max(6, score * 10)}%` }} />
              </div>
              <span className="chart-label">{visit.date.slice(5)}</span>
            </div>
          );
        })}
      </div>
    </section>
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
          <p className="eyebrow">Demo setup</p>
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
