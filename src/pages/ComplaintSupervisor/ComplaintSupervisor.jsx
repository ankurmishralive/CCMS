import RolePage from '../RolePage';

function ComplaintSupervisor() {
	return <RolePage eyebrow="Complaint supervisor" title="Bring clarity to the queue." description="Review escalations, balance workloads, and give your service team the context they need to resolve complaints well." accent="teal" stats={[{ value: '42', label: 'team cases' }, { value: '07', label: 'awaiting review' }, { value: '92%', label: 'within SLA' }]} />;
}

export default ComplaintSupervisor;
