"use client";

import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

type Props = {
  instructorName: string | null;
  stats: {
    totalStudents: number;
    totalLessons: number;
    avgProgress: number;
    inProgress: number;
  };
  joinsByMonth: { month: string; count: number }[];
  completionsByMonth: { month: string; count: number }[];
  levelCounts: {
    beginner: number;
    intermediate: number;
    advanced: number;
    unknown: number;
  };
  lessonEngagement: { title: string; completed: number; inProg: number }[];
  recentStudents: {
    id: string;
    name: string;
    email: string;
    level: string | null;
    joinedAt: string;
    pct: number;
    total: number;
    done: number;
  }[];
  activityFeed: { type: string; text: string; time: string; dot: string }[];
};

const C = {
  ice: "#38bdf8",
  powder: "#7dd3fc",
  gold: "#f59e0b",
  rose: "#f43f5e",
  snow: "#f8fafc",
  slate: "#475569",
  green: "#22c55e",
  navy: "#0f172a",
};

const tooltipStyle = {
  contentStyle: {
    background: "#111827",
    border: "1px solid rgba(71,85,105,0.3)",
    borderRadius: 10,
    color: C.snow,
    fontSize: "0.78rem",
  },
  itemStyle: { color: C.snow },
  labelStyle: { color: C.slate, fontSize: "0.72rem" },
  cursor: { fill: "rgba(56,189,248,0.05)" },
};

function greeting(name: string | null) {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return `Good ${part}${name ? `, ${name.split(" ")[0]}` : ""} 👋`;
}

function LevelBadge({ level }: { level: string | null }) {
  const map: Record<string, { color: string; bg: string }> = {
    beginner: { color: C.ice, bg: "rgba(56,189,248,0.1)" },
    intermediate: { color: C.gold, bg: "rgba(245,158,11,0.1)" },
    advanced: { color: C.rose, bg: "rgba(244,63,94,0.1)" },
  };
  const s = level ? map[level.toLowerCase()] : null;
  if (!s) return <span style={{ color: C.slate, fontSize: ".72rem" }}>—</span>;
  return (
    <span
      style={{
        fontSize: ".65rem",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 100,
        color: s.color,
        background: s.bg,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {level}
    </span>
  );
}

export default function DashboardClient({
  instructorName,
  stats,
  joinsByMonth,
  completionsByMonth,
  levelCounts,
  lessonEngagement,
  recentStudents,
  activityFeed,
}: Props) {
  const levelPieData = [
    { name: "Beginner", value: levelCounts.beginner, color: C.ice },
    { name: "Intermediate", value: levelCounts.intermediate, color: C.gold },
    { name: "Advanced", value: levelCounts.advanced, color: C.rose },
    { name: "Unknown", value: levelCounts.unknown, color: C.slate },
  ].filter((d) => d.value > 0);

  const combinedMonthly = joinsByMonth.map((j, i) => ({
    month: j.month,
    joins: j.count,
    completions: completionsByMonth[i]?.count ?? 0,
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Lora:ital,wght@0,400;1,400&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        .db { font-family:'Sora',sans-serif; color:#f8fafc; }

        .db-hd  { margin-bottom:2rem; animation:fadeUp .4s ease both; }
        .db-eye { font-size:.68rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#38bdf8; margin-bottom:.5rem; }
        .db-title { font-family:'Lora',serif; font-size:2rem; font-weight:400; color:#f8fafc; margin-bottom:.3rem; }
        .db-sub { font-size:.85rem; color:#475569; font-weight:300; }

        .stat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:1rem; margin-bottom:2rem; }
        .stat-card { background:rgba(255,255,255,.025); border:1px solid rgba(71,85,105,.2); border-radius:14px; padding:1.3rem 1.4rem; display:flex; flex-direction:column; gap:.9rem; transition:border-color .2s,transform .2s; animation:fadeUp .4s ease both; }
        .stat-card:hover { border-color:rgba(71,85,105,.4); transform:translateY(-2px); }
        .stat-card:nth-child(1){animation-delay:.05s}.stat-card:nth-child(2){animation-delay:.1s}.stat-card:nth-child(3){animation-delay:.15s}.stat-card:nth-child(4){animation-delay:.2s}
        .stat-row { display:flex; align-items:center; justify-content:space-between; }
        .stat-ico { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .stat-ico svg { width:17px; height:17px; fill:none; stroke-width:1.75; stroke-linecap:round; stroke-linejoin:round; }
        .stat-delta { font-size:.68rem; font-weight:500; border-radius:100px; padding:.15rem .5rem; }
        .d-up   { color:#22c55e; background:rgba(34,197,94,.08); }
        .d-warn { color:#f59e0b; background:rgba(245,158,11,.08); }
        .stat-val { font-family:'Lora',serif; font-size:2rem; font-weight:400; color:#f8fafc; line-height:1; }
        .stat-lbl { font-size:.72rem; color:#475569; letter-spacing:.05em; margin-top:.2rem; }

        .sec-lbl { font-size:.68rem; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:#475569; margin-bottom:1rem; }

        .charts-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:2rem; animation:fadeUp .4s ease .25s both; }
        @media(max-width:900px){.charts-grid{grid-template-columns:1fr}}

        .chart-card { background:rgba(255,255,255,.025); border:1px solid rgba(71,85,105,.2); border-radius:14px; overflow:hidden; }
        .chart-head { padding:1.1rem 1.4rem .75rem; border-bottom:1px solid rgba(71,85,105,.12); }
        .chart-title { font-size:.85rem; font-weight:600; color:#f8fafc; }
        .chart-sub   { font-size:.7rem; color:#475569; margin-top:.2rem; }
        .chart-body  { padding:1.25rem 1rem 1rem; }

        .qa-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; margin-bottom:2rem; animation:fadeUp .4s ease .2s both; }
        .qa-card { background:rgba(255,255,255,.025); border:1px solid rgba(71,85,105,.2); border-radius:14px; padding:1.3rem; text-decoration:none; display:flex; flex-direction:column; gap:.9rem; transition:background .2s,border-color .2s,transform .2s; }
        .qa-card:hover { background:rgba(56,189,248,.05); border-color:rgba(56,189,248,.25); transform:translateY(-2px); }
        .qa-ico { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; }
        .qa-ico svg { width:19px; height:19px; fill:none; stroke-width:1.75; stroke-linecap:round; stroke-linejoin:round; }
        .qa-title { font-size:.88rem; font-weight:600; color:#f8fafc; margin-bottom:.2rem; }
        .qa-desc  { font-size:.75rem; color:#475569; font-weight:300; line-height:1.5; }
        .qa-arrow { font-size:.7rem; font-weight:500; color:#38bdf8; opacity:0; transition:opacity .2s; margin-top:auto; }
        .qa-card:hover .qa-arrow { opacity:1; }

        .bottom-grid { display:grid; grid-template-columns:1fr 300px; gap:1.25rem; animation:fadeUp .4s ease .35s both; }
        @media(max-width:900px){.bottom-grid{grid-template-columns:1fr}}

        .panel { background:rgba(255,255,255,.025); border:1px solid rgba(71,85,105,.2); border-radius:14px; overflow:hidden; }
        .panel-head { display:flex; align-items:center; justify-content:space-between; padding:1.1rem 1.4rem; border-bottom:1px solid rgba(71,85,105,.12); }
        .panel-title { font-size:.85rem; font-weight:600; color:#f8fafc; }
        .panel-link { font-size:.72rem; color:#38bdf8; text-decoration:none; font-weight:500; opacity:.7; transition:opacity .15s; }
        .panel-link:hover { opacity:1; }

        .stu-row { display:flex; align-items:center; gap:.8rem; padding:.85rem 1.4rem; border-bottom:1px solid rgba(71,85,105,.07); transition:background .15s; }
        .stu-row:last-child { border-bottom:none; }
        .stu-row:hover { background:rgba(255,255,255,.02); }
        .stu-av { width:32px; height:32px; min-width:32px; border-radius:50%; background:linear-gradient(135deg,#38bdf8,#7dd3fc); display:flex; align-items:center; justify-content:center; font-size:.68rem; font-weight:600; color:#0f172a; flex-shrink:0; }
        .stu-info { flex:1; min-width:0; }
        .stu-nm { font-size:.8rem; font-weight:500; color:#f8fafc; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .stu-mt { font-size:.68rem; color:#475569; margin-top:.1rem; }
        .prog-track { height:4px; background:rgba(71,85,105,.2); border-radius:2px; margin-top:.3rem; overflow:hidden; }
        .prog-fill  { height:100%; border-radius:2px; }

        .act-item { display:flex; align-items:flex-start; gap:.8rem; padding:.8rem 1.4rem; border-bottom:1px solid rgba(71,85,105,.07); }
        .act-item:last-child { border-bottom:none; }
        .act-dot { width:8px; height:8px; min-width:8px; border-radius:50%; margin-top:4px; flex-shrink:0; }
        .act-text { font-size:.76rem; color:#475569; line-height:1.5; }
        .act-text strong { color:#f8fafc; font-weight:500; }
        .act-time { font-size:.66rem; color:rgba(71,85,105,.5); margin-top:.15rem; }

        .empty-state { padding:3rem; text-align:center; color:#475569; font-size:.82rem; }
      `}</style>

      <div className="db">
        {/* Header */}
        <div className="db-hd">
          <p className="db-eye">Overview</p>
          <h1 className="db-title">{greeting(instructorName)}</h1>
          <p className="db-sub">
            Here's what's happening across your students today.
          </p>
        </div>

        {/* Stat cards */}
        <div className="stat-grid">
          {[
            {
              bgIco: "rgba(56,189,248,0.12)",
              stroke: C.ice,
              val: stats.totalStudents,
              lbl: "Total Students",
              delta: "All time",
              dcls: "d-up",
              icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
            },
            {
              bgIco: "rgba(245,158,11,0.12)",
              stroke: C.gold,
              val: stats.totalLessons,
              lbl: "Video Lessons",
              delta: "Published",
              dcls: "d-up",
              icon: "M23 7l-7 5 7 5V7zM1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1z",
            },
            {
              bgIco: "rgba(125,211,252,0.12)",
              stroke: C.powder,
              val: `${stats.avgProgress}%`,
              lbl: "Avg. Completion",
              delta: "All students",
              dcls: "d-up",
              icon: "M22 12h-4l-3 9L9 3l-3 9H2",
            },
            {
              bgIco: "rgba(34,197,94,0.12)",
              stroke: C.green,
              val: stats.inProgress,
              lbl: "In Progress",
              delta: "Active now",
              dcls: "d-warn",
              icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-10V6m0 6l4 2",
            },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-row">
                <div className="stat-ico" style={{ background: s.bgIco }}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={s.stroke}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={s.icon} />
                  </svg>
                </div>
                <span className={`stat-delta ${s.dcls}`}>{s.delta}</span>
              </div>
              <div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-lbl">{s.lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <p className="sec-lbl">Analytics</p>
        <div className="charts-grid">
          {/* Area — activity over time */}
          <div className="chart-card">
            <div className="chart-head">
              <div className="chart-title">Activity over time</div>
              <div className="chart-sub">
                New students & completions — last 6 months
              </div>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={combinedMonthly}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gJ" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.ice} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={C.ice} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.green} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(71,85,105,0.15)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: C.slate, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: C.slate, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="joins"
                    name="New students"
                    stroke={C.ice}
                    strokeWidth={2}
                    fill="url(#gJ)"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    name="Completions"
                    stroke={C.green}
                    strokeWidth={2}
                    fill="url(#gC)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  justifyContent: "center",
                  marginTop: "0.75rem",
                }}
              >
                {[
                  { color: C.ice, label: "New students" },
                  { color: C.green, label: "Completions" },
                ].map((l) => (
                  <div
                    key={l.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.7rem",
                      color: C.slate,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: l.color,
                      }}
                    />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar — lesson engagement */}
          <div className="chart-card">
            <div className="chart-head">
              <div className="chart-title">Lesson engagement</div>
              <div className="chart-sub">
                Completions & in-progress per lesson (top 5)
              </div>
            </div>
            <div className="chart-body">
              {lessonEngagement.length === 0 ? (
                <div className="empty-state">No lessons yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={lessonEngagement}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(71,85,105,0.15)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="title"
                      tick={{ fill: C.slate, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: C.slate, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip {...tooltipStyle} />
                    <Bar
                      dataKey="completed"
                      name="Completed"
                      fill={C.ice}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                    <Bar
                      dataKey="inProg"
                      name="In progress"
                      fill={C.gold}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Pie — level distribution */}
          <div className="chart-card">
            <div className="chart-head">
              <div className="chart-title">Student levels</div>
              <div className="chart-sub">Distribution across skill levels</div>
            </div>
            <div className="chart-body">
              {levelPieData.length === 0 ? (
                <div className="empty-state">No students yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={levelPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {levelPieData.map((e, i) => (
                        <Cell key={i} fill={e.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle.contentStyle}
                      itemStyle={tooltipStyle.itemStyle}
                    />
                    <Legend
                      formatter={(v) => (
                        <span style={{ color: C.slate, fontSize: "0.72rem" }}>
                          {v}
                        </span>
                      )}
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Progress bars — completion rate per lesson */}
          <div className="chart-card">
            <div className="chart-head">
              <div className="chart-title">Completion rate</div>
              <div className="chart-sub">
                % of students who finished each lesson
              </div>
            </div>
            <div className="chart-body">
              {lessonEngagement.length === 0 ? (
                <div className="empty-state">No lessons yet.</div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                    padding: "0.25rem 0",
                  }}
                >
                  {lessonEngagement.map((l, i) => {
                    const tot = l.completed + l.inProg;
                    const pct =
                      tot > 0 ? Math.round((l.completed / tot) * 100) : 0;
                    const bar =
                      pct >= 70 ? C.ice : pct >= 40 ? C.gold : C.slate;
                    return (
                      <div key={i}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "0.3rem",
                          }}
                        >
                          <span style={{ fontSize: "0.73rem", color: C.snow }}>
                            {l.title}
                          </span>
                          <span style={{ fontSize: "0.7rem", color: C.slate }}>
                            {pct}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: 6,
                            background: "rgba(71,85,105,0.2)",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: bar,
                              borderRadius: 3,
                              transition: "width .6s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <p className="sec-lbl">Quick actions</p>
        <div className="qa-grid">
          {[
            {
              href: "/instructor/upload",
              bgIco: "rgba(56,189,248,0.12)",
              stroke: C.ice,
              title: "Upload Lesson",
              desc: "Add a new video lesson for your students.",
              icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
            },
            {
              href: "/instructor/videos",
              bgIco: "rgba(245,158,11,0.12)",
              stroke: C.gold,
              title: "My Videos",
              desc: "Manage and organize your uploaded lessons.",
              icon: "M23 7l-7 5 7 5V7zM1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1z",
            },
            {
              href: "/instructor/students",
              bgIco: "rgba(125,211,252,0.12)",
              stroke: C.powder,
              title: "Students",
              desc: "View all students and their progress.",
              icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
            },
          ].map((a) => (
            <Link href={a.href} key={a.href} className="qa-card">
              <div className="qa-ico" style={{ background: a.bgIco }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={a.stroke}
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={a.icon} />
                </svg>
              </div>
              <div>
                <div className="qa-title">{a.title}</div>
                <div className="qa-desc">{a.desc}</div>
              </div>
              <span className="qa-arrow">Go →</span>
            </Link>
          ))}
        </div>

        {/* Bottom: students + activity */}
        <div className="bottom-grid">
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">Recent Students</span>
              <Link href="/instructor/students" className="panel-link">
                View all →
              </Link>
            </div>
            {recentStudents.length === 0 ? (
              <div className="empty-state">No students yet.</div>
            ) : (
              recentStudents.map((s) => {
                const initials = s.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                const bar =
                  s.pct >= 75 ? C.ice : s.pct >= 40 ? C.gold : C.slate;
                return (
                  <div className="stu-row" key={s.id}>
                    <div className="stu-av">{initials || "?"}</div>
                    <div className="stu-info">
                      <div className="stu-nm">{s.name}</div>
                      <div className="stu-mt">
                        {s.done}/{s.total} lessons done
                      </div>
                      <div className="prog-track">
                        <div
                          className="prog-fill"
                          style={{ width: `${s.pct}%`, background: bar }}
                        />
                      </div>
                    </div>
                    <LevelBadge level={s.level} />
                  </div>
                );
              })
            )}
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">Recent Activity</span>
            </div>
            {activityFeed.length === 0 ? (
              <div className="empty-state">No activity yet.</div>
            ) : (
              activityFeed.map((a, i) => (
                <div className="act-item" key={i}>
                  <div className="act-dot" style={{ background: a.dot }} />
                  <div>
                    <div className="act-text">{a.text}</div>
                    <div className="act-time">{a.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
