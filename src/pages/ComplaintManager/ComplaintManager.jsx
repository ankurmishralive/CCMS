import RolePage from '../RolePage';

function ComplaintManager() {
	return <RolePage eyebrow="Complaint manager" title="Turn difficult cases into progress." description="See the full complaint lifecycle, coordinate decisions, and make sure every resolution is measured and meaningful." accent="lime" stats={[{ value: '126', label: 'active cases' }, { value: '12', label: 'escalated' }, { value: '89%', label: 'resolution rate' }]} />;
}

export default ComplaintManager;
