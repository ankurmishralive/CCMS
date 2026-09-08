import RolePage from '../RolePage';

function TeamLead() {
	return <RolePage eyebrow="Team lead" title="Help the team do their best work." description="Keep an eye on capacity, coach through complex conversations, and turn daily signals into better service." accent="gold" stats={[{ value: '08', label: 'team members' }, { value: '31', label: 'cases today' }, { value: '94%', label: 'team efficiency' }]} />;
}

export default TeamLead;
