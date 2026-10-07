import { dashboardData } from './dashboardData.js';

export default function DashboardStats({ savedJobsCount }) {
  return (
    <section className="dashboard-stats" aria-label="Your dashboard stats">
      {dashboardData.stats.map((stat) => {
        const value = stat.id === 'saved-jobs' ? savedJobsCount : stat.value;

        return (
          <article className="dashboard-panel dashboard-stat-card" key={stat.id}>
            <h2>{stat.label}</h2>
            <p className="dashboard-stat-value-row">
              <span className="dashboard-stat-value" style={{ color: stat.color }}>
                {value}
              </span>
              <span>{stat.note}</span>
            </p>
          </article>
        );
      })}
    </section>
  );
}
