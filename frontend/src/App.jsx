import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const GOALS = [
  "AI/ML Engineer",
  "Data Scientist",
  "Data Analyst",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Cybersecurity Analyst",
];

// Backup result for the demo if the internet or API fails
const SAMPLE = {
  career_score: 62,
  interview_readiness: 45,
  current_skills: ["Python", "HTML", "CSS"],
  missing_skills: [
    { name: "Machine Learning", priority: "high" },
    { name: "Statistics", priority: "high" },
    { name: "SQL", priority: "high" },
    { name: "Deep Learning", priority: "medium" },
    { name: "MLOps", priority: "low" },
  ],
  roadmap: [
    { month: 1, focus: "Python + Statistics", topics: ["NumPy", "Pandas", "Probability"] },
    { month: 2, focus: "Machine Learning", topics: ["Scikit-learn", "Regression", "Classification"] },
    { month: 3, focus: "Deep Learning", topics: ["Neural networks", "CNN", "RNN"] },
    { month: 4, focus: "MLOps", topics: ["Docker", "FastAPI", "Model deployment"] },
  ],
  projects: [
    { level: "Beginner", title: "Spam Classifier", description: "Classify emails as spam or not using Naive Bayes." },
    { level: "Beginner", title: "House Price Predictor", description: "Predict prices with linear regression." },
    { level: "Intermediate", title: "Movie Recommender", description: "Build a content-based recommendation engine." },
    { level: "Intermediate", title: "Image Classifier", description: "Train a CNN on a small image dataset." },
    { level: "Advanced", title: "AI Interview Coach", description: "LLM app that asks and scores interview answers." },
    { level: "Advanced", title: "End-to-end ML API", description: "Train, containerize and deploy a model." },
  ],
  interview_questions: [
    { question: "What is overfitting?", answer_hint: "Model learns noise in training data and fails on new data. Fix with regularization, more data, cross-validation." },
    { question: "Difference between CNN and RNN?", answer_hint: "CNNs process spatial data like images; RNNs process sequences like text." },
    { question: "What is the bias-variance tradeoff?", answer_hint: "Simple models underfit (high bias), complex models overfit (high variance)." },
  ],
};

function barColor(v) {
  if (v >= 70) return "bg-green-500";
  if (v >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

function priorityStyle(p) {
  if (p === "high") return "bg-red-100 text-red-700 border-red-200";
  if (p === "medium") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-green-100 text-green-700 border-green-200";
}

function levelStyle(l) {
  if (l === "Beginner") return "bg-green-100 text-green-700";
  if (l === "Intermediate") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function StatCard({ title, value, suffix = "", bar }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">
        {value}
        {suffix}
      </p>
      {bar !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className={`h-2 rounded-full ${barColor(bar)}`}
            style={{ width: `${bar}%` }}
          />
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Dashboard({ data, goal, onReset }) {
  const skills = data.current_skills || [];
  const missing = data.missing_skills || [];
  const roadmap = data.roadmap || [];
  const projects = data.projects || [];
  const questions = data.interview_questions || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Your Career Report</h1>
          <p className="text-gray-500">Target role: {goal}</p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          Analyze another
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatCard title="Career Score" value={data.career_score} suffix="%" bar={data.career_score} />
        <StatCard title="Interview Readiness" value={data.interview_readiness} suffix="%" bar={data.interview_readiness} />
        <StatCard title="Missing Skills" value={missing.length} />
        <StatCard title="Recommended Projects" value={projects.length} />
      </div>

      <Section title="Skills you already have">
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
              {s}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Skill gaps">
        <div className="flex flex-wrap gap-2">
          {missing.map((s) => (
            <span
              key={s.name}
              className={`px-3 py-1 rounded-full border text-sm font-medium ${priorityStyle(s.priority)}`}
            >
              {s.name} · {s.priority}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Your roadmap">
        <div className="border-l-4 border-indigo-300 pl-6 space-y-6">
          {roadmap.map((m) => (
            <div key={m.month} className="relative">
              <span className="absolute -left-[34px] top-1 w-4 h-4 rounded-full bg-indigo-600" />
              <p className="text-sm font-semibold text-indigo-600">Month {m.month}</p>
              <p className="text-lg font-bold text-gray-900">{m.focus}</p>
              <p className="text-gray-600 text-sm mt-1">{(m.topics || []).join(" · ")}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Project recommendations">
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl shadow p-5">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${levelStyle(p.level)}`}>
                {p.level}
              </span>
              <p className="font-bold text-gray-900 mt-3">{p.title}</p>
              <p className="text-sm text-gray-600 mt-1">{p.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interview preparation">
        <div className="space-y-3">
          {questions.map((q, i) => (
            <details key={i} className="bg-white rounded-xl shadow p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">
                Q{i + 1}. {q.question}
              </summary>
              <p className="text-gray-600 text-sm mt-2">{q.answer_hint}</p>
            </details>
          ))}
        </div>
      </Section>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("resume");
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ name: "", education: "", skills: "" });
  const [goal, setGoal] = useState(GOALS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function analyze() {
    setError("");
    setLoading(true);
    try {
      let res;
      if (mode === "resume") {
        if (!file) throw new Error("Please choose a PDF resume first");
        const fd = new FormData();
        fd.append("file", file);
        fd.append("goal", goal);
        res = await fetch(`${API}/analyze-resume`, { method: "POST", body: fd });
      } else {
        if (!form.skills.trim()) throw new Error("Please enter your skills");
        res = await fetch(`${API}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, goal }),
        });
      }
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail || "Something went wrong, please try again");
      }
      setResult(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Dashboard data={result} goal={goal} onReset={() => setResult(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Career<span className="text-indigo-600">Catalyst</span> AI
          </h1>
          <p className="text-gray-600 mt-2">From Skills to Career Success with AI</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-lg p-1 mb-5">
            <button
              onClick={() => setMode("resume")}
              className={`py-2 rounded-md text-sm font-semibold ${mode === "resume" ? "bg-white shadow text-indigo-600" : "text-gray-500"}`}
            >
              Upload Resume
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`py-2 rounded-md text-sm font-semibold ${mode === "manual" ? "bg-white shadow text-indigo-600" : "text-gray-500"}`}
            >
              Enter Skills
            </button>
          </div>

          {mode === "resume" ? (
            <label className="block border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center cursor-pointer hover:bg-indigo-50">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <p className="text-indigo-600 font-semibold">
                {file ? file.name : "Click to choose your PDF resume"}
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF only</p>
            </label>
          ) : (
            <div className="space-y-3">
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Education (e.g. B.Tech CSE)"
                value={form.education}
                onChange={(e) => setForm({ ...form, education: e.target.value })}
              />
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Skills (e.g. Python, HTML, CSS)"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />
            </div>
          )}

          <label className="block text-sm font-semibold text-gray-700 mt-5 mb-1">
            Career goal
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 bg-white"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            {GOALS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
              <button
                onClick={() => {
                  setGoal("AI/ML Engineer");
                  setResult(SAMPLE);
                  setError("");
                }}
                className="block mt-2 underline font-semibold"
              >
                Load demo result instead
              </button>
            </div>
          )}

          <button
            onClick={analyze}
            disabled={loading}
            className="w-full mt-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Analyzing your profile..." : "Analyze"}
          </button>
        </div>
      </div>
    </div>
  );
}
