import RolePage from '../RolePage';

function SupportEngineer() {
	return <RolePage eyebrow="Support engineer" title="Solve the issue behind the issue." description="Investigate technical complaints, share clear updates, and connect the right fix to the right customer context." accent="blue" stats={[{ value: '09', label: 'technical cases' }, { value: '03', label: 'active incidents' }, { value: '98%', label: 'system health' }]} />;
}

export default SupportEngineer;
