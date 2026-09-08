function RolePage({ eyebrow, title, description, stats, accent }) {
	return (
		<main className="role-main">
			<section className={`role-panel role-panel-${accent}`} aria-labelledby="role-title">
				<div className="role-copy">
					<p className="eyebrow">{eyebrow}</p>
					<h1 id="role-title">{title}</h1>
					<p className="welcome-copy">{description}</p>
				</div>
				<div className="role-stats" aria-label={`${eyebrow} summary`}>
					{stats.map((stat) => (
						<div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
					))}
				</div>
				<div className="role-placeholder">
					<span className="status-dot" aria-hidden="true" />
					<span>Workspace ready for your next action</span>
				</div>
			</section>
		</main>
	);
}

export default RolePage;
